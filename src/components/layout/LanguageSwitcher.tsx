'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LOCALES, localeLabels, type Locale, isValidLocale } from '@/lib/i18n/config'

export function LanguageSwitcher() {
  const pathname = usePathname()
  const segments = pathname.split('/').filter(Boolean)
  const currentLocale = isValidLocale(segments[0]) ? segments[0] : 'ru'
  const restPath = isValidLocale(segments[0]) ? segments.slice(1).join('/') : segments.join('/')

  const buildHref = (locale: Locale) => {
    const suffix = restPath ? `/${restPath}` : ''
    return `/${locale}${suffix}`
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      {LOCALES.map((locale) => (
        <Link
          key={locale}
          href={buildHref(locale)}
          className={`min-h-[44px] min-w-[44px] inline-flex items-center justify-center px-2 ${
            locale === currentLocale ? 'text-gpi-accent font-semibold' : 'text-gpi-muted hover:text-white'
          }`}
          aria-current={locale === currentLocale ? 'page' : undefined}
        >
          {localeLabels[locale]}
        </Link>
      ))}
    </div>
  )
}
