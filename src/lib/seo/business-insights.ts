import { z } from "zod";
const amount = z.number().finite().min(0).max(1e12).nullable();
export const businessDataSchema = z.object({
  source: z.enum(["gsc-csv", "ga4-csv"]),
  currency: z.enum(["USD", "SAR", "AED", "PKR", "GBP", "EUR"]),
  points: z.array(z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    traffic: z.number().finite().min(0).max(1e12),
    impressions: amount,
    revenue: z.number().finite().min(-1e12).max(1e12).nullable(),
  }).strict()).min(1).max(366),
}).strict();
export type BusinessData = z.infer<typeof businessDataSchema>;
export const projectionSchema = z.object({
  visits: amount, conversion: z.number().finite().min(0).max(100).nullable(),
  saleValue: amount, cpc: amount, fee: amount,
  currency: z.enum(["USD", "SAR", "AED", "PKR", "GBP", "EUR"]),
}).strict();
export type Projection = z.infer<typeof projectionSchema>;
export const supplementSchema = z.object({
  traffic: businessDataSchema.nullable(), projection: projectionSchema.nullable(),
}).strict();
export type BusinessSupplement = z.infer<typeof supplementSchema>;

// A bounded CSV parser handles quoted commas, CRLF, BOM and Google's comment lines.
export function csvRows(text: string): string[][] {
  if (text.length > 1_000_000) throw new Error("Choose a CSV smaller than 1 MB.");
  const rows: string[][] = []; let row: string[] = [], cell = "", quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === '"') {
      if (quoted && text[i + 1] === '"') { cell += '"'; i++; }
      else if (quoted || !cell.trim()) quoted = !quoted;
      else throw new Error("Invalid quote in CSV. Export the file again.");
    } else if (c === ',' && !quoted) { row.push(cell.trim()); cell = ""; }
    else if ((c === '\n' || c === '\r') && !quoted) {
      row.push(cell.trim()); if (row.some(Boolean)) rows.push(row);
      row = []; cell = ""; if (c === '\r' && text[i + 1] === '\n') i++;
    } else cell += c;
  }
  if (quoted) throw new Error("CSV contains an unfinished quoted field.");
  row.push(cell.trim()); if (row.some(Boolean)) rows.push(row);
  return rows;
}
function csvNumber(raw: string | undefined): number | null {
  if (raw === undefined || raw.trim() === "") return null;
  const value = raw.replaceAll(',', '').trim();
  if (!/^-?\d+(?:\.\d+)?$/.test(value)) throw new Error("A metric is not numeric. Use an English Google CSV export without currency symbols.");
  const n = Number(value);
  if (!Number.isFinite(n) || Math.abs(n) > 1e12) throw new Error("A metric is outside the supported range.");
  return n;
}
export function parseTrafficCSV(text: string, source: BusinessData["source"], currency: BusinessData["currency"]): BusinessData {
  const rows = csvRows(text.replace(/^\uFEFF/, ''));
  const normalized = (r: string[]) => r.map(x => x.trim().toLowerCase().replace(/[ _]/g, ''));
  const trafficKey = source === "gsc-csv" ? "clicks" : "sessions";
  const index = rows.findIndex(r => { const h = normalized(r); return h.includes('date') && h.includes(trafficKey); });
  if (index < 0) throw new Error(`Expected Date and ${source === 'gsc-csv' ? 'Clicks' : 'Sessions'} columns. Export daily data in English, not a queries/pages or channel breakdown.`);
  const headers = normalized(rows[index]);
  const allowed = new Set(['date','clicks','impressions','ctr','position','sessions','totalusers','activeusers','newusers','totalrevenue','keyevents','engagedsessions','engagementrate','averagesessionduration','userengagementduration','averageduration']);
  if (headers.some(h => h && !allowed.has(h))) throw new Error("Use a daily totals export with Date as the only dimension. Extra dimensions could double-count traffic.");
  const seen = new Set<string>(); const points: BusinessData['points'] = [];
  for (const row of rows.slice(index + 1)) {
    if (row[0]?.startsWith('#')) continue;
    const raw = row[headers.indexOf('date')] || '';
    const date = /^\d{8}$/.test(raw) ? `${raw.slice(0,4)}-${raw.slice(4,6)}-${raw.slice(6,8)}` : raw;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(Date.parse(date)) || new Date(date).toISOString().slice(0,10) !== date) throw new Error("Every data row needs a valid daily date (YYYY-MM-DD or YYYYMMDD). Remove total rows before importing.");
    if (seen.has(date)) throw new Error("Duplicate dates found. Export daily totals with no extra dimensions to avoid double-counting.");
    seen.add(date);
    const traffic = csvNumber(row[headers.indexOf(trafficKey)]);
    if (traffic === null || traffic < 0) throw new Error("Each date needs a non-negative traffic value; blank is not zero.");
    const impressions = source === 'gsc-csv' ? csvNumber(row[headers.indexOf('impressions')]) : null;
    if (impressions !== null && (impressions < traffic || impressions < 0)) throw new Error("Impressions must be at least the number of clicks.");
    points.push({date,traffic,impressions,revenue:source === 'ga4-csv' ? csvNumber(row[headers.indexOf('totalrevenue')]) : null});
  }
  const result = businessDataSchema.safeParse({source,currency,points:points.sort((a,b)=>a.date.localeCompare(b.date))});
  if (!result.success) throw new Error("Import between 1 and 366 days of valid daily data.");
  return result.data;
}
export function trafficTotals(data: BusinessData) {
  const sum = (key: 'traffic'|'impressions'|'revenue') => data.points.reduce((n,p)=>n+(p[key]??0),0);
  const impressions = data.points.every(p=>p.impressions!==null) ? sum('impressions') : null;
  return {traffic:sum('traffic'),impressions,revenue:data.points.every(p=>p.revenue!==null)?sum('revenue'):null,ctr:impressions ? sum('traffic')/impressions*100:null};
}
export function projectValue(p: Projection) {
  const orders = p.visits !== null && p.conversion !== null ? p.visits*p.conversion/100 : null;
  const revenue = orders !== null && p.saleValue !== null ? orders*p.saleValue:null;
  return {orders,revenue,trafficValue:p.visits !== null && p.cpc !== null ? p.visits*p.cpc:null,
    revenueToFee:revenue !== null && p.fee !== null && p.fee>0 ? revenue/p.fee:null};
}
