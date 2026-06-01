import type { Payload, PayloadRequest } from 'payload'
import type { RequiredDataFromCollectionSlug } from 'payload'

import type { Media } from '@/payload-types'

import type { PropertyCatalogSeed } from './propertyCatalog'
import { PROPERTY_CATALOG_SEEDS } from './propertyCatalog'

export { PROPERTY_CATALOG_SEEDS } from './propertyCatalog'

const titles1037 = {
  ru: 'Sunset · Новый бульвар',
  ka: 'Sunset · ახალი ბულვარი',
  en: 'Sunset · New Boulevard',
}

const descriptions1037 = {
  ru: 'Просторная квартира с дизайнерским ремонтом. Продуманная планировка, много света.',
  ka: 'ფართო ბინა დიზაინერული რემონტით.',
  en: 'Spacious apartment with designer renovation. Thoughtful layout and plenty of light.',
}

export const property1037Localized = {
  ka: { title: titles1037.ka, description: descriptions1037.ka },
  en: { title: titles1037.en, description: descriptions1037.en },
}

const PHOTOS_PER_PROPERTY = 6

/** Reuse template media IDs (avoids dozens of Drive uploads and drizzle insert issues during seed). */
export function mapPropertyPhotosFromFallback(
  photoUrls: string[],
  fallback: Media[],
): Array<{ image: number | string }> {
  if (!fallback.length) return []

  const count = Math.min(photoUrls.length || PHOTOS_PER_PROPERTY, PHOTOS_PER_PROPERTY)
  return Array.from({ length: count }, (_, index) => ({
    image: fallback[index % fallback.length]!.id,
  }))
}

export function buildPropertySeed(
  record: PropertyCatalogSeed,
  photoDocs: Media[],
): RequiredDataFromCollectionSlug<'properties'> {
  const photos = mapPropertyPhotosFromFallback(record.photoUrls, photoDocs).map(({ image }) => ({
    image,
  }))

  return {
    objectCode: record.objectCode,
    listingStatus: record.listingStatus,
    _status: 'published',
    city: record.city,
    district: record.district,
    street: record.street,
    lat: record.lat,
    lng: record.lng,
    priceUsd: record.priceUsd,
    priceGel: record.priceGel,
    area: record.area,
    rooms: record.rooms,
    floor: record.floor,
    totalFloors: record.totalFloors,
    condition: record.condition,
    repair: record.repair,
    layout: record.layout,
    heating: record.heating,
    readiness: record.readiness,
    buildingType: record.buildingType,
    features: record.features,
    title: record.title,
    description: record.description,
    ...(record.crmUrl ? { crmUrl: record.crmUrl } : {}),
    telegramUrl: record.telegramUrl,
    driveFolderUrl: record.driveFolderUrl,
    photos,
    listingDate: record.listingDate,
  }
}

export async function seedPropertiesCatalog(
  payload: Payload,
  req: PayloadRequest,
  fallbackMedia: Media[],
): Promise<void> {
  if (!fallbackMedia.length) {
    throw new Error('Property seed requires at least one template media document.')
  }

  payload.logger.info(
    `— Creating ${PROPERTY_CATALOG_SEEDS.length} properties (gallery uses template media; run db:push if schema changed)`,
  )

  for (const record of PROPERTY_CATALOG_SEEDS) {
    const propertyDoc = await payload.create({
      collection: 'properties',
      locale: 'ru',
      depth: 0,
      context: { disableRevalidate: true },
      data: buildPropertySeed(record, fallbackMedia),
      req,
    })

    const localized =
      record.objectCode === '1037'
        ? property1037Localized
        : {
            ka: { title: record.title, description: record.description },
            en: { title: record.title, description: record.description },
          }

    for (const loc of ['ka', 'en'] as const) {
      await payload.update({
        collection: 'properties',
        id: propertyDoc.id,
        locale: loc,
        data: localized[loc],
        context: { disableRevalidate: true },
        req,
      })
    }
  }
}
