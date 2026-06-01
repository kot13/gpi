import type { Locale } from '@/lib/i18n/config'
import type { PropertyListItem } from '@/lib/properties/types'
import { getServerSideURL } from '@/utilities/getURL'

import { getFirstPropertyImage } from '@/lib/properties/media'
import { getMediaUrl } from '@/utilities/getMediaUrl'

export function productOfferJsonLd(
  property: PropertyListItem,
  locale: Locale,
): Record<string, unknown> {
  const baseUrl = getServerSideURL()
  const url = `${baseUrl}/${locale}/properties/${encodeURIComponent(property.objectCode)}`
  const image = getFirstPropertyImage(property.photos)
  const imageUrl = image?.url ? getMediaUrl(image.url) : undefined

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: property.title,
    description: property.description || undefined,
    image: imageUrl,
    url,
    offers: [
      {
        '@type': 'Offer',
        priceCurrency: 'USD',
        price: property.priceUsd,
        availability: 'https://schema.org/InStock',
        url,
      },
      {
        '@type': 'Offer',
        priceCurrency: 'GEL',
        price: property.priceGel,
        availability: 'https://schema.org/InStock',
        url,
      },
    ],
    ...(property.lat != null && property.lng != null
      ? {
          geo: {
            '@type': 'GeoCoordinates',
            latitude: property.lat,
            longitude: property.lng,
          },
        }
      : {}),
  }
}

export function catalogItemListJsonLd(
  properties: PropertyListItem[],
  locale: Locale,
): Record<string, unknown> {
  const baseUrl = getServerSideURL()

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: properties.map((property, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `${baseUrl}/${locale}/properties/${encodeURIComponent(property.objectCode)}`,
      name: property.title,
    })),
  }
}

export function catalogCollectionPageJsonLd(
  title: string,
  locale: Locale,
): Record<string, unknown> {
  const baseUrl = getServerSideURL()
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: title,
    url: `${baseUrl}/${locale}/properties`,
    inLanguage: locale,
  }
}
