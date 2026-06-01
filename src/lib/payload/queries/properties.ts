import { draftMode } from 'next/headers'
import { cache } from 'react'

import type { Locale } from '@/lib/i18n/config'
import { LOCALES } from '@/lib/i18n/config'
import type { Where } from 'payload'

import { getPayload } from '@/lib/payload/getPayload'

const propertySelect = {
  objectCode: true,
  title: true,
  description: true,
  city: true,
  district: true,
  street: true,
  lat: true,
  lng: true,
  priceUsd: true,
  priceGel: true,
  area: true,
  rooms: true,
  floor: true,
  totalFloors: true,
  condition: true,
  repair: true,
  layout: true,
  heating: true,
  readiness: true,
  buildingType: true,
  features: true,
  photos: true,
  crmUrl: true,
  telegramUrl: true,
  driveFolderUrl: true,
  listingDate: true,
  listingStatus: true,
  meta: true,
} as const

const publicWhere: Where = {
  and: [
    { _status: { equals: 'published' } },
    { listingStatus: { equals: 'active' } },
  ],
}

export const getActiveProperties = cache(async (locale: Locale) => {
  const payload = await getPayload()
  const result = await payload.find({
    collection: 'properties',
    locale,
    depth: 2,
    limit: 500,
    pagination: false,
    overrideAccess: false,
    draft: false,
    where: publicWhere,
    select: propertySelect,
    sort: '-listingDate',
  })

  return result.docs ?? []
})

export const getPropertyByCode = cache(async (objectCode: string, locale: Locale) => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload()

  const result = await payload.find({
    collection: 'properties',
    locale,
    draft,
    depth: 2,
    limit: 1,
    pagination: false,
    overrideAccess: draft,
    where: draft
      ? { objectCode: { equals: objectCode } }
      : {
          and: [
            { objectCode: { equals: objectCode } },
            { _status: { equals: 'published' } },
            { listingStatus: { equals: 'active' } },
          ],
        },
    select: propertySelect,
  })

  return result.docs?.[0] ?? null
})

export async function getPropertyStaticParams(): Promise<Array<{ objectCode: string }>> {
  const payload = await getPayload()
  const codes = new Set<string>()

  const result = await payload.find({
    collection: 'properties',
    draft: false,
    depth: 0,
    limit: 1000,
    pagination: false,
    overrideAccess: false,
    where: publicWhere,
    select: { objectCode: true },
  })

  result.docs?.forEach((doc) => {
    if (doc.objectCode) codes.add(doc.objectCode)
  })

  return Array.from(codes).map((objectCode) => ({ objectCode }))
}

export async function getAllPropertyPaths(): Promise<
  Array<{ locale: Locale; objectCode: string }>
> {
  const params: Array<{ locale: Locale; objectCode: string }> = []
  const staticCodes = await getPropertyStaticParams()

  for (const locale of LOCALES) {
    for (const { objectCode } of staticCodes) {
      params.push({ locale, objectCode })
    }
  }

  return params
}
