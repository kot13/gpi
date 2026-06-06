import { getPayload } from '@/lib/payload/getPayload'
import type { Payload } from 'payload'

import { describe, it, beforeAll, expect } from 'vitest'

let payload: Payload
let formId: number | string

describe('Form submissions collection', () => {
  beforeAll(async () => {
    payload = await getPayload()

    const form = await payload.create({
      collection: 'forms',
      overrideAccess: true,
      context: { disableRevalidate: true },
      data: {
        slug: `submission-form-${Date.now()}`,
        formType: 'consultation',
        placement: 'none',
        title: 'Test form',
        submitButtonLabel: 'Send',
        successMessage: 'Thanks',
        _status: 'published',
      },
    })

    formId = form.id
  }, 60000)

  it('creates submission anonymously', async () => {
    const submission = await payload.create({
      collection: 'form-submissions',
      data: {
        form: formId,
        name: 'Test User',
        contactMethod: 'telegram',
        contactValue: '@gpi_test',
        locale: 'ru',
        status: 'new',
        submittedAt: new Date().toISOString(),
      },
    })

    expect(submission.name).toBe('Test User')
    expect(submission.contactDisplay).toBe('@gpi_test')
  })

  it('rejects honeypot spam', async () => {
    await expect(
      payload.create({
        collection: 'form-submissions',
        data: {
          form: formId,
          name: 'Bot',
          contactMethod: 'telegram',
          contactValue: '@bot',
          locale: 'ru',
          honeypot: 'spam',
          status: 'new',
          submittedAt: new Date().toISOString(),
        },
      }),
    ).rejects.toThrow(/Spam/i)
  })

  it('stores country code for phone submissions', async () => {
    const submission = await payload.create({
      collection: 'form-submissions',
      data: {
        form: formId,
        name: 'Phone User',
        contactMethod: 'phone',
        countryCode: 'GE',
        dialCode: '+995',
        contactValue: '555123456',
        locale: 'ru',
        status: 'new',
        submittedAt: new Date().toISOString(),
      },
    })

    expect(submission.countryCode).toBe('GE')
    expect(submission.dialCode).toBe('+995')
    expect(submission.contactDisplay).toMatch(/\+995/)
  })

  it('filters submissions by status', async () => {
    const result = await payload.find({
      collection: 'form-submissions',
      overrideAccess: true,
      where: { status: { equals: 'new' } },
    })

    expect(result.docs.every((doc) => doc.status === 'new')).toBe(true)
  })

  it('allows authenticated status update', async () => {
    const submission = await payload.create({
      collection: 'form-submissions',
      overrideAccess: true,
      data: {
        form: formId,
        name: 'Status User',
        contactMethod: 'vk',
        contactValue: 'gpi_test',
        locale: 'en',
        status: 'new',
        submittedAt: new Date().toISOString(),
      },
    })

    const updated = await payload.update({
      collection: 'form-submissions',
      id: submission.id,
      overrideAccess: true,
      data: { status: 'processed' },
    })

    expect(updated.status).toBe('processed')
  })
})
