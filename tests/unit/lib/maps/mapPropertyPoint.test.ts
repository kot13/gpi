import { describe, expect, it } from 'vitest'

import { toMapPropertyPoint, toMapPropertyPoints } from '@/lib/maps/mapPropertyPoint'
import type { PropertyListItem } from '@/lib/properties/types'

const baseProperty: PropertyListItem = {
  id: 1,
  objectCode: '1037',
  title: 'Test',
  city: 'Batumi',
  district: 'Center',
  lat: 41.646,
  lng: 41.64,
  priceUsd: 100000,
  priceGel: 270000,
  area: 50,
  rooms: 2,
  photos: null,
}

describe('mapPropertyPoint', () => {
  it('toMapPropertyPoint returns point for valid coordinates', () => {
    const point = toMapPropertyPoint(baseProperty, 'ru')
    expect(point?.objectCode).toBe('1037')
    expect(point?.lat).toBe(41.646)
    expect(point?.detailHref).toBe('/ru/properties/1037')
  })

  it('toMapPropertyPoint returns null for missing coordinates', () => {
    expect(toMapPropertyPoint({ ...baseProperty, lat: null, lng: null }, 'ru')).toBeNull()
  })

  it('toMapPropertyPoint returns null for invalid coordinates', () => {
    expect(toMapPropertyPoint({ ...baseProperty, lat: 999, lng: 41.64 }, 'ru')).toBeNull()
  })

  it('toMapPropertyPoints filters invalid entries', () => {
    const points = toMapPropertyPoints(
      [baseProperty, { ...baseProperty, objectCode: 'bad', lat: null, lng: null }],
      'en',
    )
    expect(points).toHaveLength(1)
    expect(points[0]?.detailHref).toBe('/en/properties/1037')
  })
})
