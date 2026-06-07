import { describe, expect, it } from 'vitest'

import { buildPropertyFilterQuery } from '@/lib/properties/filterQuery'
import {
  parsePropertyFilterParams,
  searchParamsToFilterRecord,
} from '@/lib/properties/filters'

const cases: Array<Record<string, string | string[]>> = [
  { city: 'Tbilisi' },
  { city: ['Tbilisi', 'Batumi'] },
  { district: 'Vake' },
  { minUsd: '50000', maxUsd: '200000' },
  { minGel: '100000', maxGel: '500000' },
  { rooms: '3' },
  { layout: '2+1' },
  { condition: 'new' },
  { repair: 'renovated' },
  { heating: 'gas' },
  { readiness: 'ready' },
  { features: 'sea_view,balcony' },
  { sort: 'priceUsd-asc' },
  { city: 'Batumi', minUsd: '80000', rooms: '2', sort: 'priceUsd-desc' },
  {
    city: ['Tbilisi'],
    layout: ['studio', '1+1'],
    condition: ['good', 'premium'],
    minUsd: '100000',
  },
  { district: 'Old Town', maxUsd: '150000', heating: 'electric' },
]

describe('filterCatalogMapParity', () => {
  it.each(cases)('round-trips search params %#', (input) => {
    const sp = new URLSearchParams()
    for (const [key, value] of Object.entries(input)) {
      if (Array.isArray(value)) {
        for (const v of value) sp.append(key, v)
      } else {
        sp.set(key, value)
      }
    }

    const record = searchParamsToFilterRecord(sp)
    const parsed = parsePropertyFilterParams(record)
    const built = buildPropertyFilterQuery(parsed)
    const roundTrip = parsePropertyFilterParams(searchParamsToFilterRecord(new URLSearchParams(built)))

    expect(roundTrip.city).toEqual(parsed.city)
    expect(roundTrip.district).toEqual(parsed.district)
    expect(roundTrip.minUsd).toEqual(parsed.minUsd)
    expect(roundTrip.maxUsd).toEqual(parsed.maxUsd)
    expect(roundTrip.minGel).toEqual(parsed.minGel)
    expect(roundTrip.maxGel).toEqual(parsed.maxGel)
    expect(roundTrip.rooms).toEqual(parsed.rooms)
    expect(roundTrip.layout).toEqual(parsed.layout)
    expect(roundTrip.condition).toEqual(parsed.condition)
    expect(roundTrip.repair).toEqual(parsed.repair)
    expect(roundTrip.heating).toEqual(parsed.heating)
    expect(roundTrip.readiness).toEqual(parsed.readiness)
    expect(roundTrip.features).toEqual(parsed.features)
    expect(roundTrip.sort).toEqual(parsed.sort)
  })
})
