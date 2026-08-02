/**
 * Homepage FAQ data + FAQPage structured data.
 * ---------------------------------------------
 * Kept in a plain (server-safe) module — NOT inside the "use client"
 * SiteSections component — so the JSON-LD object serializes correctly when
 * stringified in the server-rendered homepage. (Importing an object from a
 * client component into a server component was producing an empty {}.)
 */
export const FAQS = [
  { q: "How quickly can I see results?", a: "Paid ads (Meta/Google) show measurable results in 2–4 weeks. SEO builds significantly in 3–6 months. Web development is delivered in 4–8 weeks." },
  { q: "Do you work with international clients?", a: "Yes. We serve clients across Pakistan, UAE, Qatar, Saudi Arabia, the UK and the USA, working seamlessly across time zones." },
  { q: "What makes HaadinGlobal different?", a: "International-level expertise with ROI-focused execution. Every strategy is data-backed and every campaign is optimized for real business growth." },
  { q: "What is the minimum budget?", a: "Services start from $199/month. Book a free consultation for a tailored proposal that fits your specific budget and goals." },
  { q: "Do you offer flexible contracts?", a: "We recommend a 3-month minimum engagement for best results but offer month-to-month flexibility. Most clients stay long-term by choice." },
  { q: "How do I get started?", a: "Book a free 30-minute consultation. We analyze your digital presence and present a custom strategy — no pressure, no obligation." },
  { q: "What reports do you provide?", a: "All clients receive a dedicated analytics dashboard and regular reports (weekly or monthly) tracking the KPIs that matter to your business." },
];

export const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};
