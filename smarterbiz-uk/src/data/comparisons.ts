import type { Comparison } from "@/lib/types";

export const COMPARISONS: Comparison[] = [
  {
    slug: "chatgpt-vs-claude",
    a: "chatgpt",
    b: "claude",
    title: "ChatGPT vs Claude: Which Is Better for UK Small Businesses?",
    metaTitle: "ChatGPT vs Claude (2026): Which Is Better for UK Business?",
    description:
      "ChatGPT vs Claude for UK business: we compare writing quality, British English, document analysis, integrations, data protection and pricing in £ to help you choose.",
    keywords: ["chatgpt vs claude", "claude vs chatgpt", "claude vs chatgpt for business", "is claude better than chatgpt"],
    published: "2026-01-20",
    updated: "2026-09-24",
    verdict:
      "Claude edges it for UK small businesses that care most about writing quality, contracts and long documents. ChatGPT wins on versatility — images, voice, custom GPTs and the biggest ecosystem. Many businesses happily use both.",
    winner: "b",
    criteria: [
      { name: "Writing quality & British English", a: "Very good; US spelling by default", b: "Excellent; natural British tone", winner: "b" },
      { name: "Long documents & contracts", a: "Strong", b: "Best in class", winner: "b" },
      { name: "Image generation", a: "Built in", b: "Not built in", winner: "a" },
      { name: "Integrations & custom assistants", a: "Custom GPTs, largest ecosystem", b: "Projects & connectors", winner: "a" },
      { name: "Data analysis", a: "Excellent", b: "Excellent", winner: "tie" },
      { name: "Business data training defaults", a: "Off on Business/Enterprise", b: "Off on Team/Enterprise/API", winner: "tie" },
      { name: "Entry price", a: "~£20/month (Plus)", b: "~£18/month (Pro)", winner: "tie" },
    ],
    pickA: [
      "You want one tool for writing, images, voice and data analysis",
      "Your team already knows ChatGPT",
      "You plan to build custom GPTs for repeatable tasks",
    ],
    pickB: [
      "Client-facing writing and tone matter most",
      "You review contracts, policies or long reports",
      "You want Projects that hold company knowledge for every chat",
    ],
    sections: [
      {
        id: "analysis",
        heading: "The editorial analysis",
        blocks: [
          {
            type: "p",
            text: "We ran both assistants through the same set of real UK small-business tasks: drafting a quote, rewriting terms and conditions in plain English, summarising a 60-page tender, building a cash-flow spreadsheet and replying to an unhappy customer. Both are excellent — the differences are in tone, features and ecosystem.",
          },
          {
            type: "p",
            text: "**Claude** consistently produced writing that needed fewer edits before sending, with correct British spelling and a measured tone. It was also more faithful when summarising long documents. **ChatGPT** was faster to produce visuals, handled voice conversations and offered far more integrations through custom GPTs and connectors.",
          },
        ],
      },
      {
        id: "data",
        heading: "Data protection",
        blocks: [
          {
            type: "p",
            text: "On business plans, neither provider trains on your content by default. On individual plans, check the data controls in settings. See our [UK GDPR and AI checklist](/guides/uk-gdpr-ai-compliance-checklist).",
          },
        ],
      },
    ],
    faqs: [
      {
        q: "Is Claude better than ChatGPT for business?",
        a: "Claude is better for writing quality, British English and long-document analysis. ChatGPT is better for versatility, image generation and integrations. The best choice depends on your main tasks.",
      },
      {
        q: "Which is cheaper, ChatGPT or Claude?",
        a: "Both have free plans and individual paid plans around £18–£20 a month, with per-seat team plans. Prices change often, so check each vendor's site.",
      },
    ],
  },
  {
    slug: "microsoft-copilot-vs-gemini",
    a: "microsoft-365-copilot",
    b: "gemini",
    title: "Microsoft 365 Copilot vs Gemini for Workspace: Which Should Your Business Use?",
    metaTitle: "Microsoft Copilot vs Gemini (2026) for UK Small Businesses",
    description:
      "Microsoft 365 Copilot vs Google Gemini for small businesses: integrations, pricing, data protection and which AI fits your office suite.",
    keywords: ["copilot vs gemini", "microsoft copilot vs google gemini", "gemini vs copilot for business"],
    published: "2026-03-02",
    updated: "2026-09-24",
    verdict:
      "Choose the one that matches your office suite. Copilot is best for Microsoft 365 businesses; Gemini is best for Google Workspace businesses — and is often already included in your plan, making it better value.",
    winner: "tie",
    criteria: [
      { name: "Office integration", a: "Outlook, Word, Excel, PowerPoint, Teams", b: "Gmail, Docs, Sheets, Slides, Meet", winner: "tie" },
      { name: "Value", a: "Full Copilot is a paid add-on", b: "Included in many Workspace plans", winner: "b" },
      { name: "Meeting summaries", a: "Excellent in Teams", b: "Good in Meet", winner: "a" },
      { name: "Research", a: "Good", b: "Excellent (Deep Research, NotebookLM)", winner: "b" },
      { name: "Compliance & data residency", a: "Strong, UK datacentre options", b: "Strong, data regions on some editions", winner: "a" },
    ],
    pickA: ["You run on Microsoft 365 and Teams", "You need strong compliance controls", "Meetings dominate your week"],
    pickB: ["You run on Google Workspace", "You want AI included in your existing plan", "You do lots of research"],
    sections: [
      {
        id: "analysis",
        heading: "The editorial analysis",
        blocks: [
          {
            type: "p",
            text: "The biggest factor is where your files, email and meetings already live. Switching office suites to get a different AI is rarely worth the disruption. Both assistants exclude your business data from model training under their business terms.",
          },
        ],
      },
    ],
    faqs: [
      {
        q: "Is Copilot or Gemini better?",
        a: "Copilot is better for Microsoft 365 users and Gemini is better for Google Workspace users. Each works best inside its own ecosystem.",
      },
    ],
  },
  {
    slug: "chatgpt-vs-gemini",
    a: "chatgpt",
    b: "gemini",
    title: "ChatGPT vs Gemini: Which AI Assistant Is Best for Business?",
    metaTitle: "ChatGPT vs Gemini (2026): Best AI Assistant for Business?",
    description:
      "ChatGPT vs Gemini compared for small businesses: writing, research, Google Workspace integration, image generation and pricing in £.",
    keywords: ["chatgpt vs gemini", "gemini vs chatgpt", "gemini or chatgpt for business"],
    published: "2026-04-14",
    updated: "2026-09-24",
    verdict:
      "ChatGPT is the better standalone assistant with more features. Gemini is the better choice if you work in Google Workspace, where it may already be included in your plan.",
    winner: "a",
    criteria: [
      { name: "Standalone features", a: "Broadest feature set", b: "Strong", winner: "a" },
      { name: "Google Workspace integration", a: "Via connectors", b: "Native", winner: "b" },
      { name: "Research", a: "Deep research", b: "Deep Research + NotebookLM", winner: "b" },
      { name: "Custom assistants", a: "Custom GPTs", b: "Gems", winner: "a" },
      { name: "Value", a: "Separate subscription", b: "Often included in Workspace", winner: "b" },
    ],
    pickA: ["You want the most capable standalone assistant", "You don't use Google Workspace", "You want custom GPTs"],
    pickB: ["You use Gmail, Docs and Sheets daily", "You want AI included in your existing plan", "You do document-heavy research"],
    sections: [
      {
        id: "analysis",
        heading: "The editorial analysis",
        blocks: [
          {
            type: "p",
            text: "Both are excellent general assistants. ChatGPT's custom GPTs and ecosystem make it more flexible; Gemini's native integration into Workspace makes it more convenient for Google-based businesses.",
          },
        ],
      },
    ],
    faqs: [
      {
        q: "Is Gemini as good as ChatGPT?",
        a: "Gemini is comparable for most business tasks and excels at research and Google Workspace integration. ChatGPT offers a broader feature set and ecosystem.",
      },
    ],
  },
  {
    slug: "xero-vs-quickbooks",
    a: "xero",
    b: "quickbooks",
    title: "Xero vs QuickBooks UK: Which AI Accounting Software Is Best?",
    metaTitle: "Xero vs QuickBooks UK (2026): MTD, AI Features & Pricing",
    description:
      "Xero vs QuickBooks for UK small businesses: Making Tax Digital support, AI features, bank feeds, accountant support and real pricing in £.",
    keywords: ["xero vs quickbooks uk", "quickbooks vs xero", "best accounting software uk small business"],
    published: "2026-02-25",
    updated: "2026-09-24",
    verdict:
      "Xero is our pick for most UK small businesses thanks to its accountant ecosystem and UK bank feeds. QuickBooks is excellent for sole traders who want strong mobile bookkeeping, and both are HMRC-recognised for MTD.",
    winner: "a",
    criteria: [
      { name: "MTD for VAT & Income Tax", a: "Yes", b: "Yes", winner: "tie" },
      { name: "UK accountant support", a: "Very widely supported", b: "Widely supported", winner: "a" },
      { name: "Mobile app", a: "Good", b: "Excellent", winner: "b" },
      { name: "AI features", a: "JAX assistant, reconciliation suggestions", b: "Intuit Assist, categorisation", winner: "tie" },
      { name: "Integrations", a: "Very large marketplace", b: "Large marketplace", winner: "a" },
      { name: "Pricing", a: "From ~£16/month", b: "From ~£16/month; frequent intro offers", winner: "tie" },
    ],
    pickA: ["You work with an accountant or bookkeeper", "You need lots of integrations", "You're VAT-registered and growing"],
    pickB: ["You're a sole trader managing books on your phone", "You want MTD for Income Tax made simple", "You like intro discounts"],
    sections: [
      {
        id: "analysis",
        heading: "The editorial analysis",
        blocks: [
          {
            type: "p",
            text: "Both platforms handle invoicing, bank reconciliation, VAT and reporting well, and both use AI to reduce manual categorisation. The deciding factor is usually your accountant's preference. Also consider [FreeAgent](/tools/freeagent) if you bank with NatWest, RBS, Ulster Bank or Mettle.",
          },
        ],
      },
    ],
    faqs: [
      {
        q: "Is Xero or QuickBooks better in the UK?",
        a: "Xero is slightly better for most UK small businesses because of its accountant ecosystem and integrations. QuickBooks is better for sole traders who prefer mobile bookkeeping. Both are MTD-recognised.",
      },
    ],
  },
  {
    slug: "zapier-vs-make",
    a: "zapier",
    b: "make",
    title: "Zapier vs Make: Which Automation Tool Is Best for AI Workflows?",
    metaTitle: "Zapier vs Make (2026): Best for AI Workflows & Pricing",
    description:
      "Zapier vs Make for small business AI automation: ease of use, AI features, pricing at volume, EU hosting and which to choose.",
    keywords: ["zapier vs make", "make vs zapier", "best automation tool for small business"],
    published: "2026-05-19",
    updated: "2026-09-24",
    verdict:
      "Zapier is best for beginners and the widest range of apps. Make is best for complex or high-volume workflows on a budget, and offers EU hosting.",
    winner: "tie",
    criteria: [
      { name: "Ease of use", a: "Easiest", b: "Moderate", winner: "a" },
      { name: "App library", a: "Largest", b: "Large", winner: "a" },
      { name: "Complex logic", a: "Good", b: "Excellent", winner: "b" },
      { name: "Price at volume", a: "Higher", b: "Lower", winner: "b" },
      { name: "EU hosting", a: "No (US)", b: "Yes", winner: "b" },
      { name: "AI agents", a: "Yes", b: "Yes", winner: "tie" },
    ],
    pickA: ["You're new to automation", "You need an obscure app integration", "Speed of setup matters most"],
    pickB: ["You run high volumes", "You need branching and data transformation", "You prefer EU data hosting"],
    sections: [
      {
        id: "analysis",
        heading: "The editorial analysis",
        blocks: [
          {
            type: "p",
            text: "For a first automation, Zapier gets you running in minutes. As workflows grow more complex and volumes rise, Make's visual builder and pricing become more attractive. Technical teams wanting to self-host should also consider [n8n](/tools/n8n).",
          },
        ],
      },
    ],
    faqs: [
      {
        q: "Is Make cheaper than Zapier?",
        a: "Usually, yes — especially at higher volumes. Make charges by operations/credits and its entry plans cost less than Zapier's.",
      },
    ],
  },
  {
    slug: "fathom-vs-fireflies",
    a: "fathom",
    b: "fireflies",
    title: "Fathom vs Fireflies: Best AI Meeting Notetaker?",
    metaTitle: "Fathom vs Fireflies (2026): Best AI Meeting Notes Tool",
    description:
      "Fathom vs Fireflies.ai compared: free plans, summary quality, CRM sync, search and UK GDPR considerations for AI meeting notes.",
    keywords: ["fathom vs fireflies", "best ai meeting notes", "ai notetaker"],
    published: "2026-06-03",
    updated: "2026-09-24",
    verdict:
      "Fathom wins for individuals and small teams thanks to its generous free plan and fast summaries. Fireflies is better for sales teams who want searchable history and conversation analytics.",
    winner: "a",
    criteria: [
      { name: "Free plan", a: "Very generous", b: "Limited storage", winner: "a" },
      { name: "Summary quality", a: "Excellent, concise", b: "Good, detailed", winner: "a" },
      { name: "Search across meetings", a: "Good", b: "Excellent", winner: "b" },
      { name: "Analytics", a: "Basic", b: "Conversation analytics", winner: "b" },
      { name: "CRM sync", a: "Yes", b: "Yes", winner: "tie" },
    ],
    pickA: ["You want great free meeting notes", "You value concise summaries"],
    pickB: ["You run a sales team", "You want to search across every call"],
    sections: [
      {
        id: "analysis",
        heading: "The editorial analysis",
        blocks: [
          {
            type: "p",
            text: "Both tools join your calls, transcribe and summarise. Remember to tell participants you are recording and check where recordings are stored.",
          },
        ],
      },
    ],
    faqs: [
      {
        q: "Is Fathom really free?",
        a: "Fathom offers a genuinely useful free plan for recording, transcribing and summarising calls. Paid plans add team features and advanced AI.",
      },
    ],
  },
];

export const comparisonBySlug = (slug: string) => COMPARISONS.find((c) => c.slug === slug);
