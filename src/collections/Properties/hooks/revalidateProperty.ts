import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidateAllLocalePropertyPaths } from '@/hooks/revalidateFrontend'
import type { Property } from '@/payload-types'

export const revalidateProperty: CollectionAfterChangeHook<Property> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    const code = doc.objectCode || previousDoc?.objectCode
    if (code) {
      payload.logger.info(`Revalidating property: ${code}`)
      revalidateAllLocalePropertyPaths(code)
    }
  }
  return doc
}

export const revalidatePropertyDelete: CollectionAfterDeleteHook<Property> = ({
  doc,
  req: { context },
}) => {
  if (!context.disableRevalidate && doc?.objectCode) {
    revalidateAllLocalePropertyPaths(doc.objectCode)
  }
  return doc
}
