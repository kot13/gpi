import { getPayload } from '@/lib/payload/getPayload'
import type { Payload } from 'payload'

import { describe, it, beforeAll, expect } from 'vitest'

let payload: Payload

describe('Forms collection', () => {
  beforeAll(async () => {
    payload = await getPayload()
  }, 60000)

  it('lists published footer forms', async () => {
    const result = await payload.find({
      collection: 'forms',
      draft: false,
      limit: 5,
      where: {
        and: [
          { placement: { equals: 'footer' } },
          { _status: { equals: 'published' } },
        ],
      },
    })
    expect(result.docs).toBeDefined()
  })

  it('rejects second published footer form', async () => {
    const existingFooterForms = await payload.find({
      collection: 'forms',
      overrideAccess: true,
      limit: 100,
      where: {
        and: [
          { placement: { equals: 'footer' } },
          { _status: { equals: 'published' } },
        ],
      },
    })

    for (const doc of existingFooterForms.docs) {
      await payload.update({
        collection: 'forms',
        id: doc.id,
        overrideAccess: true,
        context: { disableRevalidate: true },
        data: { placement: 'none' },
      })
    }

    const first = await payload.create({
      collection: 'forms',
      overrideAccess: true,
      context: { disableRevalidate: true },
      data: {
        slug: `footer-test-${Date.now()}-a`,
        formType: 'consultation',
        placement: 'footer',
        title: 'Footer A',
        submitButtonLabel: 'Send',
        successMessage: 'OK',
        _status: 'published',
      },
    })

    await expect(
      payload.create({
        collection: 'forms',
        overrideAccess: true,
        context: { disableRevalidate: true },
        data: {
          slug: `footer-test-${Date.now()}-b`,
          formType: 'consultation',
          placement: 'footer',
          title: 'Footer B',
          submitButtonLabel: 'Send',
          successMessage: 'OK',
          _status: 'published',
        },
      }),
    ).rejects.toThrow(/подвал/i)

    await payload.delete({
      collection: 'forms',
      id: first.id,
      overrideAccess: true,
    })
  })

  it('revalidate hook runs without throwing after forms change', async () => {
    const doc = await payload.create({
      collection: 'forms',
      overrideAccess: true,
      data: {
        slug: `revalidate-${Date.now()}`,
        formType: 'consultation',
        placement: 'none',
        title: 'Revalidate test',
        submitButtonLabel: 'Send',
        successMessage: 'OK',
        _status: 'draft',
      },
    })

    await payload.update({
      collection: 'forms',
      id: doc.id,
      overrideAccess: true,
      data: { title: 'Revalidate test updated' },
    })

    await payload.delete({
      collection: 'forms',
      id: doc.id,
      overrideAccess: true,
      context: { disableRevalidate: true },
    })

    expect(doc.id).toBeTruthy()
  })

  it('stores localized title for ka locale', async () => {
    const slug = `localized-${Date.now()}`
    const doc = await payload.create({
      collection: 'forms',
      locale: 'ru',
      overrideAccess: true,
      context: { disableRevalidate: true },
      data: {
        slug,
        formType: 'consultation',
        placement: 'none',
        title: 'RU title',
        submitButtonLabel: 'RU btn',
        successMessage: 'RU ok',
        _status: 'draft',
      },
    })

    await payload.update({
      collection: 'forms',
      id: doc.id,
      locale: 'ka',
      overrideAccess: true,
      context: { disableRevalidate: true },
      data: {
        title: 'KA title',
        submitButtonLabel: 'KA btn',
        successMessage: 'KA ok',
      },
    })

    const kaDoc = await payload.findByID({
      collection: 'forms',
      id: doc.id,
      locale: 'ka',
      draft: true,
    })

    expect(kaDoc.title).toBe('KA title')

    await payload.delete({
      collection: 'forms',
      id: doc.id,
      overrideAccess: true,
    })
  })
})
