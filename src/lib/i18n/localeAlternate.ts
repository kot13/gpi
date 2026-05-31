import type { Locale } from '@/lib/i18n/config'
import { LOCALES, getLocalizedPath, isValidLocale } from '@/lib/i18n/config'
import { getPageBySlug } from '@/lib/payload/queries/pages'
import { getPostBySlug } from '@/lib/payload/queries/blog'
import { getPayload } from '@/lib/payload/getPayload'

export type LocaleAlternateMap = Partial<Record<Locale, string>>

function pagePath(locale: Locale, slug: string): string {
  return slug === 'home' ? getLocalizedPath(locale, '') : getLocalizedPath(locale, `/${slug}`)
}

/** Build per-locale URLs for the same document (pages / blog posts). */
export async function getPageAlternatePaths(pageId: number): Promise<LocaleAlternateMap> {
  const payload = await getPayload()
  const paths: LocaleAlternateMap = {}

  await Promise.all(
    LOCALES.map(async (locale) => {
      try {
        const doc = await payload.findByID({
          collection: 'pages',
          id: pageId,
          locale,
          depth: 0,
          select: { slug: true },
        })
        if (doc?.slug) paths[locale] = pagePath(locale, doc.slug)
      } catch {
        // locale version may not exist
      }
    }),
  )

  return paths
}

export async function getPostAlternatePaths(postId: number): Promise<LocaleAlternateMap> {
  const payload = await getPayload()
  const paths: LocaleAlternateMap = {}

  await Promise.all(
    LOCALES.map(async (locale) => {
      try {
        const doc = await payload.findByID({
          collection: 'posts',
          id: postId,
          locale,
          depth: 0,
          select: { slug: true },
        })
        if (doc?.slug) paths[locale] = getLocalizedPath(locale, `/blog/${doc.slug}`)
      } catch {
        // locale version may not exist
      }
    }),
  )

  return paths
}

/**
 * Resolves alternate locale URLs for the current pathname.
 * Falls back to swapping the locale segment when no document is found.
 */
export async function resolveLocaleAlternates(pathname: string): Promise<LocaleAlternateMap> {
  const segments = pathname.split('/').filter(Boolean)
  const currentLocale = segments[0]

  if (!isValidLocale(currentLocale)) {
    return Object.fromEntries(LOCALES.map((l) => [l, getLocalizedPath(l, '')])) as LocaleAlternateMap
  }

  const rest = segments.slice(1)
  const fallback = (locale: Locale) => {
    const suffix = rest.length ? `/${rest.join('/')}` : ''
    return `/${locale}${suffix}`
  }

  if (rest.length === 0) {
    return Object.fromEntries(LOCALES.map((l) => [l, getLocalizedPath(l, '')])) as LocaleAlternateMap
  }

  if (rest[0] === 'blog') {
    if (rest[1] === 'category' && rest[2]) {
      return Object.fromEntries(LOCALES.map((l) => [l, fallback(l)])) as LocaleAlternateMap
    }
    if (rest[1] && rest[1] !== 'page') {
      const post = await getPostBySlug(rest[1], currentLocale)
      if (post?.id) return getPostAlternatePaths(post.id)
    }
    const blogPage = await getPageBySlug('blog', currentLocale)
    if (blogPage?.id) return getPageAlternatePaths(blogPage.id)
    return Object.fromEntries(LOCALES.map((l) => [l, getLocalizedPath(l, '/blog')])) as LocaleAlternateMap
  }

  const slug = rest.join('/')
  const page = await getPageBySlug(slug, currentLocale)
  if (page?.id) return getPageAlternatePaths(page.id)

  return Object.fromEntries(LOCALES.map((l) => [l, fallback(l)])) as LocaleAlternateMap
}
