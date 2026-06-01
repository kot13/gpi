import { describe, expect, it } from 'vitest'

import {
  PROPERTY_CATALOG_SEEDS,
  parseFeaturesCsv,
  parseListingDateDdMmYyyy,
} from '@/endpoints/seed/propertyCatalog'

describe('propertyCatalog seed', () => {
  it('parses listing dates from DD.MM.YYYY', () => {
    expect(parseListingDateDdMmYyyy('30.04.2026')).toBe('2026-04-30T12:00:00.000Z')
    expect(parseListingDateDdMmYyyy('29.09.2025')).toBe('2025-09-29T12:00:00.000Z')
  })

  it('parses features and includes pool', () => {
    expect(parseFeaturesCsv('pool,central_heating,renovated')).toEqual([
      'pool',
      'central_heating',
      'renovated',
    ])
  })

  it('seeds seven active Batumi properties', () => {
    expect(PROPERTY_CATALOG_SEEDS).toHaveLength(7)
    expect(PROPERTY_CATALOG_SEEDS.every((p) => p.listingStatus === 'active')).toBe(true)
    expect(PROPERTY_CATALOG_SEEDS.map((p) => p.objectCode)).toEqual([
      '1037',
      '1039',
      '994',
      '450',
      '901',
      '902',
      '814',
    ])
  })
})
