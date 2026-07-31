import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/api/', '/admin/', '/dashboard/', '/thank-you', '/login'] },
    ],
    sitemap: 'https://www.haadinglobal.com/sitemap.xml',
  }
}
