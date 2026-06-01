import { getPayload } from '@/lib/payload/getPayload'
import type { Payload } from 'payload'

import { describe, it, beforeAll, expect } from 'vitest'

let payload: Payload

describe('Properties collection', () => {
  beforeAll(async () => {
    payload = await getPayload()
  }, 60000)

  it('lists active published properties', async () => {
    const result = await payload.find({
      collection: 'properties',
      locale: 'ru',
      draft: false,
      limit: 10,
      where: {
        and: [
          { _status: { equals: 'published' } },
          { listingStatus: { equals: 'active' } },
        ],
      },
    })
    expect(result.docs).toBeDefined()
  })

  it('rejects publish without positive priceUsd', async () => {
    await expect(
      payload.create({
        collection: 'properties',
        locale: 'ru',
        data: {
          objectCode: `test-${Date.now()}`,
          listingStatus: 'active',
          city: 'Batumi',
          priceUsd: 0,
          priceGel: 100,
          area: 40,
          rooms: 1,
          title: 'Test',
          description: 'Test description',
          _status: 'published',
        },
      }),
    ).rejects.toThrow(/priceUsd|Cannot publish/i)
  })
})
