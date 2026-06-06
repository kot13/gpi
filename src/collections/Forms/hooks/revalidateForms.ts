import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidateGlobalLayout } from '@/hooks/revalidateFrontend'

function safeRevalidateLayout(payload: { logger: { info: (msg: string) => void } }) {
  try {
    payload.logger.info('Revalidating after forms change')
    revalidateGlobalLayout()
  } catch {
    // No-op outside Next.js request context (e.g. Vitest integration tests)
  }
}

export const revalidateForms: CollectionAfterChangeHook = ({ doc, req: { payload, context } }) => {
  if (!context.disableRevalidate) {
    safeRevalidateLayout(payload)
  }

  return doc
}

export const revalidateFormsDelete: CollectionAfterDeleteHook = ({ doc, req: { payload, context } }) => {
  if (!context.disableRevalidate) {
    safeRevalidateLayout(payload)
  }

  return doc
}
