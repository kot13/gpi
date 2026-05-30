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
    pageNumber: string
  }>
}

export default async function BlogPaginationPage({ params: paramsPromise }: Args) {
  const { locale: localeParam, pageNumber } = await paramsPromise
  if (!isValidLocale(localeParam)) notFound()
  const locale = localeParam as Locale

  const sanitizedPageNumber = Number(pageNumber)
  if (!Number.isInteger(sanitizedPageNumber) || sanitizedPageNumber < 1) notFound()

  const payload = await getPayload({ config: configPromise })

  const posts = await payload.find({
    collection: 'posts',
    locale,
    depth: 1,
    limit: 12,
    page: sanitizedPageNumber,
    overrideAccess: false,
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
        <h1 className="text-3xl md:text-5xl font-bold text-white">Блог</h1>
      </div>

      <div className="container mb-8">
        <PageRange
          collection="posts"
          currentPage={posts.page}
          limit={12}
          totalDocs={posts.totalDocs}
        />
      </div>

      <CollectionArchive posts={posts.docs} locale={locale} />

      <div className="container">
        {posts?.page && posts?.totalPages > 1 && (
          <Pagination page={posts.page} totalPages={posts.totalPages} />
        )}
      </div>
    </div>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { locale: localeParam, pageNumber } = await paramsPromise
  if (!isValidLocale(localeParam)) return {}
  return buildPageMetadata({
    title: `Блог — страница ${pageNumber}`,
    description: 'Статьи и гайды GPI',
    locale: localeParam,
    path: `/blog/page/${pageNumber}`,
  })
}

export async function generateStaticParams() {
  return safeStaticParams(async () => {
    const payload = await getPayload({ config: configPromise })
    const params: { locale: Locale; pageNumber: string }[] = []

    for (const locale of LOCALES) {
      const { totalDocs } = await payload.count({
        collection: 'posts',
        locale,
        overrideAccess: false,
      })

      const totalPages = Math.ceil(totalDocs / 12)

      for (let i = 1; i <= totalPages; i++) {
        params.push({ locale, pageNumber: String(i) })
      }
    }

    return params
  })
}
