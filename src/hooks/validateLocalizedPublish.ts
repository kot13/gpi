import type { CollectionBeforeChangeHook } from 'payload'
import type { Locale } from '@/hooks/slugify'

const LOCALES: Locale[] = ['ru', 'ka', 'en']

type LocalizedDoc = Record<string, unknown> & {
  _status?: 'draft' | 'published'
}

export const validateLocalizedPublish: CollectionBeforeChangeHook = ({ data, req, operation }) => {
  const doc = data as LocalizedDoc
  if (doc._status !== 'published') return data

  const locale = req.locale || 'ru'
  // When publishing, Payload validates per-locale in admin; hook checks current locale fields
  if (operation === 'update' || operation === 'create') {
    const missing: string[] = []
    for (const field of ['title', 'slug'] as const) {
      if (!doc[field]) missing.push(field)
    }
    if (missing.length) {
      throw new Error(`Cannot publish: missing required fields for locale "${locale}": ${missing.join(', ')}`)
    }
  }
  return data
}

export const validateAllLocalesBeforePublish = (
  doc: Record<string, unknown>,
  requiredFields: string[],
): void => {
  for (const loc of LOCALES) {
    for (const field of requiredFields) {
      const localized = doc[field]
      if (typeof localized === 'object' && localized !== null && loc in localized) {
        if (!(localized as Record<string, unknown>)[loc]) {
          throw new Error(`Cannot publish: "${field}" missing for locale "${loc}"`)
        }
      }
    }
  }
}
