import { LOCALES, type Locale } from '@/lib/i18n/config'

export type HreflangEntry = {
  locale: Locale
  url: string
}

export function hreflangLinks(entries: HreflangEntry[], defaultUrl: string): Array<{ hrefLang: string; href: string }> {
  const links: Array<{ hrefLang: string; href: string }> = entries.map(({ locale, url }) => ({
    hrefLang: locale,
    href: url,
  }))
  links.push({ hrefLang: 'x-default', href: defaultUrl })
  return links
}

export function buildLocaleUrls(
  baseUrl: string,
  slugsByLocale: Partial<Record<Locale, string>>,
  prefix: string,
): HreflangEntry[] {
  return LOCALES.filter((locale) => slugsByLocale[locale]).map((locale) => ({
    locale,
    url: `${baseUrl}/${locale}${prefix}/${slugsByLocale[locale]}`,
  }))
}
