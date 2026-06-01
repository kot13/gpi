import { describe, expect, it } from 'vitest'

import { catalogItemListJsonLd, productOfferJsonLd } from '@/lib/seo/propertyJsonLd'
import type { PropertyListItem } from '@/lib/properties/types'

const property: PropertyListItem = {
  id: 1,
  objectCode: '1037',
  title: 'Test',
  description: 'Desc',
  city: 'Batumi',
  priceUsd: 73000,
  priceGel: 197100,
  area: 41,
  rooms: 1,
  lat: 41.64,
  lng: 41.64,
}

describe('propertyJsonLd', () => {
  it('builds Product with two offers', () => {
    const json = productOfferJsonLd(property, 'ru')
    expect(json['@type']).toBe('Product')
    const offers = json.offers as unknown[]
    expect(offers).toHaveLength(2)
  })

  it('builds ItemList for catalog', () => {
    const json = catalogItemListJsonLd([property], 'en')
    expect(json['@type']).toBe('ItemList')
    const items = json.itemListElement as unknown[]
    expect(items).toHaveLength(1)
  })
})
