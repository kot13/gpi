import type { Locale } from '@/lib/i18n/config'

const localeMap: Record<Locale, string> = {
  ru: 'ru-RU',
  ka: 'ka-GE',
  en: 'en-US',
}

export function formatPostDate(date: string | Date | null | undefined, locale: Locale): string | null {
  if (!date) return null
  const d = typeof date === 'string' ? new Date(date) : date
  if (Number.isNaN(d.getTime())) return null
  return new Intl.DateTimeFormat(localeMap[locale], {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d)
}
