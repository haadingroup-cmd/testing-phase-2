import test from 'node:test';
import assert from 'node:assert/strict';
import { parseTrafficCSV, trafficTotals, projectValue, supplementSchema } from '../../src/lib/seo/business-insights';
import { parseAuditInput } from '../../src/lib/seo/input';
import { crawlWebsite } from '../../src/lib/seo/crawler';
import { fixtureFetcher, input } from './fixtures';

test('GSC daily CSV retains zero, sorts dates and calculates weighted CTR',()=>{
  const d=parseTrafficCSV('\uFEFFDate,Clicks,Impressions,CTR,Position\r\n2026-09-02,0,10,0%,5\r\n2026-09-01,10,100,10%,3','gsc-csv','USD');
  assert.equal(d.points[0].date,'2026-09-01');
  const t=trafficTotals(d);assert.equal(t.traffic,10);assert.equal(t.impressions,110);assert.equal(t.revenue,null);assert.equal(t.ctr,10/110*100);
});
test('GA4 comments, quoted thousands and YYYYMMDD dates import without double counting users',()=>{
 const d=parseTrafficCSV('# Google Analytics export\nDate,Sessions,Total users,Total revenue\n20260901,"1,250",500,350.50\n20260902,0,0,-10','ga4-csv','SAR');
 assert.equal(trafficTotals(d).traffic,1250);assert.equal(trafficTotals(d).revenue,340.5);
});
test('CSV import rejects duplicates, invalid dates, extra dimensions, formulas and missing values',()=>{
 for(const text of ['Date,Clicks\n2026-09-01,4\n2026-09-01,5','Date,Clicks\n2026-02-30,4','Date,Clicks,Country\n2026-09-01,4,UK','Date,Clicks\n2026-09-01,=10+5','Date,Clicks\n2026-09-01,','Date,Clicks,Impressions\n2026-09-01,10,2','Date,Clicks\nTotal,10']) assert.throws(()=>parseTrafficCSV(text,'gsc-csv','USD'));
 assert.throws(()=>parseTrafficCSV('Top queries,Clicks\nseo,10','gsc-csv','USD'));
});
test('partial revenue stays unavailable, not silently zero',()=>{
 const d=parseTrafficCSV('Date,Sessions,Total revenue\n20260901,5,10\n20260902,4,','ga4-csv','USD');
 assert.equal(trafficTotals(d).revenue,null);
});
test('planning distinguishes missing inputs, zero sales and gross revenue from ad value',()=>{
 const p={visits:1000,conversion:2,saleValue:50,cpc:3,fee:500,currency:'USD' as const};
 assert.deepEqual(projectValue(p),{orders:20,revenue:1000,trafficValue:3000,revenueToFee:2});
 assert.equal(projectValue({...p,conversion:0}).revenue,0);
 assert.equal(projectValue({...p,conversion:null}).revenue,null);
 assert.equal(projectValue({...p,fee:0}).revenueToFee,null);
 assert.equal(supplementSchema.safeParse({traffic:null,projection:{...p,conversion:101}}).success,false);
 assert.equal(supplementSchema.safeParse({traffic:null,projection:{...p,visits:Infinity}}).success,false);
});
test('five selected competitors are normalized, crawled and scored; a sixth is rejected',async()=>{
 const urls=['a','b','c','d','e'].map(x=>`https://${x}-competitor.com/`);
 const parsed=parseAuditInput({...input,competitors:urls});assert.equal(parsed.competitors.length,5);
 assert.throws(()=>parseAuditInput({...input,competitors:[...urls,'https://sixth.com']}));
 const fixture=fixtureFetcher();const report=await crawlWebsite(parsed,{fetcher:fixture.fetcher,delayMs:0,maxPages:1});
 assert.equal(report.competitors.length,5);assert.ok(report.competitors.every(c=>c.page&&c.page.score!==null));
});

test('PDF supplement exports imported data and assumptions without changing the signed crawl',async()=>{
 const {generatePDF}=await import('../../src/lib/seo/pdf');
 const {PDFDocument}=await import('pdf-lib');
 const fixture=fixtureFetcher();const report=await crawlWebsite(input,{fetcher:fixture.fetcher,delayMs:0,maxPages:1});
 const original=JSON.stringify(report);
 const bytes=await generatePDF(report,{}, {traffic:parseTrafficCSV('Date,Clicks,Impressions\n2026-09-01,10,100','gsc-csv','USD'),projection:{visits:1000,conversion:2,saleValue:50,cpc:3,fee:500,currency:'USD'}});
 assert.ok(bytes.length>10000);assert.ok((await PDFDocument.load(bytes)).getPageCount()>5);assert.equal(JSON.stringify(report),original);
});
