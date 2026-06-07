import type { Metadata } from 'next'
import React from 'react'

import { NotFoundPageContent } from '@/components/layout/NotFoundPageContent'
import { RenderHero } from '@/heros/RenderHero'
import { DEFAULT_LOCALE, LOCALES, type Locale } from '@/lib/i18n/config'
import { getPublishedPageBySlug } from '@/lib/payload/queries/pages'
import { generateMeta } from '@/utilities/generateMeta'

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPublishedPageBySlug('404', DEFAULT_LOCALE)
  if (page) return generateMeta({ doc: page })
  return {
    title: '404 | GPI',
    robots: { index: false, follow: false },
  }
}

export default async function LocaleNotFound() {
  const pages = await Promise.all(
    LOCALES.map(async (locale) => ({
      locale,
      page: await getPublishedPageBySlug('404', locale),
    })),
  )

  const heroes: Partial<Record<Locale, React.ReactNode>> = {}

  for (const { locale, page } of pages) {
    if (page?.hero) {
      heroes[locale] = <RenderHero {...page.hero} locale={locale} />
    }
  }

  return <NotFoundPageContent heroes={heroes} />
}
