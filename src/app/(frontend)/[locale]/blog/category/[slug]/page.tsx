import type { Metadata } from 'next/types'

import { CollectionArchive } from '@/components/CollectionArchive'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import PageClient from '../../page.client'
import { isValidLocale, LOCALES, type Locale } from '@/lib/i18n/config'
import { notFound } from 'next/navigation'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { safeStaticParams } from '@/lib/payload/safeStaticParams'

export const revalidate = 600

type Args = {
  params: Promise<{
    locale: string
    slug: string
  }>
}

export default async function CategoryPage({ params: paramsPromise }: Args) {
  const { locale: localeParam, slug } = await paramsPromise
  if (!isValidLocale(localeParam)) notFound()
  const locale = localeParam as Locale
  const decodedSlug = decodeURIComponent(slug)

  const payload = await getPayload({ config: configPromise })

  const categoryResult = await payload.find({
    collection: 'categories',
    locale,
    limit: 1,
    pagination: false,
    where: { slug: { equals: decodedSlug } },
  })

  const category = categoryResult.docs?.[0]
  if (!category) notFound()

  const posts = await payload.find({
    collection: 'posts',
    locale,
    depth: 1,
    limit: 12,
    overrideAccess: false,
    where: { category: { equals: category.id } },
    select: {
      title: true,
      slug: true,
      description: true,
      heroImage: true,
      category: true,
      meta: true,
    },
  })

  return (
    <div className="pt-24 pb-24">
      <PageClient />
      <div className="container mb-16">
        <h1 className="text-3xl md:text-5xl font-bold text-white">{category.title}</h1>
      </div>

      <div className="container mb-8">
        <PageRange collection="posts" currentPage={posts.page} limit={12} totalDocs={posts.totalDocs} />
      </div>

      <CollectionArchive posts={posts.docs} locale={locale} />

      <div className="container">
        {posts.totalPages > 1 && posts.page && (
          <Pagination page={posts.page} totalPages={posts.totalPages} />
        )}
      </div>
    </div>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { locale: localeParam, slug } = await paramsPromise
  if (!isValidLocale(localeParam)) return {}

  const payload = await getPayload({ config: configPromise })
  const categoryResult = await payload.find({
    collection: 'categories',
    locale: localeParam,
    limit: 1,
    pagination: false,
    where: { slug: { equals: decodeURIComponent(slug) } },
  })

  const category = categoryResult.docs?.[0]
  if (!category) return {}

  return buildPageMetadata({
    title: category.title,
    description: category.title,
    locale: localeParam,
    path: `/blog/category/${slug}`,
  })
}

export async function generateStaticParams() {
  return safeStaticParams(async () => {
    const payload = await getPayload({ config: configPromise })
    const params: { locale: Locale; slug: string }[] = []

    for (const locale of LOCALES) {
      const categories = await payload.find({
        collection: 'categories',
        locale,
        limit: 1000,
        pagination: false,
        select: { slug: true },
      })

      categories.docs?.forEach(({ slug }) => {
        if (slug) params.push({ locale, slug })
      })
    }

    return params
  })
}
