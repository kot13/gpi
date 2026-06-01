function numberLocale(locale: string): string {
  if (locale === 'ka') return 'ka-GE'
  if (locale === 'en') return 'en-US'
  return 'ru-RU'
}

/** Deterministic USD formatting (avoids server/client ICU currency symbol differences). */
export function formatPriceUsd(amount: number, locale: string): string {
  const value = new Intl.NumberFormat(numberLocale(locale), {
    maximumFractionDigits: 0,
  }).format(amount)
  return `$${value}`
}

/** Deterministic GEL formatting — Node and browsers disagree on ₾ vs "GEL" for `style: 'currency'`. */
export function formatPriceGel(amount: number, locale: string): string {
  const value = new Intl.NumberFormat(numberLocale(locale), {
    maximumFractionDigits: 0,
  }).format(amount)
  return `${value} ₾`
}
