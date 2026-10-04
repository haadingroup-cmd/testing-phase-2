import type { Category, CategorySlug } from "@/lib/types";

export const CATEGORIES: Category[] = [
  {
    slug: "ai-assistants",
    name: "AI Assistants & Chatbots",
    short: "AI Assistants",
    icon: "Sparkles",
    keyword: "best ai assistant for business uk",
    intro:
      "General-purpose AI assistants such as ChatGPT, Claude, Gemini and Microsoft Copilot are the first AI tool most UK small businesses buy. They draft emails, summarise contracts, build spreadsheets and answer research questions. The right choice depends on the office suite you already use, how sensitive your data is and whether you need team controls.",
  },
  {
    slug: "writing",
    name: "AI Writing Tools",
    short: "Writing",
    icon: "PenLine",
    keyword: "ai writing tools uk",
    intro:
      "AI writing tools help you produce proposals, web copy, product descriptions and social posts faster — in proper British English. We favour tools that keep your brand voice consistent and make it easy to fact-check before anything is published.",
  },
  {
    slug: "productivity",
    name: "AI Productivity Tools",
    short: "Productivity",
    icon: "Zap",
    keyword: "ai productivity tools",
    intro:
      "AI productivity tools organise documents, wikis, tasks and calendars so a small team can do the work of a bigger one. Look for tools that plug into Microsoft 365 or Google Workspace rather than adding yet another silo.",
  },
  {
    slug: "finance-vat",
    name: "AI Accounting, VAT & MTD",
    short: "Finance & VAT",
    icon: "Receipt",
    keyword: "ai accounting software uk",
    intro:
      "AI bookkeeping tools read receipts, reconcile bank feeds and prepare VAT returns. For UK businesses the non-negotiable is HMRC-recognised Making Tax Digital (MTD) compatibility — for VAT now, and for Income Tax Self Assessment as MTD for ITSA rolls out from April 2026.",
  },
  {
    slug: "sales-crm",
    name: "AI Sales & CRM",
    short: "Sales & CRM",
    icon: "Handshake",
    keyword: "ai crm for small business",
    intro:
      "AI-powered CRMs score leads, draft follow-ups and summarise calls so no enquiry slips through the cracks. Free tiers are generous in this category — start there before committing to per-seat pricing.",
  },
  {
    slug: "marketing",
    name: "AI Marketing & SEO",
    short: "Marketing",
    icon: "Megaphone",
    keyword: "ai marketing tools for small business",
    intro:
      "AI marketing tools help with keyword research, content briefs, ad copy and social scheduling. Used well they cut hours from every campaign; used badly they produce generic content that Google and customers ignore. We highlight the tools that keep a human editor in control.",
  },
  {
    slug: "customer-support",
    name: "AI Customer Support",
    short: "Customer Support",
    icon: "Headset",
    keyword: "ai customer service software uk",
    intro:
      "AI support agents answer common questions 24/7 on your website, email and messaging channels, then hand complex cases to a human. Check how pricing scales — per-resolution billing can be excellent value or a nasty surprise.",
  },
  {
    slug: "automation",
    name: "AI Automation & Workflows",
    short: "Automation",
    icon: "Workflow",
    keyword: "ai workflow automation",
    intro:
      "Automation platforms connect the apps you already use — forms, CRM, accounting, email, Slack or Teams — and now add AI steps that classify, summarise and route information. This is where most small businesses find their biggest time savings.",
  },
  {
    slug: "meetings",
    name: "AI Meeting Assistants",
    short: "Meetings",
    icon: "Mic",
    keyword: "ai meeting notes tool",
    intro:
      "AI notetakers record, transcribe and summarise calls on Zoom, Teams and Google Meet. Under UK GDPR you should tell participants they are being recorded and know where the recordings are stored.",
  },
  {
    slug: "design-video",
    name: "AI Design, Video & Voice",
    short: "Design & Video",
    icon: "Clapperboard",
    keyword: "ai video tools for business",
    intro:
      "AI design and video tools let small teams produce social graphics, training videos and voiceovers without an agency. Check commercial-use licensing and whether generated likenesses or voices need consent.",
  },
  {
    slug: "presentations",
    name: "AI Presentation Makers",
    short: "Presentations",
    icon: "Presentation",
    keyword: "ai presentation maker",
    intro:
      "AI presentation makers turn an outline or document into a designed slide deck in minutes. Useful for pitches, proposals and training — as long as you can export to PowerPoint or PDF and keep your brand styling.",
  },
  {
    slug: "research",
    name: "AI Research Tools",
    short: "Research",
    icon: "SearchCheck",
    keyword: "ai research tools",
    intro:
      "AI research tools search the web and your documents and return answers with citations. They are ideal for competitor analysis, supplier checks and market sizing — provided you click through and verify the sources.",
  },
  {
    slug: "ecommerce-web",
    name: "AI Website & eCommerce",
    short: "Web & eCommerce",
    icon: "Store",
    keyword: "ai website builder uk",
    intro:
      "AI website builders and eCommerce platforms generate pages, product descriptions and store settings from a short brief. Great for getting online fast; make sure you can still edit everything and that UK VAT and shipping are handled properly.",
  },
  {
    slug: "ai-detection",
    name: "AI Content Detection",
    short: "AI Detection",
    icon: "ScanSearch",
    keyword: "ai detection tool",
    intro:
      "AI detection tools estimate whether text was written by a model. They can be useful as one signal when checking freelance or supplier content, but none are fully reliable — never use a detector score alone to accuse someone.",
  },
];

export const categoryBySlug = (slug: string) => CATEGORIES.find((c) => c.slug === slug);
export const categoryName = (slug: CategorySlug) => categoryBySlug(slug)?.short ?? slug;
