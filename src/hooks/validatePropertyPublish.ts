import type { CollectionBeforeChangeHook } from 'payload'

import type { Locale } from '@/lib/i18n/config'
import type { Media } from '@/payload-types'

const LOCALES: Locale[] = ['ru', 'ka', 'en']

const GEORGIA_LAT_MIN = 41
const GEORGIA_LAT_MAX = 43.5
const GEORGIA_LNG_MIN = 39.5
const GEORGIA_LNG_MAX = 46.5

export type PropertyPublishFields = {
  objectCode?: string
  listingStatus?: 'draft' | 'active' | 'inactive'
  city?: string
  priceUsd?: number
  priceGel?: number
  area?: number
  rooms?: number
  title?: string
  description?: string
  lat?: number | null
  lng?: number | null
  photos?: Array<{ image?: Media | string | number | null }> | null
  _status?: 'draft' | 'published'
}

export function isGeorgiaCoordinates(lat?: number | null, lng?: number | null): boolean {
  if (lat == null && lng == null) return true
  if (lat == null || lng == null) return false
  return (
    lat >= GEORGIA_LAT_MIN &&
    lat <= GEORGIA_LAT_MAX &&
    lng >= GEORGIA_LNG_MIN &&
    lng <= GEORGIA_LNG_MAX
  )
}

export function validatePropertyFieldsForPublish(
  doc: PropertyPublishFields,
  locale: string,
): void {
  const missing: string[] = []

  if (!doc.objectCode?.trim()) missing.push('objectCode')
  if (!doc.city) missing.push('city')
  if (doc.priceUsd == null || doc.priceUsd <= 0) missing.push('priceUsd')
  if (doc.priceGel == null || doc.priceGel <= 0) missing.push('priceGel')
  if (doc.area == null || doc.area <= 0) missing.push('area')
  if (doc.rooms == null || doc.rooms < 0) missing.push('rooms')
  if (!doc.title?.trim()) missing.push('title')
  if (!doc.description?.trim()) missing.push('description')

  if (doc.listingStatus === 'active' && !isGeorgiaCoordinates(doc.lat, doc.lng)) {
    throw new Error(
      `Cannot publish: invalid coordinates for locale "${locale}". Provide both lat and lng within Georgia or leave both empty.`,
    )
  }

  if (missing.length) {
    throw new Error(
      `Cannot publish: missing required fields for locale "${locale}": ${missing.join(', ')}`,
    )
  }

  if (doc.photos?.length) {
    for (let i = 0; i < doc.photos.length; i++) {
      const photo = doc.photos[i]
      const image = photo?.image
      if (typeof image === 'object' && image !== null && 'alt' in image) {
        if (!image.alt?.trim()) {
          throw new Error(
            `Cannot publish: photo ${i + 1} is missing alt text in media library (accessibility / SEO).`,
          )
        }
      }
    }
  }
}

export function validatePropertyShouldPublish(doc: PropertyPublishFields): boolean {
  return doc._status === 'published' && doc.listingStatus === 'active'
}

export const validatePropertyPublish: CollectionBeforeChangeHook = async ({
  data,
  req,
  operation,
  originalDoc,
  context,
}) => {
  const doc = data as PropertyPublishFields
  const locale = req.locale || 'ru'

  if (operation === 'create' || operation === 'update') {
    if (validatePropertyShouldPublish(doc)) {
      validatePropertyFieldsForPublish(doc, locale)
    }
  }

  if (doc.objectCode && operation === 'create') {
    const existing = await req.payload.find({
      collection: 'properties',
      where: { objectCode: { equals: doc.objectCode } },
      limit: 1,
      depth: 0,
    })
    if (existing.docs.length > 0) {
      throw new Error(`Объект с кодом "${doc.objectCode}" уже существует.`)
    }
  }

  if (doc.objectCode && operation === 'update' && originalDoc?.id) {
    const existing = await req.payload.find({
      collection: 'properties',
      where: {
        and: [
          { objectCode: { equals: doc.objectCode } },
          { id: { not_equals: originalDoc.id } },
        ],
      },
      limit: 1,
      depth: 0,
    })
    if (existing.docs.length > 0) {
      throw new Error(`Объект с кодом "${doc.objectCode}" уже существует.`)
    }
  }

  return data
}

export async function validateAllPropertyLocalesBeforePublish(
  payload: { findByID: (args: { collection: 'properties'; id: string | number; locale: Locale }) => Promise<PropertyPublishFields> },
  id: string | number,
): Promise<void> {
  for (const loc of LOCALES) {
    const localized = await payload.findByID({
      collection: 'properties',
      id,
      locale: loc,
    })
    if (validatePropertyShouldPublish(localized)) {
      validatePropertyFieldsForPublish(localized, loc)
    }
  }
}
