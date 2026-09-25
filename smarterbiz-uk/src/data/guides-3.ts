import type { Guide } from "@/lib/types";

export const GUIDES_3: Guide[] = [
  {
    slug: "best-free-ai-tools-for-small-business-uk",
    title: "The Best Free AI Tools for UK Small Businesses (2026)",
    metaTitle: "Best Free AI Tools for Small Business UK (2026): 15 Tested",
    description:
      "15 genuinely free AI tools for UK small businesses — assistants, CRM, design, meeting notes, automation and accounting — with the limits of each free plan explained.",
    kicker: "Buyer's Guide",
    keywords: ["free ai tools for small business", "best free ai tools", "free ai tools uk", "free ai for business"],
    published: "2026-09-25",
    updated: "2026-09-25",
    cover: { icon: "Sparkles", tone: "teal" },
    quickAnswer:
      "The best free AI tools for UK small businesses are ChatGPT, Claude and Gemini (assistants), HubSpot's free CRM, Canva (design), Fathom (meeting notes), Zapier and Make (automation) and Tidio (website chat). FreeAgent accounting is free with eligible NatWest, RBS, Ulster Bank and Mettle business accounts. Free plans have usage caps, so upgrade only the one tool you use most.",
    takeaways: [
      "You can run most of a small business's AI needs for £0 while you test what works.",
      "Free plans cap usage, features or seats — not quality.",
      "Free consumer plans may use your data for training; switch that off before using client information.",
      "Upgrade the single tool you hit the limits of first; keep everything else free.",
    ],
    sections: [
      {
        id: "list",
        heading: "The 15 best free AI tools at a glance",
        blocks: [
          {
            type: "table",
            caption: "Free plans and their main limits",
            head: ["Tool", "Use it for", "What the free plan limits"],
            rows: [
              ["[ChatGPT](/tools/chatgpt)", "Writing, analysis, images", "Message caps on the best model; fewer features"],
              ["[Claude](/tools/claude)", "Writing, long documents", "Daily message limits"],
              ["[Gemini](/tools/gemini)", "Research, Google apps", "Advanced models and Workspace features are paid"],
              ["[Microsoft Copilot](/tools/microsoft-365-copilot)", "Chat and drafting", "In-app Microsoft 365 features are paid"],
              ["[Le Chat (Mistral)](/tools/mistral-le-chat)", "European-hosted assistant", "Usage caps"],
              ["[Perplexity](/tools/perplexity)", "Research with citations", "Limited deep-research runs"],
              ["[HubSpot](/tools/hubspot)", "CRM, contacts, deals", "HubSpot branding; limited automation"],
              ["[Canva](/tools/canva)", "Design, social posts", "Premium templates and AI credits capped"],
              ["[Fathom](/tools/fathom)", "Meeting notes", "Some advanced AI summaries paid"],
              ["[Zapier](/tools/zapier)", "Automation", "Limited monthly tasks; two-step Zaps"],
              ["[Make](/tools/make)", "Automation", "Limited monthly operations"],
              ["[Tidio](/tools/tidio)", "Website live chat", "Limited AI conversations"],
              ["[Grammarly](/tools/grammarly)", "Proofreading", "Rewrites and tone features paid"],
              ["[FreeAgent](/tools/freeagent)", "Accounting & MTD", "Free only with eligible bank accounts"],
              ["[n8n](/tools/n8n)", "Self-hosted automation", "Free to self-host; you run the server"],
            ],
          },
        ],
      },
      {
        id: "starter-stack",
        heading: "A £0 AI starter stack for a small business",
        blocks: [
          {
            type: "ol",
            items: [
              "**Assistant:** Claude or ChatGPT free for drafting emails, quotes and summaries.",
              "**CRM:** HubSpot free to track every enquiry and deal.",
              "**Marketing:** Canva free for social posts and flyers.",
              "**Meetings:** Fathom free to record and summarise client calls.",
              "**Automation:** one Zapier or Make workflow — for example, website form → HubSpot contact → Slack or Teams alert.",
            ],
          },
          { type: "tools", slugs: ["claude", "hubspot", "canva", "fathom"] },
        ],
      },
      {
        id: "catch",
        heading: "What's the catch with free AI tools?",
        blocks: [
          {
            type: "p",
            text: "Usually it's usage limits and missing team features. The bigger issue for UK businesses is data: free consumer plans often allow the provider to use your conversations to improve their models unless you switch it off. Check the privacy or data-controls settings, and don't paste customer personal data into a free tool until you've read its terms. Our [UK GDPR and AI checklist](/guides/uk-gdpr-ai-compliance-checklist) covers what to check.",
          },
          {
            type: "callout",
            tone: "tip",
            title: "When to start paying",
            text: "Upgrade when a limit costs you time every week — typically your main AI assistant (about £18–£20 a month). One paid tool used daily beats five paid tools used occasionally.",
          },
        ],
      },
    ],
    faqs: [
      {
        q: "What is the best free AI tool for a small business?",
        a: "A free AI assistant — Claude, ChatGPT or Gemini — delivers the most value, because it helps with writing, research and analysis every day. Pair it with HubSpot's free CRM and Canva's free plan.",
      },
      {
        q: "Is ChatGPT free for business use?",
        a: "Yes, ChatGPT's free plan can be used for business tasks, but it has usage limits and fewer features. For client data, OpenAI's Business and Enterprise plans offer stronger data protections.",
      },
      {
        q: "Is there free accounting software with AI in the UK?",
        a: "FreeAgent is free with eligible NatWest, RBS, Ulster Bank and Mettle business accounts and is recognised by HMRC for Making Tax Digital. HMRC's software finder on GOV.UK also lists some free options for simple needs.",
      },
    ],
    relatedTools: ["chatgpt", "claude", "hubspot", "canva", "fathom", "zapier", "freeagent"],
  },
  {
    slug: "best-accounting-software-for-sole-traders-uk",
    title: "Best Accounting Software for Sole Traders UK (MTD for Income Tax, 2026)",
    metaTitle: "Best Accounting Software for Sole Traders UK (MTD 2026)",
    description:
      "The best MTD-ready accounting software for UK sole traders and landlords in 2026 — FreeAgent, QuickBooks and Xero compared on price, quarterly updates, AI features and ease of use.",
    kicker: "Finance & Tax",
    keywords: ["best accounting software for sole traders uk", "mtd software for sole traders", "mtd for income tax software", "sole trader bookkeeping app uk"],
    published: "2026-09-25",
    updated: "2026-09-25",
    cover: { icon: "Receipt", tone: "navy" },
    quickAnswer:
      "FreeAgent is the best accounting software for most UK sole traders: it is built in the UK, recognised by HMRC for MTD for Income Tax, and free with eligible NatWest, RBS, Ulster Bank and Mettle accounts. QuickBooks is best if you want to manage everything from your phone, and Xero suits sole traders who work closely with an accountant.",
    takeaways: [
      "From 6 April 2026, sole traders and landlords with qualifying income over £50,000 must use MTD for Income Tax.",
      "The threshold falls to £30,000 in April 2027 and £20,000 in April 2028.",
      "You'll send quarterly updates plus a final declaration — software does most of the work.",
      "Check the free-with-your-bank option before paying for anything.",
    ],
    sections: [
      {
        id: "who",
        heading: "Do you need MTD software?",
        blocks: [
          {
            type: "p",
            text: "If your combined gross income from self-employment and property is above the threshold, yes. Qualifying income is calculated before expenses, so a sole trader turning over £55,000 with £30,000 of costs is still in scope from April 2026. Check your position with [HMRC's eligibility tool on GOV.UK](https://www.gov.uk/guidance/check-if-youre-eligible-for-making-tax-digital-for-income-tax). Our [MTD timeline guide](/guides/making-tax-digital-ai-accounting-software) has the full detail.",
          },
        ],
      },
      {
        id: "comparison",
        heading: "The best MTD software for sole traders compared",
        blocks: [
          {
            type: "table",
            head: ["", "FreeAgent", "QuickBooks", "Xero"],
            rows: [
              ["Best for", "Freelancers & sole traders", "Phone-first bookkeeping", "Working with an accountant"],
              ["MTD for Income Tax", "Yes", "Yes", "Yes"],
              ["Price (approx.)", "Free with eligible bank accounts; otherwise ~£19/month", "From ~£16/month (intro offers common)", "From ~£16/month"],
              ["Receipt capture", "Yes", "Excellent mobile capture", "Yes (plus Dext integration)"],
              ["AI features", "Automated categorisation", "Intuit Assist, auto-categorisation", "JAX assistant, reconciliation suggestions"],
              ["Tax estimates", "Clear tax timeline", "Yes", "Yes"],
            ],
          },
          { type: "tools", slugs: ["freeagent", "quickbooks", "xero", "dext"] },
        ],
      },
      {
        id: "how-ai-helps",
        heading: "How AI takes the pain out of quarterly updates",
        blocks: [
          {
            type: "ul",
            items: [
              "**Bank feeds** pull transactions in daily, and AI suggests the right category.",
              "**Receipt capture** reads the supplier, amount and VAT from a photo.",
              "**Rules** learn from your corrections so the same supplier is categorised automatically next time.",
              "**Tax estimates** update as you go, so the January bill is never a surprise.",
            ],
          },
          {
            type: "callout",
            tone: "tip",
            title: "The 15-minute weekly habit",
            text: "Spend 15 minutes each Friday confirming categorised transactions and snapping receipts. Your quarterly update then takes a couple of clicks.",
          },
        ],
      },
      {
        id: "choose",
        heading: "Which should you choose?",
        blocks: [
          {
            type: "ul",
            items: [
              "**Bank with NatWest, RBS, Ulster Bank or Mettle?** Start with [FreeAgent](/tools/freeagent) — it may cost nothing.",
              "**Run your business from your phone?** [QuickBooks](/tools/quickbooks) has the best mobile experience.",
              "**Have an accountant who uses Xero?** Use [Xero](/tools/xero) so you're working in the same system.",
            ],
          },
        ],
      },
    ],
    faqs: [
      {
        q: "What is the best free accounting software for sole traders in the UK?",
        a: "FreeAgent is free with eligible NatWest, RBS, Ulster Bank and Mettle business accounts, and is recognised by HMRC for MTD. HMRC's software finder also lists some free products for people with simple affairs.",
      },
      {
        q: "Do sole traders need to use Making Tax Digital?",
        a: "Sole traders and landlords with qualifying income over £50,000 must use MTD for Income Tax from 6 April 2026, over £30,000 from April 2027 and over £20,000 from April 2028.",
      },
      {
        q: "Can I use a spreadsheet for MTD for Income Tax?",
        a: "Yes, if you use HMRC-recognised bridging software to send updates digitally. For most sole traders, accounting software with bank feeds and receipt capture is simpler.",
      },
    ],
    relatedTools: ["freeagent", "quickbooks", "xero", "dext"],
  },
  {
    slug: "is-chatgpt-gdpr-compliant",
    title: "Is ChatGPT GDPR Compliant? A Guide for UK Businesses",
    metaTitle: "Is ChatGPT GDPR Compliant? UK Business Guide (2026)",
    description:
      "Can UK businesses use ChatGPT under UK GDPR? We explain training settings, business plans, data processing agreements, what not to paste in, and how to use ChatGPT safely at work.",
    kicker: "Data Protection",
    keywords: ["is chatgpt gdpr compliant", "chatgpt gdpr uk", "chatgpt data privacy business", "can i use chatgpt at work uk"],
    published: "2026-09-25",
    updated: "2026-09-25",
    cover: { icon: "ShieldCheck", tone: "slate" },
    quickAnswer:
      "ChatGPT can be used in a UK GDPR-compliant way, but compliance depends on how you use it. Use ChatGPT Business or Enterprise, where OpenAI does not train on your data by default and offers a data processing agreement; switch off model training on individual plans; avoid entering special category data; update your privacy notice; and keep a human reviewing outputs about people.",
    takeaways: [
      "No tool is 'GDPR compliant' on its own — your usage decides.",
      "Business and Enterprise plans are designed for company data; free and Plus plans are consumer products.",
      "Turn off 'improve the model for everyone' on individual accounts used for work.",
      "Regulators take this seriously: Italy's data protection authority fined OpenAI €15 million in December 2024.",
    ],
    sections: [
      {
        id: "short-answer",
        heading: "The short answer",
        blocks: [
          {
            type: "p",
            text: "UK GDPR applies to you — the business deciding to put personal data into a tool — not just to the tool's maker. Using ChatGPT with no personal data (drafting a blog post, brainstorming product names) carries little data-protection risk. Using it to summarise customer complaints, screen CVs or analyse staff performance is processing personal data and needs the usual safeguards.",
          },
        ],
      },
      {
        id: "plans",
        heading: "Which ChatGPT plan should a business use?",
        blocks: [
          {
            type: "table",
            head: ["Plan", "Training on your data", "Admin controls", "Suitable for client data?"],
            rows: [
              ["Free / Plus", "On by default — can be switched off", "No", "Only with training off and minimal personal data"],
              ["Business (formerly Team)", "Off by default", "Yes", "Yes, with a DPA and policy"],
              ["Enterprise", "Off by default", "Advanced (SSO, retention, data residency options)", "Yes — best for regulated firms"],
            ],
          },
          { type: "tools", slugs: ["chatgpt", "claude", "microsoft-365-copilot"] },
        ],
      },
      {
        id: "checklist",
        heading: "How to use ChatGPT safely at work",
        blocks: [
          {
            type: "ol",
            items: [
              "Use a **Business or Enterprise** workspace for company use, or switch off training in data controls.",
              "Accept OpenAI's **data processing addendum** and keep a copy.",
              "Set a rule: **no special category data** (health, ethnicity, religion, biometrics), no passwords, no payment details.",
              "**Pseudonymise** where you can — 'Customer A' works as well as a real name for most drafting.",
              "Keep a **human in the loop** for anything that affects a person (hiring, credit, complaints).",
              "**Mention AI tools** in your privacy notice and record them in your data map.",
            ],
          },
          {
            type: "p",
            text: "The same principles apply to Claude, Gemini and Copilot. See our [UK GDPR and AI checklist](/guides/uk-gdpr-ai-compliance-checklist) for a policy template, and the [ICO's AI guidance](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/artificial-intelligence/) for the official position.",
          },
        ],
      },
    ],
    faqs: [
      {
        q: "Is ChatGPT GDPR compliant?",
        a: "ChatGPT can be used in a GDPR-compliant way if you choose an appropriate plan (ideally Business or Enterprise), accept the data processing addendum, avoid unnecessary personal data and keep people informed. Compliance depends on how you use it.",
      },
      {
        q: "Does ChatGPT store my data?",
        a: "Yes, conversations are stored to provide the service. On consumer plans they may be used to improve models unless you switch that off; on Business and Enterprise plans OpenAI says it does not train on your data by default.",
      },
      {
        q: "Can I put customer data into ChatGPT?",
        a: "Only with safeguards: a business plan or training switched off, a data processing agreement, a lawful basis, an updated privacy notice and no special category data. Pseudonymise wherever possible.",
      },
    ],
    relatedTools: ["chatgpt", "claude", "microsoft-365-copilot", "gemini"],
  },
  {
    slug: "best-ai-crm-for-small-business",
    title: "Best AI CRM for Small Businesses in the UK (2026)",
    metaTitle: "Best AI CRM for Small Business UK (2026): HubSpot vs Pipedrive",
    description:
      "The best AI-powered CRMs for UK small businesses — HubSpot, Pipedrive and others compared on free plans, AI features, automation, GDPR tools and price per seat in £.",
    kicker: "Buyer's Guide",
    keywords: ["best ai crm", "ai crm for small business", "best crm for small business uk", "crm with ai"],
    published: "2026-09-25",
    updated: "2026-09-25",
    cover: { icon: "Handshake", tone: "blue" },
    quickAnswer:
      "HubSpot is the best AI CRM for most UK small businesses thanks to its free CRM, Breeze AI features and built-in marketing and service tools. Pipedrive is the best choice for small sales teams who want the simplest pipeline and an AI sales assistant. Zoho CRM and Salesforce's small-business editions are worth a look if you already use their ecosystems.",
    takeaways: [
      "Start on a free CRM — HubSpot's free plan has no user limit.",
      "AI in a CRM is most useful for follow-up drafts, call summaries and deal-risk alerts.",
      "Connect your meeting notetaker (Fathom, Fireflies) so call notes land on the deal automatically.",
      "Use built-in consent and subscription tools to stay on the right side of UK GDPR and PECR.",
    ],
    sections: [
      {
        id: "picks",
        heading: "Our picks",
        blocks: [
          {
            type: "table",
            head: ["CRM", "Best for", "AI highlights", "Price (approx.)"],
            rows: [
              ["[HubSpot](/tools/hubspot)", "All-in-one marketing, sales & service", "Breeze assistant & agents, email drafting, record summaries", "Free; Starter ~£15–£20/seat/month"],
              ["[Pipedrive](/tools/pipedrive)", "Small B2B sales teams", "AI sales assistant, deal insights, email writer", "From ~£12–£15/seat/month"],
              ["Zoho CRM", "Businesses on Zoho apps", "Zia assistant, predictions", "Free for small teams; paid per seat"],
              ["Salesforce Starter", "Businesses planning to scale", "Einstein AI features", "Per seat, higher cost"],
            ],
          },
          { type: "tools", slugs: ["hubspot", "pipedrive", "fathom", "zapier"] },
        ],
      },
      {
        id: "features",
        heading: "AI CRM features that actually save time",
        blocks: [
          {
            type: "ul",
            items: [
              "**Follow-up drafting** — a personalised email written from the deal history in seconds.",
              "**Call and meeting summaries** logged to the contact automatically.",
              "**Deal-risk alerts** that flag stalled opportunities before they go cold.",
              "**Data enrichment** that fills in company details from a website or email address.",
              "**Lead scoring** that prioritises the enquiries most likely to buy.",
            ],
          },
        ],
      },
      {
        id: "gdpr",
        heading: "CRM and UK GDPR",
        blocks: [
          {
            type: "p",
            text: "A CRM is a store of personal data, so record your lawful basis for each type of contact, capture marketing consent properly (PECR applies to email marketing to individuals and sole traders), and set retention rules for old leads. HubSpot and Pipedrive both include consent and subscription-management tools.",
          },
        ],
      },
    ],
    faqs: [
      {
        q: "What is the best free CRM for a small business?",
        a: "HubSpot's free CRM is the best free option for most small businesses. It includes contacts, deals, email tracking and meetings with no user limit.",
      },
      {
        q: "Is HubSpot or Pipedrive better?",
        a: "HubSpot is better if you want marketing, sales and service in one platform with a free start. Pipedrive is better for small sales teams who want a simple, visual pipeline. Read our HubSpot vs Pipedrive comparison.",
      },
    ],
    relatedTools: ["hubspot", "pipedrive", "fathom", "fireflies", "zapier"],
  },
  {
    slug: "ai-tools-for-tradespeople-uk",
    title: "AI Tools for Tradespeople: Quotes, Invoices and Admin in Minutes",
    metaTitle: "AI Tools for Tradespeople UK (2026): Save Hours on Admin",
    description:
      "Practical AI tools for UK plumbers, electricians, builders and other tradespeople — faster quotes, invoicing, MTD, reviews and customer messages, mostly from your phone.",
    kicker: "Industry Guide",
    keywords: ["ai tools for tradespeople", "ai for plumbers", "ai for builders uk", "quoting app for tradesmen uk"],
    published: "2026-09-25",
    updated: "2026-09-25",
    cover: { icon: "Zap", tone: "teal" },
    quickAnswer:
      "The most useful AI tools for UK tradespeople are an AI assistant (ChatGPT or Claude) for writing quotes and customer messages, phone-based accounting such as QuickBooks or FreeAgent for MTD-ready invoicing and receipts, and a job-management app for scheduling. Together they can save several hours of evening admin every week.",
    takeaways: [
      "Use voice mode to dictate a job and get a professional written quote back.",
      "Snap receipts on site — AI reads the VAT for your accounts.",
      "Reply to every review quickly with an AI draft, then personalise it.",
      "MTD for Income Tax affects many sole-trader tradespeople from April 2026.",
    ],
    sections: [
      {
        id: "quotes",
        heading: "Faster quotes and customer messages",
        blocks: [
          {
            type: "p",
            text: "Open ChatGPT or Claude on your phone, use voice mode, and describe the job as you would to a mate: \"Bathroom refit in Leeds, remove old suite, supply and fit new toilet, basin and shower, tile two walls, about four days, materials around £1,800.\" Ask for a clear, friendly quote with a scope of work, exclusions, price plus VAT and payment terms. Check the numbers and send.",
          },
          {
            type: "table",
            head: ["Job", "Prompt to try"],
            rows: [
              ["Quote", "\"Turn these notes into a professional quote for a homeowner, in British English, with scope, exclusions, price + VAT and a 14-day validity.\""],
              ["Delay message", "\"Write a polite text telling a customer we're running 2 days late because of a parts delay, and offer two new dates.\""],
              ["Review reply", "\"Write a short, warm reply to this 5-star review and mention we'd love to help again.\""],
              ["Awkward payment chase", "\"Write a firm but friendly reminder that invoice 1043 for £640 is 14 days overdue.\""],
            ],
          },
          { type: "tools", slugs: ["chatgpt", "claude"] },
        ],
      },
      {
        id: "money",
        heading: "Invoicing, receipts and Making Tax Digital",
        blocks: [
          {
            type: "p",
            text: "Phone-first accounting apps let you raise an invoice before you leave the driveway and photograph receipts at the merchant counter. AI reads the supplier, amount and VAT, and matches it to your bank feed. If your turnover is over the threshold, you'll need HMRC-recognised software for [MTD for Income Tax](/guides/best-accounting-software-for-sole-traders-uk) anyway.",
          },
          { type: "tools", slugs: ["quickbooks", "freeagent", "xero"] },
        ],
      },
      {
        id: "jobs",
        heading: "Scheduling and job management",
        blocks: [
          {
            type: "p",
            text: "Dedicated trade job-management apps (Tradify, Fergus and ServiceM8 are popular in the UK) handle quotes, scheduling, job sheets and invoicing in one place, and most connect to Xero or QuickBooks. If you'd rather keep it simple, a Zapier automation can turn a website enquiry into a calendar hold and a WhatsApp or email reply.",
          },
        ],
      },
      {
        id: "marketing",
        heading: "Getting more work",
        blocks: [
          {
            type: "ul",
            items: [
              "Use **Canva** to turn before-and-after photos into social posts in minutes.",
              "Ask an AI assistant to write **Google Business Profile** updates from your recent jobs.",
              "Reply to **every review** — AI drafts make it a 30-second job.",
            ],
          },
          { type: "tools", slugs: ["canva", "zapier"] },
        ],
      },
    ],
    faqs: [
      {
        q: "How can tradespeople use AI?",
        a: "Tradespeople use AI to write quotes and customer messages from voice notes, capture receipts for their accounts, chase invoices, reply to reviews and create social media posts — cutting evening admin significantly.",
      },
      {
        q: "Do I need MTD software as a self-employed tradesperson?",
        a: "If your qualifying income (gross self-employment plus property income) is over £50,000, you must use MTD for Income Tax from 6 April 2026; the threshold falls to £30,000 in 2027 and £20,000 in 2028.",
      },
    ],
    relatedTools: ["chatgpt", "claude", "quickbooks", "freeagent", "canva", "zapier"],
  },
  {
    slug: "ai-tools-for-estate-agents-uk",
    title: "AI Tools for UK Estate Agents: Listings, Leads and Compliance",
    metaTitle: "AI Tools for Estate Agents UK (2026): Listings, Leads & Compliance",
    description:
      "How UK estate and letting agents can use AI for property descriptions, lead follow-up, viewing notes and marketing — without breaching material information or consumer protection rules.",
    kicker: "Industry Guide",
    keywords: ["ai tools for estate agents", "ai for estate agents uk", "ai property descriptions", "ai for letting agents"],
    published: "2026-09-25",
    updated: "2026-09-25",
    cover: { icon: "Store", tone: "navy" },
    quickAnswer:
      "UK estate agents get the most from AI by drafting property descriptions and social posts (ChatGPT, Claude, Canva), following up every portal lead instantly (HubSpot plus Zapier), and summarising valuations and viewings (Fathom). Every AI-written listing must be checked for accuracy: material information rules and consumer protection law mean misleading descriptions or edited photos can land an agency in trouble.",
    takeaways: [
      "AI is ideal for first drafts of listings — never for unchecked facts.",
      "Material information (tenure, council tax, costs, utilities, risks) must be accurate and complete.",
      "Don't use AI image edits that misrepresent a property.",
      "Speed-to-lead wins instructions: automate the first response to every enquiry.",
    ],
    sections: [
      {
        id: "listings",
        heading: "Property descriptions in minutes",
        blocks: [
          {
            type: "p",
            text: "Give an AI assistant your measurements, room list, features and local amenities, and ask for a description in your house style. It will produce a strong first draft in seconds. Then check every fact against your notes: square footage, tenure, EPC, council tax band and anything a buyer would rely on.",
          },
          {
            type: "callout",
            tone: "warn",
            title: "Compliance comes first",
            text: "Listings must include accurate material information, and consumer protection law prohibits misleading actions and omissions. AI can confidently invent details — 'south-facing garden', 'recently renovated' — so a qualified person must review every listing. Virtual staging should be clearly labelled.",
          },
          { type: "tools", slugs: ["claude", "chatgpt", "canva"] },
        ],
      },
      {
        id: "leads",
        heading: "Never miss a lead",
        blocks: [
          {
            type: "p",
            text: "Portal and website enquiries go cold fast. An automation can create a CRM record, send an instant personalised reply with viewing slots and alert the right negotiator. See [10 AI workflows](/guides/ai-workflows-for-small-business) for the pattern.",
          },
          { type: "tools", slugs: ["hubspot", "zapier", "tidio"] },
        ],
      },
      {
        id: "admin",
        heading: "Valuations, viewings and vendor updates",
        blocks: [
          {
            type: "ul",
            items: [
              "Record valuation appointments (with consent) and get an AI summary of the vendor's motivations and timescales.",
              "Turn viewing feedback into a weekly vendor update email.",
              "Draft chain-progression updates from your notes.",
              "Create short property videos from photos with Canva, Descript or Synthesia.",
            ],
          },
          { type: "tools", slugs: ["fathom", "descript", "synthesia"] },
        ],
      },
    ],
    faqs: [
      {
        q: "Can estate agents use ChatGPT to write property descriptions?",
        a: "Yes, as a first draft. A qualified member of staff must check every detail for accuracy and completeness, because agents are responsible for material information and must not mislead consumers.",
      },
      {
        q: "What is the best AI tool for estate agents?",
        a: "A general AI assistant such as Claude or ChatGPT for listings and emails, combined with a CRM and automation (HubSpot and Zapier) for lead follow-up, delivers the biggest gains for most agencies.",
      },
    ],
    relatedTools: ["claude", "chatgpt", "hubspot", "zapier", "fathom", "canva"],
  },
  {
    slug: "ai-tools-for-accountants-uk",
    title: "AI Tools for UK Accountants and Bookkeepers (2026)",
    metaTitle: "AI Tools for Accountants & Bookkeepers UK (2026)",
    description:
      "The AI tools UK accountancy and bookkeeping practices use for data capture, reconciliation, client communication, MTD for Income Tax onboarding and research — plus confidentiality rules.",
    kicker: "Industry Guide",
    keywords: ["ai tools for accountants", "ai for accountants uk", "ai bookkeeping", "ai for accounting firms"],
    published: "2026-09-25",
    updated: "2026-09-25",
    cover: { icon: "Receipt", tone: "slate" },
    quickAnswer:
      "UK accountants and bookkeepers get the biggest wins from AI data capture (Dext), AI-assisted reconciliation in Xero or QuickBooks, an AI assistant such as Claude or Microsoft 365 Copilot for client emails and summarising guidance, and meeting notetakers for client calls. With MTD for Income Tax bringing thousands of sole traders into quarterly reporting, automation is now essential to scale.",
    takeaways: [
      "Automate data capture and reconciliation first — it's where most hours go.",
      "Use enterprise AI plans for client data, and update engagement letters to mention AI.",
      "AI can summarise HMRC guidance, but always verify against the source.",
      "MTD for Income Tax onboarding is a major opportunity for practices that automate.",
    ],
    sections: [
      {
        id: "capture",
        heading: "Data capture and reconciliation",
        blocks: [
          {
            type: "p",
            text: "Tools like Dext extract supplier, date, net, VAT and gross from receipts and invoices and publish them to the ledger. Xero and QuickBooks suggest bank-reconciliation matches and learn from corrections. Together they turn a monthly bookkeeping slog into an exception review.",
          },
          { type: "tools", slugs: ["dext", "xero", "quickbooks", "freeagent"] },
        ],
      },
      {
        id: "comms",
        heading: "Client communication and research",
        blocks: [
          {
            type: "ul",
            items: [
              "Draft plain-English explanations of tax positions for clients.",
              "Summarise long HMRC manuals or consultation documents — then check the source.",
              "Chase missing records with polite, personalised reminders.",
              "Turn call recordings into file notes and action lists.",
            ],
          },
          { type: "tools", slugs: ["claude", "microsoft-365-copilot", "fathom"] },
        ],
      },
      {
        id: "confidentiality",
        heading: "Confidentiality and professional standards",
        blocks: [
          {
            type: "p",
            text: "Client data is confidential and often includes sensitive financial information. Use business or enterprise AI plans that don't train on your data, sign data processing agreements, update engagement letters and privacy notices to mention AI, and keep professional judgement with a qualified person. Your professional body (ICAEW, ACCA, AAT or ICB) publishes guidance on AI and technology — follow it.",
          },
        ],
      },
      {
        id: "mtd",
        heading: "Scaling MTD for Income Tax",
        blocks: [
          {
            type: "p",
            text: "Quarterly updates multiply the number of submissions per client. Practices that automate bank feeds, receipt capture and client reminders can take on MTD clients profitably. See our [sole trader MTD software guide](/guides/best-accounting-software-for-sole-traders-uk).",
          },
        ],
      },
    ],
    faqs: [
      {
        q: "Will AI replace accountants?",
        a: "AI is automating data entry, reconciliation and first drafts, but advice, judgement, ethics and client relationships remain human work. Practices using AI well are handling more clients with the same team.",
      },
      {
        q: "Can accountants put client data into AI tools?",
        a: "Only with appropriate safeguards: enterprise plans that don't train on data, data processing agreements, updated engagement letters and privacy notices, and professional-body guidance followed.",
      },
    ],
    relatedTools: ["dext", "xero", "quickbooks", "claude", "microsoft-365-copilot", "fathom"],
  },
];
