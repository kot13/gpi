import { draftMode } from 'next/headers'
import { cache } from 'react'

import type { Locale } from '@/lib/i18n/config'
import { LOCALES } from '@/lib/i18n/config'
import { getPayload } from '@/lib/payload/getPayload'

const postSelect = {
  title: true,
  slug: true,
  description: true,
  heroImage: true,
  category: true,
  meta: true,
  content: true,
  publishedAt: true,
} as const

export const getPosts = cache(async (locale: Locale, page = 1, limit = 12) => {
  const payload = await getPayload()
  return payload.find({
    collection: 'posts',
    locale,
    depth: 1,
    limit,
    page,
    overrideAccess: false,
    select: postSelect,
  })
})

export const getPostBySlug = cache(async (slug: string, locale: Locale) => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload()

  const result = await payload.find({
    collection: 'posts',
    locale,
    draft,
    limit: 1,
    pagination: false,
    overrideAccess: draft,
    where: { slug: { equals: slug } },
  })

  return result.docs?.[0] ?? null
})

export const getPostsByCategory = cache(async (categoryId: number | string, locale: Locale) => {
  const payload = await getPayload()
  return payload.find({
    collection: 'posts',
    locale,
    depth: 1,
    limit: 12,
    overrideAccess: false,
    where: { category: { equals: categoryId } },
    select: postSelect,
  })
})

export async function getAllBlogSlugs(): Promise<Array<{ locale: Locale; slug: string }>> {
  const payload = await getPayload()
  const params: Array<{ locale: Locale; slug: string }> = []

  for (const locale of LOCALES) {
    const posts = await payload.find({
      collection: 'posts',
      locale,
      draft: false,
      limit: 1000,
      overrideAccess: false,
      pagination: false,
      select: { slug: true },
    })

    posts.docs?.forEach(({ slug }) => {
      if (slug) params.push({ locale, slug })
    })
  }

  return params
}
