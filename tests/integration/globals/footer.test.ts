import { getFooterForm } from '@/lib/forms/queries'
import { getPayload } from '@/lib/payload/getPayload'
import type { Payload } from 'payload'

import { describe, it, beforeAll, expect } from 'vitest'

let payload: Payload

describe('Footer global', () => {
  beforeAll(async () => {
    payload = await getPayload()
  }, 60000)

  it('loads footer with legal fields', async () => {
    const footer = await payload.findGlobal({ slug: 'footer', depth: 1 })
    expect(footer).toBeDefined()
  })

  it('loads published footer consultation form when configured', async () => {
    const form = await getFooterForm('ru')
    if (form) {
      expect(form.placement).toBe('footer')
      expect(form.formType).toBe('consultation')
      expect(form.title).toBeTruthy()
    } else {
      expect(form).toBeNull()
    }
  })
})
