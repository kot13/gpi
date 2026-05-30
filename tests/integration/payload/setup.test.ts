import { describe, expect, it } from 'vitest'

describe('PostgreSQL connection', () => {
  it('DATABASE_URI is configured', () => {
    expect(process.env.DATABASE_URI).toBeTruthy()
    expect(process.env.DATABASE_URI).toMatch(/^postgresql:\/\//)
  })

  it('PAYLOAD_SECRET is configured', () => {
    expect(process.env.PAYLOAD_SECRET).toBeTruthy()
    expect(process.env.PAYLOAD_SECRET!.length).toBeGreaterThanOrEqual(32)
  })
})
