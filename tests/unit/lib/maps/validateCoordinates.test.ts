import { describe, expect, it } from 'vitest'

import {
  hasValidCoordinatePair,
  isValidLatitude,
  isValidLongitude,
  isValidZoom,
  validateCoordinates,
} from '@/lib/maps/validateCoordinates'

describe('validateCoordinates', () => {
  it('accepts valid Georgia office coordinates', () => {
    expect(validateCoordinates(41.646, 41.64)).toEqual({ ok: true })
    expect(hasValidCoordinatePair(41.646, 41.64)).toBe(true)
  })

  it('rejects missing coordinates', () => {
    expect(validateCoordinates(null, 41.64)).toEqual({ ok: false, error: 'missing' })
    expect(hasValidCoordinatePair(undefined, 41.64)).toBe(false)
  })

  it('rejects out-of-range latitude', () => {
    expect(validateCoordinates(91, 41.64)).toEqual({ ok: false, error: 'invalid_lat' })
    expect(isValidLatitude(91)).toBe(false)
  })

  it('rejects out-of-range longitude', () => {
    expect(validateCoordinates(41.6, 181)).toEqual({ ok: false, error: 'invalid_lng' })
    expect(isValidLongitude(-181)).toBe(false)
  })

  it('validates zoom bounds', () => {
    expect(isValidZoom(15)).toBe(true)
    expect(isValidZoom(0)).toBe(false)
    expect(isValidZoom(19)).toBe(false)
  })
})
