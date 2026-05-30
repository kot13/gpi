import 'dotenv/config'

import { getPayload } from '../src/lib/payload/getPayload'

await getPayload()
console.log('Schema push complete')
process.exit(0)
