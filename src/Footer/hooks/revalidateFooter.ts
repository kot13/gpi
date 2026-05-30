import type { GlobalAfterChangeHook } from 'payload'

import { revalidateGlobalLayout } from '@/hooks/revalidateFrontend'

export const revalidateFooter: GlobalAfterChangeHook = ({ doc, req: { payload, context } }) => {
  if (!context.disableRevalidate) {
    payload.logger.info(`Revalidating footer`)
    revalidateGlobalLayout()
  }

  return doc
}
