import type { Guide } from "@/lib/types";

export const GUIDES_2: Guide[] = [
  {
    slug: "ai-workflows-for-small-business",
    title: "10 AI Workflows That Save UK Small Businesses Hours Every Week",
    metaTitle: "10 AI Workflows for Small Business (Step-by-Step, 2026)",
    description:
      "Ten practical AI workflows for small businesses — lead follow-up, invoice chasing, receipt capture, support triage and more — with the tools to build them in Zapier, Make or n8n.",
    kicker: "How-To",
    keywords: ["ai workflows", "ai workflow automation", "ai automation for small business", "zapier ai workflows", "business process automation ai"],
    published: "2026-03-24",
    updated: "2026-09-24",
    cover: { icon: "Workflow", tone: "blue" },
    quickAnswer:
      "An AI workflow is an automation where an AI step classifies, extracts, summarises or drafts something between two apps. The most valuable AI workflows for small businesses are instant lead follow-up, enquiry triage, receipt capture into your accounts, invoice chasing, meeting-to-CRM notes and support ticket drafting. You can build them without code in Zapier or Make.",
    takeaways: [
      "Start with the workflow that touches revenue: responding to leads fast.",
      "Keep a human approval step for anything customer-facing until you trust the output.",
      "Zapier is easiest; Make is cheaper at volume; n8n can be self-hosted in the UK.",
      "Document which personal data each workflow processes.",
    ],
    sections: [
      {
        id: "what-is",
        heading: "What is an AI workflow?",
        blocks: [
          {
            type: "p",
            text: "Traditional automation moves data from A to B: a form submission becomes a CRM contact. An **AI workflow** adds judgement in the middle — reading an enquiry to decide whether it's a hot lead, a support issue or spam; pulling the VAT figure out of a PDF invoice; or drafting a reply in your tone of voice.",
          },
        ],
      },
      {
        id: "workflows",
        heading: "10 AI workflows worth building",
        blocks: [
          { type: "h3", text: "1. Instant lead response" },
          { type: "p", text: "Website form → AI classifies the enquiry and drafts a personalised reply → CRM contact created → reply sent (or queued for approval) → Teams/Slack alert. Responding within minutes rather than hours can make a real difference to conversion." },
          { type: "h3", text: "2. Enquiry triage inbox" },
          { type: "p", text: "Shared inbox → AI labels each email (sales, support, supplier, spam) and extracts key details → routed to the right person with a summary." },
          { type: "h3", text: "3. Receipt and bill capture" },
          { type: "p", text: "Email or photo → Dext or your ledger's capture tool extracts supplier, date, net, VAT and gross → published to Xero or QuickBooks. Ready for Making Tax Digital." },
          { type: "h3", text: "4. Polite invoice chasing" },
          { type: "p", text: "Invoice overdue in your accounts → AI drafts a friendly reminder tailored to the customer's history → escalating tone at 7, 14 and 30 days." },
          { type: "h3", text: "5. Meeting notes to CRM" },
          { type: "p", text: "Fathom or Fireflies summarises a sales call → action items and next steps posted to the HubSpot deal → follow-up email drafted." },
          { type: "h3", text: "6. Support reply drafts" },
          { type: "p", text: "New ticket → AI searches your help content and drafts an answer → agent reviews and sends. Move to fully automated answers only for well-understood questions." },
          { type: "h3", text: "7. Review monitoring" },
          { type: "p", text: "New Google or Trustpilot review → AI assesses sentiment and drafts a response → negative reviews escalated to the owner immediately." },
          { type: "h3", text: "8. Content repurposing" },
          { type: "p", text: "New blog post published → AI creates LinkedIn, Instagram and newsletter versions → queued in your scheduler for approval." },
          { type: "h3", text: "9. New starter onboarding" },
          { type: "p", text: "HR form completed → accounts created, welcome pack generated with role-specific information, first-week calendar populated." },
          { type: "h3", text: "10. Weekly business digest" },
          { type: "p", text: "Every Monday → pull sales, cash and pipeline figures → AI writes a plain-English summary with anything unusual flagged → emailed to directors." },
        ],
      },
      {
        id: "tools",
        heading: "Which automation platform should you use?",
        blocks: [
          {
            type: "table",
            head: ["Platform", "Best for", "Pricing model", "UK/EU hosting"],
            rows: [
              ["[Zapier](/tools/zapier)", "Beginners, widest app library", "Per task", "US by default"],
              ["[Make](/tools/make)", "Complex or high-volume flows", "Per operation/credit", "EU zones available"],
              ["[n8n](/tools/n8n)", "Technical teams, self-hosting", "Free self-hosted / cloud plans", "Self-host anywhere"],
            ],
          },
          { type: "tools", slugs: ["zapier", "make", "n8n"] },
        ],
      },
      {
        id: "safely",
        heading: "Building AI workflows safely",
        blocks: [
          {
            type: "ul",
            items: [
              "Add a **human approval step** for anything sent to customers until error rates are proven low.",
              "**Log every run** so you can see what the AI decided and why.",
              "Record which **personal data** flows through each workflow in your data map.",
              "Set **spending limits** on AI steps to avoid runaway costs.",
            ],
          },
        ],
      },
    ],
    faqs: [
      {
        q: "What is an AI workflow?",
        a: "An AI workflow is an automated process that uses artificial intelligence to make a decision or produce content partway through — for example, classifying an email, extracting invoice details or drafting a reply — before passing the result to another app.",
      },
      {
        q: "How do I automate my small business with AI?",
        a: "List your most repetitive tasks, pick the one that costs the most time or revenue, and build a single automation in a no-code tool such as Zapier or Make with an AI step. Keep a human approval step at first, then expand once it's reliable.",
      },
      {
        q: "Is Zapier or Make better for AI workflows?",
        a: "Zapier is easier to learn and has more app connections. Make is more flexible for complex logic and usually cheaper at higher volumes, and offers EU hosting. Read our Zapier vs Make comparison for details.",
      },
    ],
    relatedTools: ["zapier", "make", "n8n", "hubspot", "fathom", "dext"],
  },
  {
    slug: "making-tax-digital-ai-accounting-software",
    title: "Making Tax Digital 2026: The Best AI Accounting Software for UK Businesses",
    metaTitle: "Making Tax Digital 2026: Best MTD Accounting Software (AI Picks)",
    description:
      "MTD for Income Tax started in April 2026. Here's the timeline, who's affected and the best HMRC-recognised AI accounting software for sole traders, landlords and small businesses.",
    kicker: "Finance & Tax",
    keywords: ["making tax digital software", "mtd for income tax", "mtd software", "ai accounting software uk", "best accounting software for sole traders uk"],
    published: "2026-01-28",
    updated: "2026-09-24",
    cover: { icon: "Receipt", tone: "teal" },
    quickAnswer:
      "Making Tax Digital for Income Tax Self Assessment became mandatory on 6 April 2026 for sole traders and landlords with qualifying income over £50,000, falling to £30,000 from April 2027 and £20,000 from April 2028. You need HMRC-recognised software to keep digital records and send quarterly updates. Our top picks are Xero, FreeAgent and QuickBooks, all of which use AI to automate bookkeeping.",
    takeaways: [
      "MTD for VAT applies to all VAT-registered businesses already.",
      "MTD for Income Tax started 6 April 2026 for qualifying income above £50,000.",
      "Thresholds drop to £30,000 (April 2027) and £20,000 (April 2028).",
      "FreeAgent is free with eligible NatWest, RBS, Ulster Bank and Mettle accounts.",
    ],
    sections: [
      {
        id: "timeline",
        heading: "The Making Tax Digital timeline",
        blocks: [
          {
            type: "table",
            caption: "MTD for Income Tax Self Assessment — qualifying income thresholds",
            head: ["From", "Who must use MTD for Income Tax"],
            rows: [
              ["6 April 2026", "Sole traders and landlords with qualifying income over £50,000"],
              ["6 April 2027", "Qualifying income over £30,000"],
              ["6 April 2028", "Qualifying income over £20,000"],
            ],
          },
          {
            type: "p",
            text: "Qualifying income is your total gross income from self-employment and property before expenses. Always confirm your position using [HMRC's official MTD guidance on GOV.UK](https://www.gov.uk/guidance/check-if-youre-eligible-for-making-tax-digital-for-income-tax), as rules and exemptions can change.",
          },
        ],
      },
      {
        id: "what-changes",
        heading: "What changes under MTD for Income Tax?",
        blocks: [
          {
            type: "ul",
            items: [
              "Keep **digital records** of income and expenses in HMRC-recognised software.",
              "Send **quarterly updates** of income and expenses to HMRC.",
              "Submit a **final declaration** by 31 January after the tax year ends.",
            ],
          },
        ],
      },
      {
        id: "how-ai-helps",
        heading: "How AI makes MTD easier",
        blocks: [
          {
            type: "p",
            text: "Quarterly reporting sounds like more admin, but modern accounting software uses AI to do most of the work: bank transactions are categorised automatically, receipts are read from photos, and anomalies are flagged before you submit. If your records are kept up to date weekly, quarterly updates become a few clicks.",
          },
        ],
      },
      {
        id: "best-software",
        heading: "Best MTD accounting software with AI",
        blocks: [
          {
            type: "table",
            head: ["Software", "Best for", "MTD VAT", "MTD Income Tax", "Price (approx.)"],
            rows: [
              ["[FreeAgent](/tools/freeagent)", "Freelancers & sole traders", "Yes", "Yes", "Free with eligible bank accounts"],
              ["[Xero](/tools/xero)", "Small businesses with an accountant", "Yes", "Yes", "From ~£16/month"],
              ["[QuickBooks](/tools/quickbooks)", "Mobile-first sole traders & SMEs", "Yes", "Yes", "From ~£16/month"],
              ["[Dext](/tools/dext)", "Receipt capture add-on", "Feeds your ledger", "Feeds your ledger", "Often via accountant"],
            ],
          },
          { type: "tools", slugs: ["freeagent", "xero", "quickbooks", "dext"] },
          {
            type: "callout",
            tone: "tip",
            title: "Check HMRC's list",
            text: "HMRC publishes a list of recognised MTD software on GOV.UK. Confirm your chosen product and plan supports the specific MTD service you need before you subscribe.",
          },
        ],
      },
    ],
    faqs: [
      {
        q: "When does Making Tax Digital for Income Tax start?",
        a: "MTD for Income Tax Self Assessment started on 6 April 2026 for sole traders and landlords with qualifying income over £50,000. It extends to those over £30,000 from April 2027 and over £20,000 from April 2028.",
      },
      {
        q: "What is the best MTD software for sole traders?",
        a: "FreeAgent is our top pick for sole traders — it is built in the UK for freelancers and is free with eligible NatWest, RBS, Ulster Bank and Mettle business accounts. QuickBooks and Xero are strong alternatives.",
      },
      {
        q: "Can I use spreadsheets for MTD?",
        a: "You can keep records in spreadsheets if you use HMRC-recognised bridging software to submit updates digitally. For most businesses, dedicated accounting software with AI categorisation is simpler.",
      },
    ],
    relatedTools: ["freeagent", "xero", "quickbooks", "dext"],
  },
  {
    slug: "uk-gdpr-ai-compliance-checklist",
    title: "UK GDPR and AI: A Practical Compliance Checklist for Small Businesses",
    metaTitle: "UK GDPR & AI Checklist for Small Businesses (2026)",
    description:
      "A practical UK GDPR checklist for using AI tools in a small business: lawful basis, DPIAs, supplier checks, staff policies, transparency and the Data (Use and Access) Act 2025.",
    kicker: "Compliance",
    keywords: ["uk gdpr ai", "ai gdpr compliance", "ai policy for small business", "ico ai guidance", "ai data protection uk"],
    published: "2026-02-11",
    updated: "2026-09-24",
    cover: { icon: "ShieldCheck", tone: "slate" },
    quickAnswer:
      "To use AI tools lawfully under UK GDPR, a small business should: identify what personal data goes into each tool, choose business plans that don't train on your data, sign the vendor's data processing agreement, check international transfer safeguards, carry out a DPIA for higher-risk uses, update your privacy notice, and give staff a short AI policy. The ICO's AI guidance is the authoritative reference.",
    takeaways: [
      "Treat every AI tool as a data processor that needs checking like any other supplier.",
      "Business plans usually exclude your data from model training; consumer plans may not.",
      "A DPIA is required for high-risk processing — for example, using AI to make decisions about people.",
      "A one-page AI policy prevents most staff mistakes.",
    ],
    sections: [
      {
        id: "checklist",
        heading: "The 10-point AI compliance checklist",
        blocks: [
          {
            type: "ol",
            items: [
              "**Map the data.** For each AI tool, list what personal data may go in (customers, staff, suppliers).",
              "**Pick business plans.** Prefer tiers where the vendor does not train on your content by default.",
              "**Sign the DPA.** Make sure a data processing agreement is in place and saved.",
              "**Check transfers.** Where is data stored? Are UK transfer safeguards (such as the IDTA or UK Addendum) in place?",
              "**Lawful basis.** Confirm your lawful basis for the processing — often legitimate interests, backed by a short assessment.",
              "**DPIA for high risk.** Carry out a Data Protection Impact Assessment where AI makes or informs significant decisions about people.",
              "**Be transparent.** Update your privacy notice to mention AI tools and their purposes.",
              "**Human oversight.** Keep a person reviewing outputs that affect customers or staff.",
              "**Staff policy.** Publish a one-page AI policy: approved tools, forbidden data, review rules.",
              "**Review annually.** AI terms change quickly — diarise a yearly supplier review.",
            ],
          },
        ],
      },
      {
        id: "duaa",
        heading: "The Data (Use and Access) Act 2025",
        blocks: [
          {
            type: "p",
            text: "The Data (Use and Access) Act 2025 amends parts of UK GDPR and the Data Protection Act 2018, including rules on automated decision-making and recognised legitimate interests. Many provisions commence in stages, so check the [ICO's guidance](https://ico.org.uk) for what is in force when you read this. The core principles — transparency, fairness, security and accountability — remain.",
          },
        ],
      },
      {
        id: "policy-template",
        heading: "A simple AI policy you can adapt",
        blocks: [
          {
            type: "quote",
            text: "Staff may use approved AI tools (listed below) for drafting, summarising and research. Do not enter special category data, payment details, passwords or confidential client information unless the tool is approved for it. You are responsible for checking AI output before it is sent or published. Report any mistakes or data incidents to [name] immediately.",
          },
        ],
      },
    ],
    faqs: [
      {
        q: "Do I need a DPIA to use ChatGPT or Claude?",
        a: "Not always. Everyday drafting with no or minimal personal data is usually low risk. A DPIA is required where processing is likely to result in high risk — for example, using AI to screen job applicants or make decisions about customers.",
      },
      {
        q: "Can employees use AI tools at work?",
        a: "Yes, with a clear AI policy that lists approved tools, sets out what data must never be entered, and requires human review of outputs.",
      },
      {
        q: "Where can I find official guidance on AI and data protection?",
        a: "The Information Commissioner's Office (ICO) publishes guidance on AI and data protection at ico.org.uk, including an AI and data protection risk toolkit.",
      },
    ],
    relatedTools: ["microsoft-365-copilot", "claude", "chatgpt", "gemini"],
  },
  {
    slug: "best-ai-research-tools",
    title: "Best AI Research Tools for Business (2026)",
    metaTitle: "Best AI Research Tools & Assistants for Business (2026)",
    description:
      "The best AI research tools and research assistants for businesses: Perplexity, Gemini Deep Research, ChatGPT, Claude and NotebookLM compared for market, competitor and supplier research.",
    kicker: "Buyer's Guide",
    keywords: ["ai research tools", "ai tools for research", "ai research assistant", "best ai research tools", "research ai tools"],
    published: "2026-05-06",
    updated: "2026-09-24",
    cover: { icon: "SearchCheck", tone: "blue" },
    quickAnswer:
      "Perplexity is the best AI research tool for quick, cited answers. For in-depth reports, Gemini Deep Research, ChatGPT deep research and Claude's research mode each compile multi-source briefings in minutes. NotebookLM is best for researching your own documents. Always verify key facts against the original sources.",
    takeaways: [
      "Use cited-answer tools for facts you need to verify.",
      "Deep-research modes are ideal for market and competitor briefings.",
      "NotebookLM and Claude Projects are best for researching your own files.",
      "For UK regulation, favour answers that cite GOV.UK, HMRC or the ICO directly.",
    ],
    sections: [
      {
        id: "picks",
        heading: "Our picks",
        blocks: [
          {
            type: "table",
            head: ["Tool", "Best for", "Citations", "Free plan"],
            rows: [
              ["[Perplexity](/tools/perplexity)", "Fast cited answers", "Yes, every answer", "Yes"],
              ["[Gemini](/tools/gemini)", "Deep Research reports, NotebookLM", "Yes", "Yes"],
              ["[ChatGPT](/tools/chatgpt)", "Deep research with data analysis", "Yes", "Limited"],
              ["[Claude](/tools/claude)", "Analysing long documents and research", "Yes", "Limited"],
            ],
          },
          { type: "tools", slugs: ["perplexity", "gemini", "chatgpt", "claude"] },
        ],
      },
      {
        id: "use-cases",
        heading: "Research tasks AI does well",
        blocks: [
          {
            type: "ul",
            items: [
              "**Competitor analysis** — pricing, positioning and reviews of local competitors.",
              "**Supplier due diligence** — Companies House history, news coverage and reviews.",
              "**Market sizing** — pulling together published statistics with sources.",
              "**Regulation look-ups** — summarising GOV.UK guidance (always click through).",
              "**Tender preparation** — digesting long tender documents and extracting requirements.",
            ],
          },
        ],
      },
      {
        id: "verify",
        heading: "How to verify AI research",
        blocks: [
          {
            type: "ol",
            items: [
              "Open every citation behind a number you plan to use.",
              "Prefer primary sources (ONS, GOV.UK, Companies House, company filings).",
              "Check dates — AI may cite outdated figures.",
              "Ask the tool: \"What would contradict this conclusion?\"",
            ],
          },
        ],
      },
    ],
    faqs: [
      {
        q: "What is the best AI research tool?",
        a: "Perplexity is the best AI research tool for fast answers with citations. For long, structured reports, Gemini Deep Research and ChatGPT deep research are excellent, and NotebookLM is best for researching your own documents.",
      },
      {
        q: "Can AI replace a research assistant?",
        a: "AI can do much of the gathering and summarising a junior researcher would, in minutes. It still needs a human to verify sources, apply judgement and spot errors.",
      },
    ],
    relatedTools: ["perplexity", "gemini", "chatgpt", "claude"],
  },
  {
    slug: "how-to-use-ai-in-your-small-business",
    title: "How to Use AI in Your Small Business: A 30-Day Plan",
    metaTitle: "How to Use AI in a Small Business: 30-Day Plan (UK, 2026)",
    description:
      "A practical 30-day plan to start using AI in a UK small business: choose the right tools, train your team, write an AI policy and measure the time saved — without wasting money.",
    kicker: "Getting Started",
    keywords: ["ai for small businesses", "how to use ai in business", "ai for business leaders", "ai productivity tools", "ai adoption small business"],
    published: "2026-06-15",
    updated: "2026-09-24",
    cover: { icon: "Rocket", tone: "teal" },
    quickAnswer:
      "To start using AI in a small business: in week one, list your most time-consuming tasks and choose one AI assistant; in week two, use it daily and build a prompt library; in week three, add one automation and write a short AI policy; in week four, measure time saved and decide what to keep. Most businesses can do this for under £50 a month.",
    takeaways: [
      "Start with problems, not tools.",
      "One assistant and one automation beat ten unused subscriptions.",
      "A shared prompt library multiplies the value across your team.",
      "Measure hours saved to decide what to keep.",
    ],
    sections: [
      {
        id: "week-1",
        heading: "Week 1: Find the time sinks and choose your assistant",
        blocks: [
          {
            type: "p",
            text: "Ask everyone to note the tasks that eat their time: writing quotes, answering the same customer questions, chasing invoices, preparing reports. Then choose one general assistant — see our [AI model comparison](/guides/ai-model-comparison). If you already pay for Microsoft 365 or Google Workspace, start with the AI already included.",
          },
        ],
      },
      {
        id: "week-2",
        heading: "Week 2: Use it daily and build a prompt library",
        blocks: [
          {
            type: "p",
            text: "Use the assistant on real work every day. When a prompt works well, save it in a shared document. Good prompts include context (who you are, who the audience is), the task, the format, and examples.",
          },
          {
            type: "table",
            head: ["Task", "Starter prompt"],
            rows: [
              ["Quote email", "\"Write a friendly, concise British English email to [client] quoting for [job]. Include price £[x] + VAT, what's included, and next steps.\""],
              ["Contract check", "\"Summarise this contract in plain English. List payment terms, termination clauses, liabilities and anything unusual for a UK SME.\""],
              ["Job advert", "\"Write an inclusive job advert for a [role] in [town], salary £[x]. Avoid jargon and gendered language.\""],
              ["Meeting actions", "\"Turn these notes into a list of actions with owners and deadlines.\""],
            ],
          },
        ],
      },
      {
        id: "week-3",
        heading: "Week 3: Add one automation and an AI policy",
        blocks: [
          {
            type: "p",
            text: "Pick your most repetitive task and automate it — our [AI workflows guide](/guides/ai-workflows-for-small-business) has ten examples. At the same time, publish a one-page AI policy using our [UK GDPR checklist](/guides/uk-gdpr-ai-compliance-checklist).",
          },
        ],
      },
      {
        id: "week-4",
        heading: "Week 4: Measure and decide",
        blocks: [
          {
            type: "p",
            text: "Estimate hours saved per person per week and compare with the cost. If an assistant saves one person two hours a week, a ~£20 monthly subscription pays for itself many times over. Cancel anything that isn't being used.",
          },
          {
            type: "callout",
            tone: "tip",
            title: "Common pitfalls",
            text: "Buying too many tools at once; skipping the policy; publishing AI output without checking; and not sharing successful prompts across the team.",
          },
        ],
      },
    ],
    faqs: [
      {
        q: "How can a small business use AI?",
        a: "Small businesses use AI to draft emails and quotes, summarise documents, automate bookkeeping, answer customer questions, create marketing content, take meeting notes and connect apps with automated workflows.",
      },
      {
        q: "How much does AI cost for a small business?",
        a: "Many AI tools have free plans. A typical small business spends £20–£60 per person per month on a paid assistant and possibly an automation tool — often less if AI is already included in Microsoft 365, Google Workspace or accounting software.",
      },
      {
        q: "Do I need technical skills to use AI?",
        a: "No. AI assistants work in plain English, and no-code automation tools like Zapier are designed for non-technical users.",
      },
    ],
    relatedTools: ["claude", "chatgpt", "zapier", "microsoft-365-copilot", "gemini"],
  },
  {
    slug: "best-ai-customer-service-software-uk",
    title: "Best AI Customer Service Software for UK Small Businesses",
    metaTitle: "Best AI Customer Service Software UK (2026): Chatbots & Agents",
    description:
      "The best AI customer service software for UK small businesses — Fin by Intercom, Tidio, Zendesk and HubSpot — compared on resolution quality, pricing in £ and UK GDPR.",
    kicker: "Buyer's Guide",
    keywords: ["ai customer service software", "ai chatbot for small business", "ai customer support uk", "best ai chatbot for website"],
    published: "2026-07-08",
    updated: "2026-09-24",
    cover: { icon: "Headset", tone: "navy" },
    quickAnswer:
      "Fin by Intercom is the most capable AI customer service agent for businesses with a lot of repetitive questions. Tidio is the best value for small online shops, Zendesk suits established support teams, and HubSpot is ideal if you want support in the same place as your CRM.",
    takeaways: [
      "AI agents are only as good as your help content — write good FAQs first.",
      "Per-resolution pricing aligns cost with value, but set a budget cap.",
      "Always offer a clear route to a human.",
      "Mention AI chat in your privacy notice.",
    ],
    sections: [
      {
        id: "picks",
        heading: "Our picks",
        blocks: [
          {
            type: "table",
            head: ["Tool", "Best for", "Pricing (approx.)"],
            rows: [
              ["[Fin by Intercom](/tools/intercom-fin)", "High volumes of repetitive questions", "~$0.99 per resolution + seats"],
              ["[Tidio](/tools/tidio)", "Small online shops", "Free; paid ~£20–£25/month"],
              ["[Zendesk](/tools/zendesk)", "Dedicated support teams", "From ~£16–£20/agent/month"],
              ["[HubSpot](/tools/hubspot)", "Support alongside CRM", "Free tools; paid tiers per seat"],
            ],
          },
          { type: "tools", slugs: ["intercom-fin", "tidio", "zendesk", "hubspot"] },
        ],
      },
      {
        id: "setup",
        heading: "How to set up an AI support agent well",
        blocks: [
          {
            type: "ol",
            items: [
              "Audit your last 100 support questions and group them by theme.",
              "Write or update clear help articles for the top ten themes.",
              "Connect the AI agent to that content only — not everything on your drive.",
              "Set clear escalation rules and test with tricky questions.",
              "Review a sample of AI conversations weekly for the first month.",
            ],
          },
        ],
      },
    ],
    faqs: [
      {
        q: "What is the best AI chatbot for a small business website?",
        a: "Tidio is the best-value AI chatbot for small business websites and online shops. Fin by Intercom is more capable for businesses with high support volumes.",
      },
      {
        q: "Will AI replace my customer service team?",
        a: "AI can resolve many routine questions, freeing your team to handle complex, sensitive and high-value conversations. Most businesses use AI to scale support rather than replace people.",
      },
    ],
    relatedTools: ["intercom-fin", "tidio", "zendesk", "hubspot"],
  },
];
