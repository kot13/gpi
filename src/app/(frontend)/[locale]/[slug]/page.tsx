import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload, type RequiredDataFromCollectionSlug } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import { homeStatic } from '@/endpoints/seed/home-static'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'
import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { LOCALES, isValidLocale, type Locale } from '@/lib/i18n/config'
import { notFound } from 'next/navigation'
import { safeStaticParams } from '@/lib/payload/safeStaticParams'

export async function generateStaticParams() {
  return safeStaticParams(async () => {
    const payload = await getPayload({ config: configPromise })
    const params: { locale: Locale; slug: string }[] = []

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
        if (slug && slug !== 'home' && slug !== 'blog' && slug !== '404') {
          params.push({ locale, slug })
        }
      })
    }

    return params
  })
}

type Args = {
  params: Promise<{
    locale: string
    slug?: string
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { locale: localeParam, slug = 'home' } = await paramsPromise
  if (!isValidLocale(localeParam)) notFound()
  const locale = localeParam
  const decodedSlug = decodeURIComponent(slug)
  const url = `/${locale}/${decodedSlug === 'home' ? '' : decodedSlug}`.replace(/\/$/, '') || `/${locale}`

  let page: RequiredDataFromCollectionSlug<'pages'> | null = await queryPageBySlug({
    slug: decodedSlug,
    locale,
  })

  if (!page && slug === 'home') {
    page = homeStatic as RequiredDataFromCollectionSlug<'pages'>
  }

  if (!page) {
    return <PayloadRedirects url={url} />
  }

  const { hero, layout } = page

  return (
    <article className="pt-16 pb-24">
      <PageClient />
      <PayloadRedirects disableNotFound url={url} />
      {draft && <LivePreviewListener />}
      <RenderHero {...hero} locale={locale} />
      <RenderBlocks blocks={layout} locale={locale} />
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { locale: localeParam, slug = 'home' } = await paramsPromise
  if (!isValidLocale(localeParam)) return {}
  const decodedSlug = decodeURIComponent(slug)
  const page = await queryPageBySlug({ slug: decodedSlug, locale: localeParam })
  return generateMeta({ doc: page })
}

const queryPageBySlug = cache(async ({ slug, locale }: { slug: string; locale: Locale }) => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'pages',
    locale,
    draft,
    limit: 1,
    pagination: false,
    overrideAccess: draft,
    where: { slug: { equals: slug } },
  })

  return result.docs?.[0] || null
})
