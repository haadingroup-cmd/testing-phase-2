import test from 'node:test';
import assert from 'node:assert/strict';
import { generateKeyPairSync, verify } from 'node:crypto';
import { authorizedGoogleMetrics } from '../../src/lib/seo/google-data';
import { newFullCrawl } from '../../src/lib/seo/full-crawl';
import { saveJob, ownedJob, recentJobs, withJobLock } from '../../src/lib/seo/job-store';
import { input } from './fixtures';

test('Google access requires both exact host and authorized profile before any provider request', async t => {
  t.mock.method(globalThis, 'fetch', async () => { throw new Error('Unexpected request'); });
  process.env.SEO_GOOGLE_PROPERTIES_JSON = JSON.stringify({'audit-example.com': {gsc:'sc-domain:audit-example.com', allowedProfileIds:['owner']}});
  await assert.rejects(authorizedGoogleMetrics('https://audit-example.com', 'other'), /not connected/);
  await assert.rejects(authorizedGoogleMetrics('https://foreign-example.com', 'owner'), /not connected/);
  assert.equal((fetch as any).mock.calls.length, 0);
  delete process.env.SEO_GOOGLE_PROPERTIES_JSON;
});

test('Google adapter signs read-only authorization and retains source units and missing-data states', async t => {
  const keys = generateKeyPairSync('rsa', {modulusLength:2048});
  process.env.SEO_GOOGLE_PROPERTIES_JSON = JSON.stringify({'audit-example.com': {gsc:'sc-domain:audit-example.com', ga4:'123', allowedProfileIds:['owner']}});
  process.env.GOOGLE_SERVICE_ACCOUNT_JSON = JSON.stringify({client_email:'test@example.invalid',private_key: keys.privateKey.export({type:'pkcs8',format:'pem'})});
  let tokens = 0;
  t.mock.method(globalThis, 'fetch', async (url: any, init: any) => {
    if (String(url).endsWith('/token')) {
      const assertion = init.body.get('assertion');
      const [header, payload, sig] = assertion.split('.');
      const claims = JSON.parse(Buffer.from(payload,'base64url').toString());
      assert.ok(claims.scope.endsWith('.readonly'));
      assert.ok(verify('RSA-SHA256', Buffer.from(`${header}.${payload}`), keys.publicKey, Buffer.from(sig,'base64url')));
      tokens++;
      return Response.json({access_token:'fixture-token'});
    }
    assert.equal(init.headers.Authorization,'Bearer fixture-token');
    if (String(url).includes('searchAnalytics')) return Response.json({rows:[{clicks:10,impressions:100,ctr:0.1,position:7.23}]});
    return Response.json({});
  });
  try {
    const result = await authorizedGoogleMetrics('https://audit-example.com','owner');
    assert.equal(tokens, 2);
    assert.equal(result.metrics.find(m=>m.key==='gsc-ctr')?.value,10);
    assert.equal(result.metrics.find(m=>m.key==='ga4-0')?.value,null);
    assert.equal(result.errors.length,0);
  } finally { delete process.env.GOOGLE_SERVICE_ACCOUNT_JSON; delete process.env.SEO_GOOGLE_PROPERTIES_JSON; }
});

test('persistent jobs survive serialization, enforce ownership and use lightweight history', async t => {
  process.env.UPSTASH_REDIS_REST_URL='https://redis.example.invalid';
  process.env.UPSTASH_REDIS_REST_TOKEN='fixture';
  const job = newFullCrawl(input,'owner');
  const values = new Map<string,string>();
  const commands: string[] = [];
  t.mock.method(globalThis,'fetch',async (_url:any, init:any) => {
    const c = JSON.parse(init.body); commands.push(c[0]);
    let result:any = null;
    if(c[0]==='EVAL' && c[2]===2) { values.set(c[3],c[5]); values.set(c[4],c[6]); result=1; }
    if(c[0]==='GET') result=values.get(c[1]);
    if(c[0]==='ZREVRANGE') result=[job.id];
    if(c[0]==='MGET') result=c.slice(1).map((key:string)=>values.get(key)||null);
    if(c[0]==='SET') result=null;
    return Response.json({result});
  });
  try {
    await saveJob(job);
    assert.deepEqual(await ownedJob(job.id,'owner'),job);
    await assert.rejects(ownedJob(job.id,'other'),/not found/);
    const before = commands.filter(c=>c==='GET').length;
    assert.equal((await recentJobs('owner'))[0].id,job.id);
    assert.deepEqual(await recentJobs('other'),[]);
    assert.equal(commands.filter(c=>c==='GET').length,before);
    let ran=false;
    assert.equal(await withJobLock(job.id,async()=>{ran=true;return true;}),null);
    assert.equal(ran,false);
  } finally { delete process.env.UPSTASH_REDIS_REST_URL; delete process.env.UPSTASH_REDIS_REST_TOKEN; }
});
