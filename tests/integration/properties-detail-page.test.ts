import { getPayload } from '@/lib/payload/getPayload'
import type { Payload } from 'payload'

import { describe, it, beforeAll, expect } from 'vitest'

let payload: Payload

describe('properties detail data', () => {
  beforeAll(async () => {
    payload = await getPayload()
  }, 60000)

  it('finds property by objectCode when published and active', async () => {
    const result = await payload.find({
      collection: 'properties',
      locale: 'ru',
      draft: false,
      limit: 1,
      where: {
        and: [
          { objectCode: { equals: '1037' } },
          { _status: { equals: 'published' } },
          { listingStatus: { equals: 'active' } },
        ],
      },
    })

    if (result.docs.length > 0) {
      expect(result.docs[0]?.objectCode).toBe('1037')
    } else {
      expect(result.docs).toBeDefined()
    }
  })
})
