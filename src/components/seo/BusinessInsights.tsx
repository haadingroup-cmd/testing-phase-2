"use client";
import { useState } from "react";
import { BarChart3, Upload, Calculator, ArrowUpRight } from "lucide-react";
import { parseTrafficCSV, trafficTotals, projectValue, type BusinessData, type BusinessSupplement, type Projection } from "@/lib/seo/business-insights";
import type { AuditReport } from "@/lib/seo/types";
const number = (n: number | null) => n === null ? 'Not available' : n.toLocaleString('en-US', {maximumFractionDigits:2});
export function ExecutiveSummary({report}: {report: AuditReport}) {
  const issues = report.checks.filter(c=>c.status==='critical'||c.status==='warning');
  const groups = new Set(issues.map(c=>c.title));
  const easy = new Set(issues.filter(c=>c.difficulty==='Easy').map(c=>c.title));
  const affected = new Set(issues.map(c=>c.pageUrl));
  const passed = report.checks.filter(c=>c.status==='passed').length;
  const unavailable = report.checks.filter(c=>c.status==='unavailable').length;
  const total=report.checks.length || 1;
  return <section className="hg-executive hg-panel" aria-label="Report in plain English">
    <div><span className="hg-eyebrow">YOUR REPORT, SIMPLIFIED</span><h2>{groups.size ? `${groups.size} types of fixes. A clear place to start.`:'No issues found in the checked signals.'}</h2><p>{affected.size} sampled pages have findings. Start with critical issues, then work through the easy fixes. This summary describes the pages checked, not every page on the site.</p></div>
    <div className="hg-summary-stats"><div><strong>{report.pages.length}</strong><span>Pages checked</span></div><div><strong>{groups.size}</strong><span>Distinct issue types</span></div><div><strong>{easy.size}</strong><span>Easy fix types</span></div></div>
    <div className="hg-check-distribution" role="img" aria-label={`${passed} passed, ${issues.length} need attention, ${unavailable} unavailable`}><i style={{width:`${passed/total*100}%`}}/><i style={{width:`${issues.length/total*100}%`}}/><i style={{width:`${unavailable/total*100}%`}}/></div>
    <p className="hg-note">Check counts: {passed} passed · {issues.length} need attention · {unavailable} unavailable. Repeated page checks are counted separately.</p>
  </section>;
}
export default function BusinessInsights({host,value,onChange}: {host:string;value:BusinessSupplement;onChange:(value:BusinessSupplement)=>void}) {
  const [source,setSource]=useState<BusinessData['source']>('gsc-csv');
  const [currency,setCurrency]=useState<BusinessData['currency']>('USD');
  const [confirmed,setConfirmed]=useState(false);
  const [error,setError]=useState('');
  const [loading,setLoading]=useState(false);
  const data=value.traffic;
  const totals=data?trafficTotals(data):null;
  const projection:Projection=value.projection||{visits:null,conversion:null,saleValue:null,cpc:null,fee:null,currency:'USD'};
  const projected=projectValue(projection);
  async function importFile(file?:File) {
    setError(''); if (!file) return;
    if (file.size>1_000_000) {setError('Choose a CSV smaller than 1 MB.');return;}
    setLoading(true);
    try {const traffic=parseTrafficCSV(await file.text(),source,currency);onChange({...value,traffic});}
    catch(e){setError(e instanceof Error?e.message:'Could not read this file.');}
    finally{setLoading(false);}
  }
  const cash=(n:number|null)=>n===null?'Enter your inputs':`${projection.currency} ${number(n)}`;
  const points=data?.points||[];
  const max=Math.max(...points.map(p=>p.traffic),1);
  const path=points.map((p,i)=>`${i?'L':'M'} ${10+(i/Math.max(points.length-1,1))*780} ${145-p.traffic/max*120}`).join(' ');
  return <div className="hg-business">
    <section className="hg-panel">
      <div className="hg-section-heading"><BarChart3/><h2>Traffic & recorded revenue</h2></div>
      <p>Turn your own Google export into a readable report. A public crawl cannot reveal a website’s visits or earnings.</p>
      <div className="hg-business-grid">
        <div><span>{data?.source==='ga4-csv'?'Sessions':'Google Search clicks'}</span><strong>{totals?number(totals.traffic):'Not connected'}</strong><small>{data?'Total for imported dates':'Import daily data below'}</small></div>
        <div><span>Search impressions</span><strong>{totals?number(totals.impressions):'Not connected'}</strong><small>Search Console only</small></div>
        <div><span>Recorded revenue</span><strong>{totals?.revenue!==null&&totals?.revenue!==undefined?`${data?.currency} ${number(totals.revenue)}`:'Not available'}</strong><small>GA4 Total revenue column; not profit or bank payments</small></div>
        <div><span>Search click-through rate</span><strong>{totals?.ctr!==null&&totals?.ctr!==undefined?`${number(totals.ctr)}%`:'Not available'}</strong><small>Clicks ÷ impressions for imported dates</small></div>
      </div>
      {data && <div className="hg-traffic-chart"><div className="hg-section-title"><div><h3>{data.source==='gsc-csv'?'Daily Google Search clicks':'Daily sessions'}</h3><p>{points[0].date} – {points[points.length-1].date} · {points.length} reported days</p></div><button className="hg-button hg-button-outline" onClick={()=>onChange({...value,traffic:null})}>Clear data</button></div>
        <svg viewBox="0 0 800 170" role="img" aria-label={`Daily traffic from ${points[0].date} to ${points[points.length-1].date}. Total ${totals?.traffic}. Full values in the table below.`}><line x1="10" y1="145" x2="790" y2="145" stroke="var(--hg-line)"/><path d={path} fill="none" stroke="var(--brand)" strokeWidth="3"/>{points.map((p,i)=><circle key={p.date} cx={10+i/Math.max(points.length-1,1)*780} cy={145-p.traffic/max*120} r={points.length>90?1.5:3} fill="var(--brand)"><title>{p.date}: {p.traffic}</title></circle>)}</svg>
        <p className="hg-note">Equal spacing per reported day; missing dates are not treated as zero. Source: user-supplied {data.source==='gsc-csv'?'Search Console':'GA4'} CSV, not independently verified.</p>
        <details><summary>View daily values</summary><div className="hg-table-wrap"><table><thead><tr><th>Date</th><th>{data.source==='gsc-csv'?'Clicks':'Sessions'}</th><th>Impressions</th><th>Revenue ({data.currency})</th></tr></thead><tbody>{points.map(p=><tr key={p.date}><td>{p.date}</td><td>{number(p.traffic)}</td><td>{number(p.impressions)}</td><td>{number(p.revenue)}</td></tr>)}</tbody></table></div></details>
      </div>}
      <details className="hg-import" open={!data}><summary><Upload size={17}/> Import your traffic CSV — free, no API key</summary>
        <div className="hg-form-grid"><label>Data source<select value={source} onChange={e=>setSource(e.target.value as BusinessData['source'])}><option value="gsc-csv">Google Search Console</option><option value="ga4-csv">Google Analytics 4</option></select></label><label>Revenue currency from your GA4 export<select value={currency} onChange={e=>setCurrency(e.target.value as BusinessData['currency'])}>{['USD','SAR','AED','PKR','GBP','EUR'].map(c=><option key={c}>{c}</option>)}</select></label></div>
        <ol className="hg-import-steps"><li>Search Console: open Performance → Search results → Export → CSV. Unzip it and select the daily <strong>Dates.csv</strong> file.</li><li>GA4: export a daily report with <strong>Date, Sessions</strong> and optionally <strong>Total revenue</strong>. Use Date as the only dimension and English column names.</li><li>Choose the correct site and dates. Up to 366 rows; duplicate dates and non-daily exports are rejected.</li></ol>
        <label className="hg-consent"><input type="checkbox" checked={confirmed} onChange={e=>setConfirmed(e.target.checked)}/> This export belongs to {host}, and I am authorized to use it.</label>
        <label className="hg-file-label">Choose CSV<input type="file" accept=".csv,text/csv" disabled={!confirmed||loading} onChange={e=>{void importFile(e.target.files?.[0]);e.target.value='';}}/></label>
        <p className="hg-note">Processed in this tab. Nothing is saved to an account. Importing does not send the file to our server; a PDF export includes its daily totals in the export request. Leaving or refreshing clears the data.</p>
        {loading&&<p role="status">Reading data…</p>}{error&&<p className="hg-error" role="alert">{error}</p>}
      </details>
      <p className="hg-note hg-spaced">For automatic private Google data, use the <a href="/dashboard/seo">team dashboard <ArrowUpRight size={12}/></a> after an administrator connects and authorizes your property.</p>
    </section>
    <section className="hg-panel hg-spaced">
      <div className="hg-section-heading"><Calculator/><h2>What could this traffic be worth?</h2></div>
      <p>Planning calculator based only on the assumptions you enter. Estimated sales revenue, advertising value and your proposed service fee are different amounts.</p>
      <div className="hg-form-grid">
        <label>Currency<select value={projection.currency} onChange={e=>onChange({...value,projection:{...projection,currency:e.target.value as Projection['currency']}})}>{['USD','SAR','AED','PKR','GBP','EUR'].map(c=><option key={c}>{c}</option>)}</select></label>
        {([['visits','Monthly organic visits / clicks'],['conversion','Visit-to-sale conversion (%)'],['saleValue','Average revenue per sale'],['cpc','Assumed cost per ad click'],['fee','Your proposed monthly SEO fee']] as const).map(([key,label])=><label key={key}>{label}<input type="number" min="0" max={key==='conversion'?100:1e12} step="any" placeholder="Enter your assumption" value={projection[key]??''} onChange={e=>{const raw=e.target.value;const n=Number(raw);if(raw===''||(Number.isFinite(n)&&n>=0&&n<=(key==='conversion'?100:1e12)))onChange({...value,projection:{...projection,[key]:raw===''?null:n}});}}/></label>)}
      </div>
      <div className="hg-business-grid"><div><span>Estimated sales / month</span><strong>{projected.orders===null?'Enter your inputs':number(projected.orders)}</strong><small>Visits × conversion rate</small></div><div><span>Estimated gross revenue</span><strong>{cash(projected.revenue)}</strong><small>Estimated sales × revenue per sale</small></div><div><span>Equivalent advertising value</span><strong>{cash(projected.trafficValue)}</strong><small>Visits/clicks × assumed CPC; not cash earned</small></div><div><span>Proposed monthly SEO fee</span><strong>{cash(projection.fee)}</strong><small>Your entered quote; not a recommended price or payment request</small></div></div>
      <p className="hg-note">No growth is assumed. This is not actual income, profit, ROI or a guarantee. Costs, refunds, taxes and attribution are not included. The conversion rate must match the traffic measure you enter. Calculator and imported traffic appear as separately labeled supplements in PDF and JSON exports; the findings CSV contains audit checks only.</p>
    </section>
  </div>;
}
export function CompetitorMatrix({report}:{report:AuditReport}) {
  const rows=[{url:report.pages[0].url,page:report.pages[0]},...report.competitors];
  return <div className="hg-table-wrap hg-spaced"><table><caption className="hg-matrix-caption">Starting-page comparison · selected competitors, not search rankings</caption><thead><tr><th>Website</th><th>Check score</th><th>Title / description</th><th>H1 headings</th><th>Schema types</th><th>Missing image alt</th></tr></thead><tbody>{rows.map((c,i)=><tr key={c.url+i}><td><a href={c.url} target="_blank" rel="noopener noreferrer">{new URL(c.url).hostname}</a><br/><small>{i===0?'Your starting page':'Selected competitor'}</small></td><td>{c.page?.score??'Not available'}</td><td>{c.page?`${c.page.title?'Present':'Missing'} / ${c.page.description?'Present':'Missing'}`:'Not available'}</td><td>{c.page?.h1.length??'—'}</td><td>{c.page?.schema.types.join(', ')||'Not detected / unavailable'}</td><td>{c.page?`${c.page.images.missingAlt} / ${c.page.images.total}`:'—'}</td></tr>)}</tbody></table></div>;
}
