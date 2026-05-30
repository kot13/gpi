export const locales = ['ru', 'ka', 'en'] as const

export function localePath(locale: string, path = '') {
  const suffix = path.startsWith('/') ? path : path ? `/${path}` : ''
  return `/${locale}${suffix}`
}
