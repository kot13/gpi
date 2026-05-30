import type { Metadata } from 'next/types'

import { BlogList } from '@/components/blog/BlogList'
import { getPosts } from '@/lib/payload/queries/blog'
import PageClient from './page.client'
import { isValidLocale, type Locale } from '@/lib/i18n/config'
import { notFound } from 'next/navigation'
import { buildPageMetadata } from '@/lib/seo/metadata'

export const dynamic = 'force-static'
export const revalidate = 600

type Args = { params: Promise<{ locale: string }> }

export default async function BlogPage({ params: paramsPromise }: Args) {
  const { locale: localeParam } = await paramsPromise
  if (!isValidLocale(localeParam)) notFound()
  const locale = localeParam as Locale

  const posts = await getPosts(locale, 1, 12)

  return (
    <div className="pt-24 pb-24">
      <PageClient />
      <div className="container mb-16">
        <h1 className="text-3xl md:text-5xl font-bold text-white">Блог</h1>
      </div>

      <BlogList
        posts={posts.docs}
        locale={locale}
        page={posts.page ?? undefined}
        totalPages={posts.totalPages}
      />
    </div>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { locale: localeParam } = await paramsPromise
  if (!isValidLocale(localeParam)) return {}
  return buildPageMetadata({
    title: 'Блог',
    description: 'Статьи и гайды GPI',
    locale: localeParam,
    path: '/blog',
  })
}
