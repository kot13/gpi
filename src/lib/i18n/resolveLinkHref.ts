import type { Page, Post } from '@/payload-types'

import { DEFAULT_LOCALE, LOCALES, type Locale, isValidLocale } from '@/lib/i18n/config'
import { getLocalizedPath } from '@/lib/i18n/config'

export type CMSLinkFields = {
  type?: 'custom' | 'reference' | null
  url?: string | null
  reference?: {
    relationTo?: 'pages' | 'posts' | null
    value?: Page | Post | string | number | null
  } | null
}

/**
 * Rewrites internal paths to use the active locale.
 * - `/ru/blog` + `en` → `/en/blog`
 * - `/blog` + `en` → `/en/blog`
 * - `https://...` → unchanged
 */
export function localizePath(path: string, locale: Locale): string {
  if (!path || path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }

  if (!path.startsWith('/')) {
    return path
  }

  const segments = path.split('/').filter(Boolean)

  if (segments.length > 0 && isValidLocale(segments[0])) {
    const rest = segments.slice(1).join('/')
    return getLocalizedPath(locale, rest ? `/${rest}` : '')
  }

  const normalized = path === '/' ? '' : path
  return getLocalizedPath(locale, normalized)
}

export function resolveLinkHref(link: CMSLinkFields | null | undefined, locale: Locale): string | null {
  if (!link) return null

  if (link.type === 'reference' && link.reference) {
    const { relationTo, value } = link.reference

    if (typeof value === 'object' && value && 'slug' in value && value.slug) {
      const slug = value.slug

      if (relationTo === 'posts') {
        return getLocalizedPath(locale, `/blog/${slug}`)
      }

      if (slug === 'home') {
        return getLocalizedPath(locale, '')
      }

      return getLocalizedPath(locale, `/${slug}`)
    }

    return null
  }

  if (link.type === 'custom' && link.url) {
    return localizePath(link.url, locale)
  }

  if (link.url) {
    return localizePath(link.url, locale)
  }

  return null
}

export function getLocaleFromPathname(pathname: string): Locale {
  const segment = pathname.split('/').filter(Boolean)[0]
  return isValidLocale(segment) ? segment : DEFAULT_LOCALE
}

/** Strip locale prefix for path comparison */
export function stripLocaleFromPath(path: string): string {
  const segments = path.split('/').filter(Boolean)
  if (segments.length > 0 && LOCALES.includes(segments[0] as Locale)) {
    const rest = segments.slice(1).join('/')
    return rest ? `/${rest}` : '/'
  }
  return path.startsWith('/') ? path : `/${path}`
}
