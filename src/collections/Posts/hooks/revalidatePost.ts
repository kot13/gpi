import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import type { Post } from '../../../payload-types'
import { revalidateAllLocaleBlogPostPaths } from '@/hooks/revalidateFrontend'

export const revalidatePost: CollectionAfterChangeHook<Post> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published' && doc.slug) {
      payload.logger.info(`Revalidating post: ${doc.slug}`)
      revalidateAllLocaleBlogPostPaths(doc.slug)
    }

    if (previousDoc._status === 'published' && doc._status !== 'published' && previousDoc.slug) {
      payload.logger.info(`Revalidating unpublished post: ${previousDoc.slug}`)
      revalidateAllLocaleBlogPostPaths(previousDoc.slug)
    }
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Post> = ({ doc, req: { context } }) => {
  if (!context.disableRevalidate && doc?.slug) {
    revalidateAllLocaleBlogPostPaths(doc.slug)
  }

  return doc
}
