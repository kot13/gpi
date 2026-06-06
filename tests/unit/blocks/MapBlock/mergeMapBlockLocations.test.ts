import { describe, expect, it } from 'vitest'

import { mergeMapBlockLocations } from '@/blocks/MapBlock/hooks/validateMapBlockOnPublish'

describe('mergeMapBlockLocations', () => {
  it('fills missing lat/lng from stored layout blocks', () => {
    const incoming = [
      {
        blockType: 'mapBlock',
        id: 'block-1',
        location: { zoom: 14 },
        title: 'Батуми',
      },
    ]
    const stored = [
      {
        blockType: 'mapBlock',
        id: 'block-1',
        location: { lat: 41.646, lng: 41.64, zoom: 15 },
        title: 'Батуми',
      },
    ]

    const merged = mergeMapBlockLocations(incoming, stored) as typeof incoming
    expect(merged[0].location).toEqual({ lat: 41.646, lng: 41.64, zoom: 14 })
  })

  it('keeps incoming coordinates when they are valid', () => {
    const incoming = [
      {
        blockType: 'mapBlock',
        location: { lat: 41.71, lng: 44.75 },
      },
    ]
    const stored = [
      {
        blockType: 'mapBlock',
        location: { lat: 41.646, lng: 41.64 },
      },
    ]

    const merged = mergeMapBlockLocations(incoming, stored) as typeof incoming
    expect(merged[0].location?.lat).toBe(41.71)
    expect(merged[0].location?.lng).toBe(44.75)
  })
})
