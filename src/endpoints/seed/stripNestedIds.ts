/**
 * Removes `id` keys from nested objects/arrays before locale updates.
 * Re-using row ids from another locale causes unique constraint errors in Payload.
 */
export function stripNestedIds<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((item) => stripNestedIds(item)) as T
  }

  if (value && typeof value === 'object') {
    const result: Record<string, unknown> = {}
    for (const [key, val] of Object.entries(value)) {
      if (key === 'id') continue
      result[key] = stripNestedIds(val)
    }
    return result as T
  }

  return value
}
