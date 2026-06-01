import { describe, expect, it } from 'vitest'

import { filterProperties } from '@/lib/properties/filters'
import type { PropertyListItem } from '@/lib/properties/types'

describe('properties catalog filtering', () => {
  const items: PropertyListItem[] = [
    {
      id: 1,
      objectCode: '1037',
      title: 'A',
      city: 'Batumi',
      priceUsd: 73000,
      priceGel: 197100,
      area: 41,
      rooms: 1,
      listingStatus: 'active',
      listingDate: '2026-04-30',
    },
    {
      id: 2,
      objectCode: '2000',
      title: 'B',
      city: 'Tbilisi',
      priceUsd: 150000,
      priceGel: 400000,
      area: 60,
      rooms: 2,
      listingStatus: 'active',
      listingDate: '2026-03-01',
    },
  ]

  it('filters catalog items by city', () => {
    const filtered = filterProperties(items, { city: 'Batumi' })
    expect(filtered).toHaveLength(1)
    expect(filtered[0]?.objectCode).toBe('1037')
  })
})
