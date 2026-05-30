import { getPayload } from '@/lib/payload/getPayload'
import type { Payload } from 'payload'

import { describe, it, beforeAll, expect } from 'vitest'

let payload: Payload

describe('Blog categories (categories collection)', () => {
  beforeAll(async () => {
    payload = await getPayload()
  }, 60000)

  it('lists categories', async () => {
    const categories = await payload.find({
      collection: 'categories',
      locale: 'ru',
      limit: 10,
    })
    expect(categories.docs).toBeDefined()
  })
})
