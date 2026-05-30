import { getPayload } from '@/lib/payload/getPayload'
import type { Payload } from 'payload'

import { describe, it, beforeAll, expect } from 'vitest'

let payload: Payload

describe('Pages collection', () => {
  beforeAll(async () => {
    payload = await getPayload()
  }, 60000)

  it('lists published pages', async () => {
    const pages = await payload.find({
      collection: 'pages',
      locale: 'ru',
      draft: false,
      limit: 10,
    })
    expect(pages.docs).toBeDefined()
  })

  it('rejects duplicate slug on create', async () => {
    const existing = await payload.find({
      collection: 'pages',
      locale: 'ru',
      limit: 1,
      where: { slug: { exists: true } },
    })

    if (!existing.docs[0]?.slug) return

    await expect(
      payload.create({
        collection: 'pages',
        locale: 'ru',
        data: {
          title: 'Duplicate test',
          slug: existing.docs[0].slug,
          _status: 'draft',
        },
      }),
    ).rejects.toThrow()
  })
})
