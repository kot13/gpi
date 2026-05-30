import type { GlobalAfterChangeHook } from 'payload'

import { revalidateGlobalLayout } from '@/hooks/revalidateFrontend'

export const revalidateHeader: GlobalAfterChangeHook = ({ doc, req: { payload, context } }) => {
  if (!context.disableRevalidate) {
    payload.logger.info(`Revalidating header`)
    revalidateGlobalLayout()
  }

  return doc
}
