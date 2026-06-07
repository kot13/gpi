import type { Metadata } from 'next'
import { Suspense } from 'react'
import { notFound } from 'next/navigation'

import type { Locale } from '@/lib/i18n/config'
import { isValidLocale } from '@/lib/i18n/config'
import { getMessages } from '@/lib/i18n/getMessages'
import { getActiveProperties } from '@/lib/payload/queries/properties'
import { generatePropertyMapMeta } from '@/utilities/generatePropertyMeta'

import PropertiesMapPageClient from './page.client'

export const dynamic = 'force-static'
export const revalidate = 600

type Args = { params: Promise<{ locale: string }> }

export default async function PropertiesMapPage({ params: paramsPromise }: Args) {
  const { locale: localeParam } = await paramsPromise
  if (!isValidLocale(localeParam)) notFound()
  const locale = localeParam as Locale

  const properties = await getActiveProperties(locale)

  const districts = Array.from(
    new Set(properties.map((p) => p.district).filter((d): d is string => Boolean(d))),
  )

  return (
    <Suspense
      fallback={
        <div className="flex h-[calc(100dvh-var(--header-height))] items-center justify-center text-gpi-muted">
          {getMessages(locale).properties?.map?.loading ?? '…'}
        </div>
      }
    >
      <PropertiesMapPageClient properties={properties} locale={locale} districts={districts} />
    </Suspense>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { locale: localeParam } = await paramsPromise
  if (!isValidLocale(localeParam)) return {}

  const t = getMessages(localeParam)
  const mapT = t.properties?.map
  const base = generatePropertyMapMeta(localeParam)

  return {
    ...base,
    title: `${mapT?.metaTitle ?? 'Property map'} | GPI`,
    description: mapT?.metaDescription ?? base.description ?? undefined,
    openGraph: {
      ...base.openGraph,
      title: mapT?.metaTitle ?? base.openGraph?.title,
      description: mapT?.metaDescription ?? base.openGraph?.description,
    },
  }
}
