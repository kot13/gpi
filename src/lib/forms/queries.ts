import configPromise from '@payload-config'
import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'

import type { Locale } from '@/lib/i18n/config'
import type { Form } from '@/payload-types'

export async function getFooterForm(locale: Locale): Promise<Form | null> {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'forms',
    depth: 1,
    draft: false,
    limit: 1,
    locale,
    where: {
      and: [
        { placement: { equals: 'footer' } },
        { _status: { equals: 'published' } },
      ],
    },
  })

  return result.docs[0] ?? null
}

export const getCachedFooterForm = (locale: Locale) =>
  unstable_cache(async () => getFooterForm(locale), ['footer-form', locale], {
    tags: [`footer_form_${locale}`, 'footer_form'],
  })
