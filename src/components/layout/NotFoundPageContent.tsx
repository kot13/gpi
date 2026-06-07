'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

import { DEFAULT_LOCALE, getLocalizedPath, type Locale } from '@/lib/i18n/config'
import { getLocaleFromPathname } from '@/lib/i18n/resolveLinkHref'

type Props = {
  heroes: Partial<Record<Locale, React.ReactNode>>
}

export function NotFoundPageContent({ heroes }: Props) {
  const pathname = usePathname()
  const locale = getLocaleFromPathname(pathname) ?? DEFAULT_LOCALE
  const hero = heroes[locale] ?? heroes[DEFAULT_LOCALE]

  if (hero) {
    return <article className="container py-28">{hero}</article>
  }

  return (
    <div className="container py-28 text-center">
      <h1 className="text-5xl font-bold text-gpi-text mb-4 font-gpi-heading">404</h1>
      <p className="text-gpi-muted mb-8">Page not found</p>
      <Link
        href={getLocalizedPath(locale, '')}
        className="inline-flex items-center justify-center min-h-[44px] px-6 rounded-full bg-gpi-brand text-white hover:opacity-90 transition-opacity"
      >
        Home
      </Link>
    </div>
  )
}
