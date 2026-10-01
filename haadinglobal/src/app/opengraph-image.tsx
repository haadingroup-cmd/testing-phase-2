import { ImageResponse } from "next/og";

export const alt = "HaadinGlobal — Digital Marketing & Technology Agency";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, background: "linear-gradient(135deg, #091b36 0%, #0f2d5c 60%, #0851d5 100%)", color: "#fff", fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ width: 72, height: 72, borderRadius: 18, background: "#071A35", border: "2px solid #2F80FF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 44, fontWeight: 800, color: "#2F80FF" }}>H</div>
          <div style={{ display: "flex", fontSize: 40, fontWeight: 800 }}>
            Haadin<span style={{ color: "#2F80FF" }}>Global</span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 64, fontWeight: 800, lineHeight: 1.1 }}>Grow Your Business. Build Your Brand. Scale With Digital.</div>
          <div style={{ fontSize: 28, color: "#b4c5ff" }}>Meta & Google Ads · SEO · Web & Shopify · AI Automation</div>
        </div>
        <div style={{ display: "flex", fontSize: 24, color: "#F4C96B" }}>Pakistan · UAE · Saudi Arabia · Qatar · UK · USA</div>
      </div>
    ),
    size,
  );
}
