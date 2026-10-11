import { MetadataRoute } from 'next'
import { LANDINGS } from '@/data/landings'
import { BLOG_POSTS } from '@/data/blog'
import { TEAM } from '@/data/team'
import { LANDINGS_AR } from '@/data/landings-ar'

const base = 'https://www.haadinglobal.com'

// Real content-edit dates only (never the build time). Add an entry when a
// page's content changes meaningfully, so lastmod stays trustworthy.
const EDITED: Record<string, string> = {
  '/services/seo': '2026-10-11',
  '/services/web-development': '2026-10-11',
  '/services/shopify': '2026-10-11',
  '/agency/digital-marketing-agency-dubai': '2026-10-11',
  '/agency/digital-marketing-agency-saudi-arabia': '2026-10-11',
  '/agency/digital-marketing-agency-uk': '2026-10-11',
  '/agency/digital-marketing-agency-usa': '2026-10-11',
}
const edited = (path: string) => (EDITED[path] ? { lastModified: new Date(`${EDITED[path]}T00:00:00Z`) } : {})

const pages = [
  { url: '/', pri: 1.0, chg: 'weekly' as const },
  { url: '/free-seo-audit', pri: 0.8, chg: 'monthly' as const },
  { url: '/services', pri: 0.9, chg: 'weekly' as const },
  { url: '/services/meta-ads', pri: 0.9, chg: 'monthly' as const },
  { url: '/services/google-ads', pri: 0.9, chg: 'monthly' as const },
  { url: '/services/seo', pri: 0.9, chg: 'monthly' as const },
  { url: '/services/social-media', pri: 0.8, chg: 'monthly' as const },
  { url: '/services/youtube-channel-management', pri: 0.9, chg: 'monthly' as const },
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
  { url: '/careers', pri: 0.6, chg: 'monthly' as const },
  { url: '/privacy-policy', pri: 0.3, chg: 'yearly' as const },
  { url: '/terms', pri: 0.3, chg: 'yearly' as const },
]

export default function sitemap(): MetadataRoute.Sitemap {
  // No lastModified on pages without a real edit date: stamping every URL with
  // the build time on every deploy makes Google distrust (and ignore) lastmod.
  // Blog posts carry their true publish date instead.

  // All city landing pages (Pakistan + Gulf) generated straight from data,
  // so every city we add is automatically in the sitemap — no manual editing.
  const arSlugs = new Set(LANDINGS_AR.map((l) => l.slug))
  const hubAlternates = (slug: string) =>
    arSlugs.has(slug)
      ? { alternates: { languages: { en: `${base}/agency/${slug}`, ar: `${base}/ar/agency/${slug}` } } }
      : {}
  const cityPages = LANDINGS.map((l) => ({
    url: `${base}/agency/${l.slug}`,
    ...edited(`/agency/${l.slug}`),
    changeFrequency: 'monthly' as const,
    priority: 0.9,
    ...hubAlternates(l.slug),
  }))

  const arabicPages = LANDINGS_AR.map((l) => ({
    url: `${base}/ar/agency/${l.slug}`,
    lastModified: new Date('2026-10-11T00:00:00Z'),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
    ...hubAlternates(l.slug),
  }))

  const blogPages = BLOG_POSTS.map((post) => ({
    url: `${base}/blog/${post.slug}`,
    lastModified: new Date(`${post.updated ?? post.date} UTC`),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // Public team member profiles — each is its own indexable Person page.
  const teamPages = TEAM.filter((m) => m.is_public).map((m) => ({
    url: `${base}/team/${m.slug}`,
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }))

  const staticPages = pages.map(p => ({
    url: `${base}${p.url}`,
    ...edited(p.url),
    changeFrequency: p.chg,
    priority: p.pri,
  }))

  return [...staticPages, ...cityPages, ...arabicPages, ...blogPages, ...teamPages]
}
