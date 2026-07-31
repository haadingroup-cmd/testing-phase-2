import { MetadataRoute } from 'next'

const base = 'https://www.haadinglobal.com'

const pages = [
  { url: '/', pri: 1.0, chg: 'weekly' as const },
  { url: '/services', pri: 0.9, chg: 'weekly' as const },
  { url: '/services/meta-ads', pri: 0.9, chg: 'monthly' as const },
  { url: '/services/google-ads', pri: 0.9, chg: 'monthly' as const },
  { url: '/services/seo', pri: 0.9, chg: 'monthly' as const },
  { url: '/services/social-media', pri: 0.8, chg: 'monthly' as const },
  { url: '/services/youtube-automation', pri: 0.9, chg: 'monthly' as const },
  { url: '/services/web-development', pri: 0.8, chg: 'monthly' as const },
  { url: '/services/shopify', pri: 0.8, chg: 'monthly' as const },
  { url: '/services/branding', pri: 0.7, chg: 'monthly' as const },
  { url: '/services/ai-automation', pri: 0.8, chg: 'monthly' as const },
  { url: '/services/content-writing', pri: 0.7, chg: 'monthly' as const },
  { url: '/services/tiktok-ads', pri: 0.8, chg: 'monthly' as const },
  { url: '/services/graphic-design', pri: 0.7, chg: 'monthly' as const },
  { url: '/portfolio', pri: 0.8, chg: 'weekly' as const },
  { url: '/team', pri: 0.7, chg: 'monthly' as const },
  { url: '/pricing', pri: 0.8, chg: 'monthly' as const },
  { url: '/about', pri: 0.7, chg: 'monthly' as const },
  { url: '/blog', pri: 0.8, chg: 'weekly' as const },
  { url: '/contact', pri: 0.8, chg: 'monthly' as const },
  { url: '/consultation', pri: 0.9, chg: 'monthly' as const },
  { url: '/agency/digital-marketing-agency-dubai', pri: 0.9, chg: 'monthly' as const },
  { url: '/agency/digital-marketing-agency-qatar', pri: 0.9, chg: 'monthly' as const },
  { url: '/agency/digital-marketing-agency-saudi-arabia', pri: 0.9, chg: 'monthly' as const },
  { url: '/careers', pri: 0.6, chg: 'monthly' as const },
  { url: '/privacy-policy', pri: 0.3, chg: 'yearly' as const },
  { url: '/terms', pri: 0.3, chg: 'yearly' as const },
]

export default function sitemap(): MetadataRoute.Sitemap {
  // Use build-time date so search engines see fresh content on each deploy.
  const now = new Date()
  return pages.map(p => ({
    url: `${base}${p.url}`,
    lastModified: now,
    changeFrequency: p.chg,
    priority: p.pri,
  }))
}
