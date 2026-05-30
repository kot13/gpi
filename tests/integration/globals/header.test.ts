import { getPayload } from '@/lib/payload/getPayload'
import type { Payload } from 'payload'

import { describe, it, beforeAll, expect } from 'vitest'

let payload: Payload

describe('Header global', () => {
  beforeAll(async () => {
    payload = await getPayload()
  }, 60000)

  it('loads header with nav items', async () => {
    const header = await payload.findGlobal({ slug: 'header', depth: 1 })
    expect(header).toBeDefined()
    expect(header.navItems).toBeDefined()
  })
})
