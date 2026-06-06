import type { CollectionBeforeValidateHook } from 'payload'

import { formatContactDisplay } from '@/lib/forms/validateContact'
import type { ContactMethod } from '@/lib/forms/types'
import type { FormSubmission } from '@/payload-types'

export const normalizeSubmission: CollectionBeforeValidateHook<FormSubmission> = ({ data }) => {
  if (!data) return data

  const method = data.contactMethod as ContactMethod | undefined
  const contactValue = data.contactValue ?? ''
  const countryCode = data.countryCode ?? ''
  const dialCode = data.dialCode ?? ''

  if (method && contactValue) {
    data.contactDisplay = formatContactDisplay(method, contactValue, countryCode, dialCode)
  }

  if (!data.submittedAt) {
    data.submittedAt = new Date().toISOString()
  }

  if (!data.status) {
    data.status = 'new'
  }

  return data
}
