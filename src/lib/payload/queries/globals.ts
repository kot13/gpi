import { cache } from 'react'

import { getPayload } from '@/lib/payload/getPayload'

export const getHeader = cache(async () => {
  const payload = await getPayload()
  return payload.findGlobal({ slug: 'header', depth: 1 })
})

export const getFooter = cache(async () => {
  const payload = await getPayload()
  return payload.findGlobal({ slug: 'footer', depth: 1 })
})
