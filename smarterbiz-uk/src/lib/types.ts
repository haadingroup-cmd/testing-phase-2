export type CategorySlug =
  | "ai-assistants"
  | "writing"
  | "productivity"
  | "finance-vat"
  | "sales-crm"
  | "marketing"
  | "customer-support"
  | "automation"
  | "meetings"
  | "design-video"
  | "presentations"
  | "research"
  | "ecommerce-web"
  | "ai-detection";

export interface Category {
  slug: CategorySlug;
  name: string;
  short: string;
  icon: string;
  intro: string;
  keyword: string;
}

export interface Tool {
  slug: string;
  name: string;
  vendor: string;
  tagline: string;
  summary: string;
  review: string[];
  categories: CategorySlug[];
  score: number; // out of 10
  scores: { value: number; easeOfUse: number; ukFit: number; features: number };
  pricing: { from: string; freePlan: boolean; trial?: string; note?: string };
  bestFor: string;
  ukNotes: string;
  pros: string[];
  cons: string[];
  features: string[];
  website: string;
  affiliateUrl?: string;
  editorsChoice?: boolean;
  ukBuilt?: boolean;
  mtdCompatible?: boolean;
  badges?: string[];
  alternatives: string[];
  color: string;
}

export type Block =
  | { type: "p"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "table"; caption?: string; head: string[]; rows: string[][] }
  | { type: "callout"; tone?: "info" | "warn" | "tip"; title: string; text: string }
  | { type: "tools"; slugs: string[] }
  | { type: "quote"; text: string; cite?: string };

export interface Section {
  id: string;
  heading: string;
  blocks: Block[];
}

export interface Faq {
  q: string;
  a: string;
}

export interface Guide {
  slug: string;
  title: string;
  metaTitle: string;
  description: string;
  kicker: string;
  keywords: string[];
  published: string;
  updated: string;
  quickAnswer: string;
  takeaways: string[];
  sections: Section[];
  faqs: Faq[];
  relatedTools: string[];
  featured?: boolean;
  cover: { icon: string; tone: "navy" | "blue" | "teal" | "slate" };
}

export interface Comparison {
  slug: string;
  a: string;
  b: string;
  title: string;
  metaTitle: string;
  description: string;
  keywords: string[];
  published: string;
  updated: string;
  verdict: string;
  winner: "a" | "b" | "tie";
  criteria: { name: string; a: string; b: string; winner: "a" | "b" | "tie" }[];
  pickA: string[];
  pickB: string[];
  sections: Section[];
  faqs: Faq[];
}
