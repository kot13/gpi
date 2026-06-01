import { describe, expect, it } from 'vitest'

import { cityLabel, layoutLabel } from '@/lib/properties/labels'

describe('property labels', () => {
  it('returns Russian city label', () => {
    expect(cityLabel('ru', 'Batumi')).toBe('Батуми')
  })

  it('returns English layout label', () => {
    expect(layoutLabel('en', 'studio')).toBe('Studio')
  })
})
