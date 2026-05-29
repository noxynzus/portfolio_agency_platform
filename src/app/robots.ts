import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://atthawat.studio'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard/', '/api/', '/login', '/unauthorized'],
      },
      {
        userAgent: 'GPTBot', // OpenAI crawler
        disallow: '/',
      },
      {
        userAgent: 'ChatGPT-User', // ChatGPT user agent
        disallow: '/',
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
