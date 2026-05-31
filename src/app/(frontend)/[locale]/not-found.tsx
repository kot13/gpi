import type { Metadata } from 'next'
import Link from 'next/link'
import { headers } from 'next/headers'
import React from 'react'

import { RenderHero } from '@/heros/RenderHero'
import { DEFAULT_LOCALE, getLocalizedPath, isValidLocale, type Locale } from '@/lib/i18n/config'
import { getPageBySlug } from '@/lib/payload/queries/pages'
import { generateMeta } from '@/utilities/generateMeta'

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocaleFromRequest()
  const page = await getPageBySlug('404', locale)
  if (page) return generateMeta({ doc: page })
  return {
    title: '404 | GPI',
    robots: { index: false, follow: false },
  }
}

async function getLocaleFromRequest(): Promise<Locale> {
  const headersList = await headers()
  const localeHeader = headersList.get('x-locale')
  if (localeHeader && isValidLocale(localeHeader)) return localeHeader
  return DEFAULT_LOCALE
}

export default async function LocaleNotFound() {
  const locale = await getLocaleFromRequest()
  const page = await getPageBySlug('404', locale)

  if (page) {
    return (
      <article className="container py-28">
        <RenderHero {...page.hero} locale={locale} />
      </article>
    )
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
