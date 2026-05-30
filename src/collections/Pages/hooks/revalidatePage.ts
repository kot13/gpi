import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import type { Page } from '../../../payload-types'
import { revalidateAllLocalePagePaths } from '@/hooks/revalidateFrontend'

export const revalidatePage: CollectionAfterChangeHook<Page> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published' && doc.slug) {
      payload.logger.info(`Revalidating page: ${doc.slug}`)
      revalidateAllLocalePagePaths(doc.slug)
    }

    if (previousDoc?._status === 'published' && doc._status !== 'published' && previousDoc.slug) {
      payload.logger.info(`Revalidating unpublished page: ${previousDoc.slug}`)
      revalidateAllLocalePagePaths(previousDoc.slug)
    }
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Page> = ({ doc, req: { context } }) => {
  if (!context.disableRevalidate && doc?.slug) {
    revalidateAllLocalePagePaths(doc.slug)
  }

  return doc
}
