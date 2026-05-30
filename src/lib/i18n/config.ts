import { LOCALES, type Locale } from '@/hooks/slugify'

export { LOCALES, DEFAULT_LOCALE, type Locale, isValidLocale } from '@/hooks/slugify'

export const localeLabels: Record<Locale, string> = {
  ru: 'RU',
  ka: 'KA',
  en: 'EN',
}

export function getLocalizedPath(locale: Locale, path = ''): string {
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `/${locale}${normalized === '/' ? '' : normalized}`
}

export function buildAlternateUrls(
  baseUrl: string,
  localeSlugs: Partial<Record<Locale, string>>,
  pathPrefix: string,
): { locale: Locale; url: string }[] {
  return LOCALES.filter((l) => localeSlugs[l]).map((locale) => ({
    locale,
    url: `${baseUrl}/${locale}${pathPrefix}/${localeSlugs[locale]}`,
  }))
}
