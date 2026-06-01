import { describe, expect, it } from 'vitest'

import {
  isGeorgiaCoordinates,
  validatePropertyFieldsForPublish,
} from '@/hooks/validatePropertyPublish'

describe('validatePropertyPublish', () => {
  it('accepts empty coordinates', () => {
    expect(isGeorgiaCoordinates(null, null)).toBe(true)
  })

  it('rejects partial coordinates', () => {
    expect(isGeorgiaCoordinates(41.6, null)).toBe(false)
  })

  it('accepts Batumi coordinates', () => {
    expect(isGeorgiaCoordinates(41.646098, 41.64049)).toBe(true)
  })

  it('throws when required fields missing on publish', () => {
    expect(() =>
      validatePropertyFieldsForPublish(
        {
          objectCode: '1037',
          listingStatus: 'active',
          _status: 'published',
          city: 'Batumi',
          priceUsd: 0,
          priceGel: 100,
          area: 40,
          rooms: 1,
          title: 'T',
          description: 'D',
        },
        'ru',
      ),
    ).toThrow(/priceUsd/)
  })
})
