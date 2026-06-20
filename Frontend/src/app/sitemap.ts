import { MetadataRoute } from 'next'
import { API_BASE } from '@/services/apiClient'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://92dealz.vercel.app'

  // Static routes
  const routes = [
    '',
    '/about',
    '/contact',
    '/pricing',
    '/faq',
    '/safety-tips',
    '/terms',
    '/privacy-policy',
    '/billing-policy',
    '/cookie-policy',
    '/copyright-policy',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  // Optional: Fetch top products to include in sitemap
  let productEntries: any[] = []
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || API_BASE}/ads?limit=100`)
    const data = await res.json()
    if (data?.success && data.data) {
      productEntries = data.data.map((ad: any) => ({
        url: `${baseUrl}/product/${ad.id}`,
        lastModified: new Date(ad.updatedAt || ad.createdAt),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      }))
    }
  } catch (error) {
    console.error('Sitemap product fetch failed:', error)
  }

  return [...routes, ...productEntries]
}


