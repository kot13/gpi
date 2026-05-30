import { getPayload } from '@/lib/payload/getPayload'
import type { Payload } from 'payload'

import { describe, it, beforeAll, expect } from 'vitest'

let payload: Payload

describe('Blog posts (posts collection)', () => {
  beforeAll(async () => {
    payload = await getPayload()
  }, 60000)

  it('lists published posts', async () => {
    const posts = await payload.find({
      collection: 'posts',
      locale: 'ru',
      draft: false,
      limit: 10,
    })
    expect(posts.docs).toBeDefined()
  })

  it('requires heroImage to publish', async () => {
    await expect(
      payload.create({
        collection: 'posts',
        locale: 'ru',
        data: {
          title: 'No image post',
          slug: `test-no-image-${Date.now()}`,
          description: 'Test description for publish validation',
          content: {
            root: {
              type: 'root',
              children: [
                {
                  type: 'paragraph',
                  children: [{ type: 'text', text: 'Hello', version: 1 }],
                  direction: null,
                  format: '',
                  indent: 0,
                  version: 1,
                },
              ],
              direction: null,
              format: '',
              indent: 0,
              version: 1,
            },
          },
          _status: 'published',
        },
      }),
    ).rejects.toThrow(/heroImage|Featured image/i)
  })
})
