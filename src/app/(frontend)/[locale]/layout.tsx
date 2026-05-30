import type { Metadata } from 'next'
import { isValidLocale, LOCALES, type Locale } from '@/lib/i18n/config'
import { notFound } from 'next/navigation'
import React from 'react'

import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { realEstateAgentJsonLd, webSiteJsonLd } from '@/lib/seo/jsonLd'

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: localeParam } = await params
  if (!isValidLocale(localeParam)) return {}

  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
  const languages = Object.fromEntries(
    LOCALES.map((loc) => [loc, `${baseUrl}/${loc}`]),
  ) as Record<Locale, string>

  return {
    alternates: {
      languages: {
        ...languages,
        'x-default': `${baseUrl}/ru`,
      },
    },
  }
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale: localeParam } = await params
  if (!isValidLocale(localeParam)) notFound()

  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
  const jsonLd = [realEstateAgentJsonLd(baseUrl), webSiteJsonLd(baseUrl)]

  return (
    <>
      {jsonLd.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  )
}
