import { MetadataRoute } from 'next'

// Private/functional paths that should never be indexed.
const DISALLOW = ['/api/', '/admin/', '/dashboard/', '/thank-you', '/login']

// AI answer-engine crawlers we explicitly welcome. Listing them by name makes
// our intent unambiguous (and future-proofs us if a global rule is ever
// tightened) — being crawlable by these bots is what makes HaadinGlobal
// eligible to be cited inside ChatGPT, Claude, Perplexity, Gemini/AI Overviews
// and Copilot answers.
const AI_BOTS = [
  'GPTBot',            // OpenAI / ChatGPT
  'OAI-SearchBot',     // OpenAI search
  'ChatGPT-User',      // ChatGPT browsing
  'ClaudeBot',         // Anthropic / Claude
  'Claude-Web',        // Anthropic browsing
  'anthropic-ai',      // Anthropic (legacy)
  'PerplexityBot',     // Perplexity
  'Perplexity-User',   // Perplexity browsing
  'Google-Extended',   // Gemini / Google AI Overviews training
  'Applebot-Extended', // Apple Intelligence
  'CCBot',             // Common Crawl (training source for many LLMs)
  'Bingbot',           // Bing = Copilot's underlying index
  'DuckAssistBot',     // DuckDuckGo AI
]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Default rule for all crawlers (Google, Bing, etc.).
      { userAgent: '*', allow: '/', disallow: DISALLOW },
      // Explicitly allow every AI answer-engine crawler.
      ...AI_BOTS.map((bot) => ({ userAgent: bot, allow: '/', disallow: DISALLOW })),
    ],
    host: 'https://www.haadinglobal.com',
    sitemap: 'https://www.haadinglobal.com/sitemap.xml',
  }
}
