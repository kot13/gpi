import { describe, expect, it } from 'vitest'

import { filterProperties, sortProperties } from '@/lib/properties/filters'
import type { PropertyListItem } from '@/lib/properties/types'

const sample: PropertyListItem[] = [
  {
    id: 1,
    objectCode: 'a',
    title: 'A',
    city: 'Batumi',
    district: 'Center',
    priceUsd: 100000,
    priceGel: 270000,
    area: 40,
    rooms: 1,
    listingDate: '2026-01-01',
  },
  {
    id: 2,
    objectCode: 'b',
    title: 'B',
    city: 'Tbilisi',
    district: 'Vake',
    priceUsd: 200000,
    priceGel: 540000,
    area: 60,
    rooms: 2,
    listingDate: '2026-06-01',
  },
]

describe('filterProperties', () => {
  it('filters by single city', () => {
    const result = filterProperties(sample, { city: ['Batumi'] })
    expect(result).toHaveLength(1)
    expect(result[0]?.objectCode).toBe('a')
  })

  it('filters by multiple cities (OR)', () => {
    const result = filterProperties(sample, { city: ['Batumi', 'Tbilisi'] })
    expect(result).toHaveLength(2)
  })

  it('filters by repair and heating', () => {
    const withExtras: PropertyListItem[] = [
      { ...sample[0]!, repair: 'renovated', heating: 'gas' },
      { ...sample[1]!, repair: 'white_frame', heating: 'electric' },
    ]
    expect(filterProperties(withExtras, { repair: ['renovated'] })).toHaveLength(1)
    expect(filterProperties(withExtras, { heating: ['gas', 'electric'] })).toHaveLength(2)
  })

  it('filters by price range', () => {
    const result = filterProperties(sample, { minUsd: 150000 })
    expect(result).toHaveLength(1)
    expect(result[0]?.objectCode).toBe('b')
  })
})

describe('sortProperties', () => {
  it('sorts by price ascending', () => {
    const result = sortProperties(sample, 'priceUsd-asc')
    expect(result.map((p) => p.objectCode)).toEqual(['a', 'b'])
  })

  it('sorts by updatedAt desc by default', () => {
    const result = sortProperties(sample, 'updatedAt-desc')
    expect(result[0]?.objectCode).toBe('b')
  })
})
