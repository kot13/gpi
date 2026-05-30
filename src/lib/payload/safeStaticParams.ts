/**
 * Returns static params from a Payload query, or an empty array when the DB
 * is unavailable during build (e.g. CI without Postgres).
 */
export async function safeStaticParams<T>(fn: () => Promise<T[]>): Promise<T[]> {
  try {
    return await fn()
  } catch (error) {
    console.warn('[safeStaticParams] DB unavailable during build, skipping pre-render:', error)
    return []
  }
}
