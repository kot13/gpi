import type { CollectionBeforeChangeHook } from 'payload'

import type { Form } from '@/payload-types'

export const validateSingleFooterForm: CollectionBeforeChangeHook<Form> = async ({
  data,
  req,
  operation,
  originalDoc,
}) => {
  if (data?.placement !== 'footer' || data?._status !== 'published') {
    return data
  }

  const currentId = operation === 'update' ? originalDoc?.id : undefined

  const existing = await req.payload.find({
    collection: 'forms',
    draft: false,
    limit: 1,
    where: {
      and: [
        { placement: { equals: 'footer' } },
        { _status: { equals: 'published' } },
        ...(currentId ? [{ id: { not_equals: currentId } }] : []),
      ],
    },
  })

  if (existing.docs.length > 0) {
    throw new Error(
      'Уже опубликована другая форма для подвала. Снимите её с публикации или измените размещение.',
    )
  }

  return data
}
