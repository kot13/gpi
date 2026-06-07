import { describe, expect, it } from 'vitest'

import {
  filterMapPointsInBounds,
  fitBoundsForProperties,
  getBoundsFromPoints,
  isInBounds,
  singlePropertyZoom,
} from '@/lib/maps/bounds'
import type { MapPropertyPoint } from '@/lib/maps/mapPropertyPoint'

const sampleBounds = {
  north: 42,
  south: 41,
  east: 45,
  west: 44,
}

const pointIn: MapPropertyPoint = {
  objectCode: 'a',
  lat: 41.5,
  lng: 44.5,
  title: 'A',
  cityLabel: 'Tbilisi',
  priceUsd: 1,
  priceGel: 1,
  photo: null,
  detailHref: '/ru/properties/a',
}

const pointOut: MapPropertyPoint = {
  ...pointIn,
  objectCode: 'b',
  lat: 43,
  lng: 46,
}

describe('bounds', () => {
  it('isInBounds returns true for point inside', () => {
    expect(isInBounds(41.5, 44.5, sampleBounds)).toBe(true)
  })

  it('isInBounds returns false for point outside', () => {
    expect(isInBounds(43, 46, sampleBounds)).toBe(false)
  })

  it('filterMapPointsInBounds filters by viewport', () => {
    const result = filterMapPointsInBounds([pointIn, pointOut], sampleBounds)
    expect(result).toHaveLength(1)
    expect(result[0]?.objectCode).toBe('a')
  })

  it('filterMapPointsInBounds returns all when bounds null', () => {
    expect(filterMapPointsInBounds([pointIn, pointOut], null)).toHaveLength(2)
  })

  it('filterMapPointsInBounds returns empty for empty input', () => {
    expect(filterMapPointsInBounds([], sampleBounds)).toEqual([])
  })

  it('getBoundsFromPoints returns null for empty array', () => {
    expect(getBoundsFromPoints([])).toBeNull()
  })

  it('getBoundsFromPoints computes envelope', () => {
    expect(getBoundsFromPoints([pointIn, pointOut])).toEqual({
      north: 43,
      south: 41.5,
      east: 46,
      west: 44.5,
    })
  })

  it('singlePropertyZoom returns configured zoom', () => {
    expect(singlePropertyZoom()).toBe(14)
  })

  it('fitBoundsForProperties setView for single point', () => {
    const calls: unknown[] = []
    const map = {
      fitBounds: (...args: unknown[]) => calls.push(['fitBounds', ...args]),
      setView: (...args: unknown[]) => calls.push(['setView', ...args]),
    }
    fitBoundsForProperties(map, [{ lat: 41.7, lng: 44.8 }])
    expect(calls[0]).toEqual(['setView', [41.7, 44.8], 14])
  })

  it('fitBoundsForProperties fitBounds for multiple points', () => {
    const calls: unknown[] = []
    const map = {
      fitBounds: (...args: unknown[]) => calls.push(['fitBounds', ...args]),
      setView: (...args: unknown[]) => calls.push(['setView', ...args]),
    }
    fitBoundsForProperties(map, [
      { lat: 41, lng: 44 },
      { lat: 42, lng: 45 },
    ])
    expect(calls[0]?.[0]).toBe('fitBounds')
  })
})
