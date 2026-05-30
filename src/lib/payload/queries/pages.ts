import { draftMode } from 'next/headers'
import { cache } from 'react'

import type { Locale } from '@/lib/i18n/config'
import { LOCALES } from '@/lib/i18n/config'
import { getPayload } from '@/lib/payload/getPayload'

export const getPageBySlug = cache(async (slug: string, locale: Locale) => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload()

  const result = await payload.find({
    collection: 'pages',
    locale,
    draft,
    limit: 1,
    pagination: false,
    overrideAccess: draft,
    where: { slug: { equals: slug } },
  })

  return result.docs?.[0] ?? null
})

export async function getAllPageSlugs(): Promise<Array<{ locale: Locale; slug: string }>> {
  const payload = await getPayload()
  const params: Array<{ locale: Locale; slug: string }> = []

  for (const locale of LOCALES) {
    const pages = await payload.find({
      collection: 'pages',
      locale,
      draft: false,
      limit: 1000,
      overrideAccess: false,
      pagination: false,
      select: { slug: true },
    })

    pages.docs?.forEach(({ slug }) => {
      if (slug && slug !== 'home') params.push({ locale, slug })
    })
  }

  return params
}
