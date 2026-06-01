import type { Metadata } from 'next'

import type { Locale } from '@/lib/i18n/config'
import { LOCALES } from '@/lib/i18n/config'
import { getFirstPropertyImage } from '@/lib/properties/media'
import type { PropertyListItem } from '@/lib/properties/types'
import { mergeOpenGraph } from './mergeOpenGraph'
import { getServerSideURL } from './getURL'

function getImageURL(property: PropertyListItem | null): string | undefined {
  const serverUrl = getServerSideURL()
  const image = property ? getFirstPropertyImage(property.photos) : null
  if (image?.url) {
    const og = image.sizes?.og?.url
    return og ? `${serverUrl}${og}` : `${serverUrl}${image.url}`
  }
  return `${serverUrl}/website-template-OG.webp`
}

export function generatePropertyDetailMeta(
  property: PropertyListItem | null,
  locale: Locale,
): Metadata {
  const baseUrl = getServerSideURL()
  const path = property
    ? `/${locale}/properties/${encodeURIComponent(property.objectCode)}`
    : `/${locale}/properties`
  const title = property?.meta?.title || property?.title || 'GPI Property'
  const description =
    property?.meta?.description || property?.description || 'GPI real estate catalog'

  const languages: Record<string, string> = {}
  if (property?.objectCode) {
    for (const loc of LOCALES) {
      languages[loc] = `${baseUrl}/${loc}/properties/${encodeURIComponent(property.objectCode)}`
    }
  }

  return {
    title: `${title} | GPI`,
    description,
    alternates: {
      canonical: `${baseUrl}${path}`,
      languages,
    },
    openGraph: mergeOpenGraph({
      title,
      description,
      url: `${baseUrl}${path}`,
      images: [{ url: getImageURL(property) ?? `${baseUrl}/website-template-OG.webp` }],
    }),
  }
}

export function generatePropertyCatalogMeta(locale: Locale, pageTitle?: string): Metadata {
  const baseUrl = getServerSideURL()
  const title = pageTitle || 'Property catalog'
  const path = `/${locale}/properties`

  const languages: Record<string, string> = {}
  for (const loc of LOCALES) {
    languages[loc] = `${baseUrl}/${loc}/properties`
  }

  return {
    title: `${title} | GPI`,
    alternates: {
      canonical: `${baseUrl}${path}`,
      languages,
    },
    openGraph: mergeOpenGraph({
      title,
      url: `${baseUrl}${path}`,
    }),
  }
}
