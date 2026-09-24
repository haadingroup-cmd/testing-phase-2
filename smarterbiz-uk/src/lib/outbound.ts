import type { Tool } from "./types";

/** Outbound vendor links: affiliate links are marked rel="sponsored", others "nofollow". */
export const outboundUrl = (t: Tool) => t.affiliateUrl ?? t.website;
export const outboundRel = (t: Tool) => (t.affiliateUrl ? "sponsored noopener noreferrer" : "nofollow noopener noreferrer");
