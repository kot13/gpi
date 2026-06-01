import type { PropertyFilterParams, PropertyListItem, PropertySort } from './types'

const DEFAULT_SORT: PropertySort = 'updatedAt-desc'

export function searchParamsToFilterRecord(
  searchParams: URLSearchParams | { forEach: (cb: (value: string, key: string) => void) => void; getAll?: (key: string) => string[] },
): Record<string, string | string[] | undefined> {
  const record: Record<string, string | string[]> = {}
  const keys = new Set<string>()
  searchParams.forEach((_, key) => keys.add(key))
  for (const key of keys) {
    const values =
      'getAll' in searchParams && typeof searchParams.getAll === 'function'
        ? searchParams.getAll(key)
        : []
    if (values.length > 1) {
      record[key] = values
    } else if (values.length === 1) {
      record[key] = values[0]!
    }
  }
  return record
}

function getMany(
  searchParams: Record<string, string | string[] | undefined>,
  key: string,
): string[] {
  const v = searchParams[key]
  if (v === undefined || v === '') return []
  if (Array.isArray(v)) return v.filter(Boolean)
  return v.split(',').map((s) => s.trim()).filter(Boolean)
}

export function parsePropertyFilterParams(
  searchParams: Record<string, string | string[] | undefined>,
): PropertyFilterParams {
  const get = (key: string) => {
    const v = searchParams[key]
    return Array.isArray(v) ? v[0] : v
  }

  const featuresRaw = get('features')
  const features = featuresRaw
    ? featuresRaw.split(',').filter(Boolean)
    : undefined

  const num = (key: string) => {
    const v = get(key)
    if (v === undefined || v === '') return undefined
    const n = Number(v)
    return Number.isFinite(n) ? n : undefined
  }

  const cities = getMany(searchParams, 'city') as PropertyFilterParams['city']
  const layouts = getMany(searchParams, 'layout') as PropertyFilterParams['layout']
  const conditions = getMany(searchParams, 'condition') as PropertyFilterParams['condition']
  const repairs = getMany(searchParams, 'repair') as PropertyFilterParams['repair']
  const heatings = getMany(searchParams, 'heating') as PropertyFilterParams['heating']
  const readinesses = getMany(searchParams, 'readiness') as PropertyFilterParams['readiness']

  return {
    city: cities?.length ? cities : undefined,
    district: get('district') || undefined,
    minUsd: num('minUsd'),
    maxUsd: num('maxUsd'),
    minGel: num('minGel'),
    maxGel: num('maxGel'),
    rooms: num('rooms'),
    layout: layouts?.length ? layouts : undefined,
    condition: conditions?.length ? conditions : undefined,
    repair: repairs?.length ? repairs : undefined,
    heating: heatings?.length ? heatings : undefined,
    readiness: readinesses?.length ? readinesses : undefined,
    features: features as PropertyFilterParams['features'],
    sort: (get('sort') as PropertySort) || DEFAULT_SORT,
  }
}

export function filterProperties(
  items: PropertyListItem[],
  params: PropertyFilterParams,
): PropertyListItem[] {
  return items.filter((item) => {
    if (params.city?.length && !params.city.includes(item.city)) return false
    if (params.district) {
      const d = item.district?.toLowerCase() ?? ''
      if (!d.includes(params.district.toLowerCase())) return false
    }
    if (params.minUsd !== undefined && item.priceUsd < params.minUsd) return false
    if (params.maxUsd !== undefined && item.priceUsd > params.maxUsd) return false
    if (params.minGel !== undefined && item.priceGel < params.minGel) return false
    if (params.maxGel !== undefined && item.priceGel > params.maxGel) return false
    if (params.rooms !== undefined && item.rooms !== params.rooms) return false
    if (params.layout?.length && (!item.layout || !params.layout.includes(item.layout))) return false
    if (params.condition?.length && (!item.condition || !params.condition.includes(item.condition)))
      return false
    if (params.repair?.length && (!item.repair || !params.repair.includes(item.repair))) return false
    if (params.heating?.length && (!item.heating || !params.heating.includes(item.heating)))
      return false
    if (params.readiness?.length && (!item.readiness || !params.readiness.includes(item.readiness)))
      return false
    if (params.features?.length) {
      const itemFeatures = item.features ?? []
      if (!params.features.every((f) => itemFeatures.includes(f))) return false
    }
    return true
  })
}

export function sortProperties(
  items: PropertyListItem[],
  sort: PropertySort = DEFAULT_SORT,
): PropertyListItem[] {
  const copy = [...items]
  switch (sort) {
    case 'priceUsd-asc':
      return copy.sort((a, b) => a.priceUsd - b.priceUsd)
    case 'priceUsd-desc':
      return copy.sort((a, b) => b.priceUsd - a.priceUsd)
    case 'updatedAt-desc':
    default:
      return copy.sort((a, b) => {
        const da = a.listingDate ? new Date(a.listingDate).getTime() : 0
        const db = b.listingDate ? new Date(b.listingDate).getTime() : 0
        return db - da
      })
  }
}

export const CATALOG_PAGE_SIZE = 24

export function paginateProperties<T>(items: T[], page: number, pageSize = CATALOG_PAGE_SIZE): T[] {
  const start = (page - 1) * pageSize
  return items.slice(start, start + pageSize)
}
