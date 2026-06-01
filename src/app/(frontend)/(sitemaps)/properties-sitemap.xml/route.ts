import { getServerSideSitemap } from 'next-sitemap'
import { unstable_cache } from 'next/cache'

import { LOCALES } from '@/lib/i18n/config'
import { getPayload } from '@/lib/payload/getPayload'

const getPropertiesSitemap = unstable_cache(
  async () => {
    const payload = await getPayload()
    const SITE_URL =
      process.env.NEXT_PUBLIC_SERVER_URL ||
      process.env.VERCEL_PROJECT_PRODUCTION_URL ||
      'https://example.com'

    const results = await payload.find({
      collection: 'properties',
      overrideAccess: false,
      draft: false,
      depth: 0,
      limit: 1000,
      pagination: false,
      where: {
        and: [
          { _status: { equals: 'published' } },
          { listingStatus: { equals: 'active' } },
        ],
      },
      select: {
        objectCode: true,
        listingDate: true,
      },
    })

    const dateFallback = new Date().toISOString()
    const sitemap: Array<{ loc: string; lastmod: string }> = []

    for (const locale of LOCALES) {
      sitemap.push({
        loc: `${SITE_URL}/${locale}/properties`,
        lastmod: dateFallback,
      })
    }

    results.docs?.forEach((doc) => {
      if (!doc.objectCode) return
      const lastmod = doc.listingDate || dateFallback
      for (const locale of LOCALES) {
        sitemap.push({
          loc: `${SITE_URL}/${locale}/properties/${encodeURIComponent(doc.objectCode)}`,
          lastmod,
        })
      }
    })

    return sitemap
  },
  ['properties-sitemap'],
  { tags: ['properties-sitemap'] },
)

export async function GET() {
  const sitemap = await getPropertiesSitemap()
  return getServerSideSitemap(sitemap)
}
