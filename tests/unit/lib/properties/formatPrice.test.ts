import { describe, expect, it } from 'vitest'

import { formatPriceGel, formatPriceUsd } from '@/lib/properties/formatPrice'

describe('formatPrice', () => {
  it('formats GEL with lari sign consistently', () => {
    expect(formatPriceGel(164700, 'ru')).toMatch(/₾$/)
    expect(formatPriceGel(164700, 'ru')).toBe(formatPriceGel(164700, 'ru'))
  })

  it('formats USD with dollar sign', () => {
    expect(formatPriceUsd(73000, 'en')).toMatch(/^\$/)
  })
})
