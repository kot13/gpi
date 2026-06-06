import type { CollectionBeforeValidateHook } from 'payload'

import type { FormSubmission } from '@/payload-types'

export const rejectSpam: CollectionBeforeValidateHook<FormSubmission> = ({ data }) => {
  if (data?.honeypot && String(data.honeypot).trim().length > 0) {
    throw new Error('Spam detected')
  }

  return data
}
