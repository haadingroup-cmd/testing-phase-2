import path from "node:path";
import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

// Content Security Policy. Inline scripts are needed for Next.js bootstrapping
// and JSON-LD; everything else is locked to this origin (fonts are self-hosted).
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self' data:",
  "img-src 'self' data: blob: https:",
  "connect-src 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
];

// This project may live inside a larger repository; pin the workspace root
// so Next.js never picks up files (or a middleware) from a parent folder.
const projectRoot = path.resolve(process.cwd());

const nextConfig: NextConfig = {
  turbopack: { root: projectRoot },
  outputFileTracingRoot: projectRoot,
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    // Only local images are optimised. Remote URLs entered in the admin are
    // rendered as plain <img> so the optimiser can't be used as an open proxy.
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      { source: "/admin/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }, { key: "Cache-Control", value: "no-store" }] },
    ];
  },
  // Keep URLs from the previous version of the site working.
  async redirects() {
    return [
      { source: "/portfolio", destination: "/results", permanent: true },
      { source: "/consultation", destination: "/contact", permanent: true },
      { source: "/thank-you", destination: "/contact", permanent: true },
      { source: "/team", destination: "/about", permanent: true },
      { source: "/careers", destination: "/contact", permanent: true },
      { source: "/agency/:slug*", destination: "/services", permanent: true },
      { source: "/dashboard", destination: "/admin", permanent: false },
      { source: "/login", destination: "/admin/login", permanent: false },
    ];
  },
};

export default nextConfig;
