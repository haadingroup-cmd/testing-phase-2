import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

// Generative-engine optimisation: explicitly welcome search and AI answer-engine crawlers
// so the site can be cited in ChatGPT, Claude, Perplexity, Gemini and Copilot answers.
const AI_CRAWLERS = [
  "GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-SearchBot", "Claude-User", "anthropic-ai",
  "PerplexityBot", "Perplexity-User", "Google-Extended", "Applebot-Extended", "Bingbot", "CCBot", "Amazonbot", "meta-externalagent", "DuckAssistBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/api/", "/search", "/unsubscribe"] },
      ...AI_CRAWLERS.map((ua) => ({ userAgent: ua, allow: "/", disallow: ["/api/"] })),
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
