import configPromise from '@payload-config'
import { getPayload as createPayload, type Payload } from 'payload'

let payloadPromise: Promise<Payload> | null = null

export async function getPayload(): Promise<Payload> {
  if (!payloadPromise) {
    payloadPromise = createPayload({ config: configPromise })
  }
  return payloadPromise
}
