import type { Metadata } from 'next/types'

import { BlogList } from '@/components/blog/BlogList'
import { RenderHero } from '@/heros/RenderHero'
import { getMessages } from '@/lib/i18n/getMessages'
import { getPageBySlug } from '@/lib/payload/queries/pages'
import { getPosts } from '@/lib/payload/queries/blog'
import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'
import { isValidLocale, type Locale } from '@/lib/i18n/config'
import { notFound } from 'next/navigation'

export const dynamic = 'force-static'
export const revalidate = 600

type Args = { params: Promise<{ locale: string }> }

export default async function BlogPage({ params: paramsPromise }: Args) {
  const { locale: localeParam } = await paramsPromise
  if (!isValidLocale(localeParam)) notFound()
  const locale = localeParam as Locale
  const t = getMessages(locale)

  const [page, posts] = await Promise.all([
    getPageBySlug('blog', locale),
    getPosts(locale, 1, 12),
  ])

  if (!page) notFound()

  return (
    <article className="pt-8 pb-8">
      <PageClient />
      <RenderHero {...page.hero} locale={locale} />
      <BlogList
        posts={posts.docs}
        locale={locale}
        page={posts.page ?? undefined}
        totalPages={posts.totalPages}
        emptyMessage={t.blogEmpty}
      />
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { locale: localeParam } = await paramsPromise
  if (!isValidLocale(localeParam)) return {}
  const page = await getPageBySlug('blog', localeParam)
  return generateMeta({ doc: page })
}
