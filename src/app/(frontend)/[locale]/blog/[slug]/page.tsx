import type { Metadata } from 'next'

import { BlogPostView } from '@/components/blog/BlogPostView'
import { RelatedPosts } from '@/blocks/RelatedPosts/Component'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import { draftMode } from 'next/headers'
import React from 'react'

import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { isValidLocale } from '@/lib/i18n/config'
import { notFound } from 'next/navigation'
import { safeStaticParams } from '@/lib/payload/safeStaticParams'
import { getAllBlogSlugs, getPostBySlug } from '@/lib/payload/queries/blog'
import { blogPostingJsonLd } from '@/lib/seo/jsonLd'
import { getServerSideURL } from '@/utilities/getURL'

export async function generateStaticParams() {
  return safeStaticParams(async () => getAllBlogSlugs())
}

type Args = {
  params: Promise<{
    locale: string
    slug?: string
  }>
}

export default async function Post({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { locale: localeParam, slug = '' } = await paramsPromise
  if (!isValidLocale(localeParam)) notFound()
  const locale = localeParam
  const decodedSlug = decodeURIComponent(slug)
  const url = `/${locale}/blog/${decodedSlug}`
  const post = await getPostBySlug(decodedSlug, locale)

  if (!post) return <PayloadRedirects url={url} />

  const baseUrl = getServerSideURL()
  const postUrl = `${baseUrl}/${locale}/blog/${decodedSlug}`
  const imageUrl =
    post.heroImage && typeof post.heroImage === 'object' && post.heroImage.url
      ? `${baseUrl}${post.heroImage.url}`
      : undefined

  const jsonLd = blogPostingJsonLd({
    title: post.title,
    description: post.description,
    url: postUrl,
    imageUrl,
    publishedAt: post.publishedAt,
    locale,
  })

  return (
    <article className="pt-16 pb-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageClient />
      <PayloadRedirects disableNotFound url={url} />
      {draft && <LivePreviewListener />}

      <div className="container max-w-3xl mx-auto py-8">
        <BlogPostView post={post} locale={locale} />
      </div>

      {post.relatedPosts && post.relatedPosts.length > 0 && (
        <RelatedPosts
          className="mt-12 container max-w-5xl"
          docs={post.relatedPosts.filter((p) => typeof p === 'object')}
        />
      )}
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { locale: localeParam, slug = '' } = await paramsPromise
  if (!isValidLocale(localeParam)) return {}
  const decodedSlug = decodeURIComponent(slug)
  const post = await getPostBySlug(decodedSlug, localeParam)
  return generateMeta({ doc: post })
}
