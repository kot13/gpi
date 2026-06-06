import 'dotenv/config'

import { createLocalReq, getPayload } from 'payload'
import config from '@payload-config'
import { seed } from '@/endpoints/seed'

async function main() {
  const payload = await getPayload({ config })
  const users = await payload.find({ collection: 'users', limit: 1 })

  if (!users.docs[0]) {
    throw new Error('No users found — create an admin user first')
  }

  const req = await createLocalReq({ user: users.docs[0] }, payload)
  await seed({ payload, req })
  console.log('Seed completed successfully')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
