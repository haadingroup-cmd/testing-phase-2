import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };

export function ogImage({ kicker, title, footer }: { kicker: string; title: string; footer?: string }) {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "linear-gradient(135deg, #0F172A 0%, #131b2e 55%, #1E3A8A 100%)", padding: 64, color: "white", fontFamily: "serif" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 56, height: 56, borderRadius: 12, background: "#0F172A", border: "2px solid #38BDF8", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 22, height: 22, border: "3px solid #38BDF8", transform: "rotate(45deg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: 8, height: 8, borderRadius: 8, background: "white" }} />
            </div>
          </div>
          <div style={{ display: "flex", fontSize: 34, fontWeight: 700 }}>
            SmarterBiz<span style={{ color: "#60A5FA" }}>.uk</span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "flex", fontSize: 24, letterSpacing: 4, textTransform: "uppercase", color: "#89f5e7", fontFamily: "sans-serif" }}>{kicker}</div>
          <div style={{ display: "flex", fontSize: title.length > 70 ? 54 : 64, lineHeight: 1.1, fontWeight: 700, maxWidth: 1050 }}>{title}</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24, color: "#bec6e0", fontFamily: "sans-serif" }}>
          <span>{footer ?? "Independent AI tool reviews for UK small businesses"}</span>
          <span>£ GBP • UK GDPR • MTD</span>
        </div>
      </div>
    ),
    OG_SIZE,
  );
}
