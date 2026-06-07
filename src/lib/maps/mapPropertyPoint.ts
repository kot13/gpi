import { cityLabel } from '@/lib/properties/labels'
import { getFirstPropertyImage } from '@/lib/properties/media'
import type { PropertyListItem } from '@/lib/properties/types'
import type { Locale } from '@/lib/i18n/config'
import type { Media } from '@/payload-types'

import { hasValidCoordinatePair } from './validateCoordinates'

export type MapPropertyPoint = {
  objectCode: string
  lat: number
  lng: number
  title: string
  cityLabel: string
  district?: string
  priceUsd: number
  priceGel: number
  photo: Media | null
  detailHref: string
}

export function toMapPropertyPoint(
  property: PropertyListItem,
  locale: Locale,
): MapPropertyPoint | null {
  if (!hasValidCoordinatePair(property.lat, property.lng)) {
    return null
  }

  const lat = property.lat as number
  const lng = property.lng as number
  const image = getFirstPropertyImage(property.photos)

  return {
    objectCode: property.objectCode,
    lat,
    lng,
    title: property.title,
    cityLabel: cityLabel(locale, property.city),
    district: property.district ?? undefined,
    priceUsd: property.priceUsd,
    priceGel: property.priceGel,
    photo: image,
    detailHref: `/${locale}/properties/${encodeURIComponent(property.objectCode)}`,
  }
}

export function toMapPropertyPoints(
  properties: PropertyListItem[],
  locale: Locale,
): MapPropertyPoint[] {
  return properties
    .map((property) => toMapPropertyPoint(property, locale))
    .filter((point): point is MapPropertyPoint => point !== null)
}
