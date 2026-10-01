/**
 * Legal page copy. Plain-language templates written for HaadinGlobal's
 * actual data handling (forms → PostgreSQL, optional Resend email, WhatsApp).
 * Have them reviewed by a lawyer for your jurisdiction before relying on them.
 */
export type LegalSection = { heading: string; body: string[] };
export type LegalDoc = { slug: string; title: string; description: string; updated: string; sections: LegalSection[] };

const UPDATED = "2026-10-01";

export const LEGAL_DOCS: Record<"privacy" | "terms" | "refund" | "security", LegalDoc> = {
  privacy: {
    slug: "privacy-policy",
    title: "Privacy Policy",
    description: "How HaadinGlobal collects, uses and protects personal information submitted through this website.",
    updated: UPDATED,
    sections: [
      { heading: "Who we are", body: ["HaadinGlobal is a digital marketing and technology agency based in Sahiwal, Punjab, Pakistan. This policy explains how we handle information you share with us through this website."] },
      {
        heading: "What we collect",
        body: [
          "Information you submit in our forms: name, email, phone/WhatsApp number, business name, website, the service and budget you're interested in, and your message.",
          "When you use the free website audit, the URL you submit and the resulting report. Contact details are optional for the audit.",
          "Basic technical data (such as IP address) is processed briefly to protect our forms from spam and abuse. IP addresses are stored only as one-way hashes for rate limiting.",
        ],
      },
      {
        heading: "How we use it",
        body: [
          "To reply to your enquiry, prepare proposals and deliver services you request.",
          "To prevent spam and abuse of our forms and tools.",
          "We do not sell your personal information and we do not use it for unrelated marketing without your consent.",
        ],
      },
      {
        heading: "Where it's stored",
        body: [
          "Submissions are stored in a secured PostgreSQL database hosted by our infrastructure provider. Notification emails may be sent through our email provider (Resend). Conversations you start on WhatsApp are subject to WhatsApp's own privacy policy.",
        ],
      },
      { heading: "How long we keep it", body: ["We keep enquiry records for as long as needed to respond and manage our client relationship, and delete them on request unless we must keep them for legal or accounting reasons."] },
      { heading: "Your rights", body: ["You can ask us to access, correct or delete your personal information at any time by emailing us. We'll respond within 30 days."] },
      { heading: "Contact", body: ["Questions about privacy? Email haadinglobal@gmail.com or message +92 305 4782677 on WhatsApp."] },
    ],
  },
  terms: {
    slug: "terms",
    title: "Terms of Service",
    description: "The terms that apply to using the HaadinGlobal website and engaging our services.",
    updated: UPDATED,
    sections: [
      { heading: "Using this website", body: ["You may use this website to learn about our services, request quotes and run the free website audit. Don't misuse the site — including attempting to disrupt it, scrape it at scale, or submit content you don't have the right to share."] },
      { heading: "Estimates and pricing", body: ["Prices on this site are starting prices in Pakistani Rupees (PKR). Package-builder figures are estimates; the final scope and price are confirmed in a written proposal before any work starts. Advertising spend is paid directly to the ad platforms and is not included in our fees."] },
      { heading: "Free website audit", body: ["The audit is an automated analysis of a single public web page, provided for information only. It does not guarantee rankings, traffic or sales. Only audit websites you own or are authorised to analyse."] },
      { heading: "Engagements", body: ["Client work is governed by the proposal or agreement we sign with you, which takes precedence over these terms. Monthly retainers run month-to-month unless a longer commitment is agreed in writing."] },
      { heading: "No guaranteed results", body: ["Marketing outcomes depend on many factors outside our control (platform algorithms, competition, budgets, product and market). We commit to professional work and transparent reporting, not to specific results, unless explicitly agreed in writing."] },
      { heading: "Intellectual property", body: ["Content on this website belongs to HaadinGlobal unless stated otherwise. Deliverables created for clients are transferred as described in each client agreement."] },
      { heading: "Liability", body: ["To the extent permitted by law, HaadinGlobal is not liable for indirect or consequential losses arising from use of this website or the free audit tool."] },
      { heading: "Changes", body: ["We may update these terms from time to time. The date at the top of this page shows the latest version."] },
    ],
  },
  refund: {
    slug: "refund-policy",
    title: "Refund Policy",
    description: "How refunds work for HaadinGlobal retainers and projects.",
    updated: UPDATED,
    sections: [
      { heading: "Monthly retainers", body: ["Retainers are billed in advance and renew monthly. You can cancel before the next billing date with written notice (email or WhatsApp). Work already started in the current month is not refundable, but you will not be billed for the following month."] },
      { heading: "Fixed-price projects", body: ["Projects (websites, Shopify stores, branding, automations) are usually billed in milestones. Payments for completed milestones are non-refundable. If we cancel a project, we refund payments for milestones not yet delivered."] },
      { heading: "Advertising spend", body: ["Ad spend is paid directly to Meta, Google, TikTok or other platforms from your own account, so it's governed by those platforms' policies and cannot be refunded by HaadinGlobal."] },
      { heading: "If something isn't right", body: ["Tell us. We'd rather fix the problem than lose the relationship — most concerns are resolved by adjusting scope, priorities or the team on your account."] },
      { heading: "Requesting a refund", body: ["Email haadinglobal@gmail.com with your invoice number and the reason. We respond within 5 business days and process approved refunds within 14 days to the original payment method."] },
    ],
  },
  security: {
    slug: "security",
    title: "Security",
    description: "How HaadinGlobal protects this website and the information you submit.",
    updated: UPDATED,
    sections: [
      { heading: "Transport security", body: ["The site is served exclusively over HTTPS with HSTS, plus a strict Content Security Policy and other modern security headers."] },
      { heading: "Form protection", body: ["All form data is validated on the server, length-limited and sanitised. Forms are protected with rate limiting, a hidden honeypot field and timing checks to block automated spam, and cross-site requests are rejected."] },
      { heading: "Admin access", body: ["The admin area requires an account with a strong password (stored only as a bcrypt hash) and uses signed, HTTP-only, secure session cookies. Sessions can be revoked instantly. Admin pages are excluded from search engines."] },
      { heading: "Website audit tool", body: ["The audit only fetches public websites. Requests to private or internal network addresses are blocked, redirects are re-validated, and requests are limited in time and size."] },
      { heading: "Reporting a vulnerability", body: ["If you believe you've found a security issue, please email haadinglobal@gmail.com with details. Please don't publicly disclose it until we've had a chance to fix it."] },
    ],
  },
};
