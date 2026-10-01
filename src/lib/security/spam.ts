/** Minimum time a human needs to fill a form. */
const MIN_FILL_MS = 2500;
/** Forms older than this are treated as stale replays. */
const MAX_FILL_MS = 1000 * 60 * 60 * 12;

export type SpamVerdict = { spam: boolean; reason?: string };

export function checkSpam(input: { company_fax?: string; startedAt?: number; message?: string }): SpamVerdict {
  if (input.company_fax && input.company_fax.trim() !== "") return { spam: true, reason: "honeypot" };
  if (input.startedAt) {
    const elapsed = Date.now() - input.startedAt;
    if (elapsed < MIN_FILL_MS) return { spam: true, reason: "too-fast" };
    if (elapsed > MAX_FILL_MS) return { spam: true, reason: "stale" };
  }
  if (input.message) {
    const links = (input.message.match(/https?:\/\//gi) ?? []).length;
    if (links > 3) return { spam: true, reason: "links" };
  }
  return { spam: false };
}
