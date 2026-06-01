import type { Metadata } from 'next'
import { Suspense } from 'react'

import { RenderHero } from '@/heros/RenderHero'
import type { Locale } from '@/lib/i18n/config'
import { isValidLocale } from '@/lib/i18n/config'
import { getMessages } from '@/lib/i18n/getMessages'
import { getActiveProperties } from '@/lib/payload/queries/properties'
import { getPageBySlug } from '@/lib/payload/queries/pages'
import {
  catalogCollectionPageJsonLd,
  catalogItemListJsonLd,
} from '@/lib/seo/propertyJsonLd'
import { generatePropertyCatalogMeta } from '@/utilities/generatePropertyMeta'
import { notFound } from 'next/navigation'

import PropertiesCatalogClient from './page.client'

export const dynamic = 'force-static'
export const revalidate = 600

type Args = { params: Promise<{ locale: string }> }

export default async function PropertiesCatalogPage({ params: paramsPromise }: Args) {
  const { locale: localeParam } = await paramsPromise
  if (!isValidLocale(localeParam)) notFound()
  const locale = localeParam as Locale

  const [page, properties] = await Promise.all([
    getPageBySlug('properties', locale),
    getActiveProperties(locale),
  ])

  const t = getMessages(locale)
  const catalogTitle = page?.title ?? t.properties?.catalogTitle ?? 'Catalog'

  const districts = Array.from(
    new Set(properties.map((p) => p.district).filter((d): d is string => Boolean(d))),
  )

  const jsonLdScripts = [
    catalogCollectionPageJsonLd(catalogTitle, locale),
    catalogItemListJsonLd(properties, locale),
  ]

  return (
    <article>
      {jsonLdScripts.map((data, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
      ))}
      {page?.hero && <RenderHero {...page.hero} locale={locale} />}
      <div className="container pt-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gpi-text font-gpi-heading mb-6">
          {catalogTitle}
        </h1>
      </div>
      <Suspense fallback={<div className="container py-8 text-gpi-muted">…</div>}>
        <PropertiesCatalogClient properties={properties} locale={locale} districts={districts} />
      </Suspense>
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { locale: localeParam } = await paramsPromise
  if (!isValidLocale(localeParam)) return {}
  const page = await getPageBySlug('properties', localeParam)
  return generatePropertyCatalogMeta(localeParam, page?.title ?? undefined)
}
