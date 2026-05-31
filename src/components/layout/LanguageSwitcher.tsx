'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

import { LOCALES, localeLabels, type Locale, isValidLocale } from '@/lib/i18n/config'
import type { LocaleAlternateMap } from '@/lib/i18n/localeAlternate'

export function LanguageSwitcher() {
  const pathname = usePathname()
  const segments = pathname.split('/').filter(Boolean)
  const currentLocale = isValidLocale(segments[0]) ? segments[0] : 'ru'
  const restPath = isValidLocale(segments[0]) ? segments.slice(1).join('/') : segments.join('/')

  const [alternates, setAlternates] = useState<LocaleAlternateMap | null>(null)

  useEffect(() => {
    let cancelled = false
    fetch(`/api/locale-alternate?pathname=${encodeURIComponent(pathname)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data) setAlternates(data)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [pathname])

  const buildHref = (locale: Locale) => {
    if (alternates?.[locale]) return alternates[locale]!
    const suffix = restPath ? `/${restPath}` : ''
    return `/${locale}${suffix}`
  }

  return (
    <div className="flex items-center gap-1 text-sm font-gpi-body">
      {LOCALES.map((locale) => (
        <Link
          key={locale}
          href={buildHref(locale)}
          className={`min-h-[44px] min-w-[44px] inline-flex items-center justify-center px-2 transition-colors ${
            locale === currentLocale
              ? 'text-gpi-brand font-semibold'
              : 'text-gpi-muted hover:text-gpi-brand'
          }`}
          aria-current={locale === currentLocale ? 'page' : undefined}
        >
          {localeLabels[locale]}
        </Link>
      ))}
    </div>
  )
}
