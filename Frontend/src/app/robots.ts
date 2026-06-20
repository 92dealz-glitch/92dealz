import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin-dashboard/', '/vendor-dashboard/', '/api/'],
    },
    sitemap: 'https://92dealz.vercel.app/sitemap.xml',
  }
}

