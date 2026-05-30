import type { Metadata } from 'next'
import type { Locale } from '@/lib/i18n/config'
import { LOCALES } from '@/lib/i18n/config'

const OG_LOCALE_MAP: Record<Locale, string> = {
  ru: 'ru_RU',
  ka: 'ka_GE',
  en: 'en_US',
}

export type PageMetaInput = {
  title: string
  description?: string | null
  locale: Locale
  path: string
  imageUrl?: string | null
  type?: 'website' | 'article'
}

export function buildPageMetadata({
  title,
  description,
  locale,
  path,
  imageUrl,
  type = 'website',
}: PageMetaInput): Metadata {
  const siteName = 'GPI — Georgia Private Investment'
  const fullTitle = title.includes('GPI') ? title : `${title} | GPI`
  const desc = description || siteName
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  const canonical = `${baseUrl}/${locale}${normalizedPath}`
  const ogImage = imageUrl || `${baseUrl}/images/og-default.jpg`

  const languages = Object.fromEntries(
    LOCALES.map((loc) => [loc, `${baseUrl}/${loc}${normalizedPath}`]),
  ) as Record<Locale, string>

  return {
    title: fullTitle,
    description: desc,
    alternates: {
      canonical,
      languages: {
        ...languages,
        'x-default': `${baseUrl}/ru${normalizedPath}`,
      },
    },
    openGraph: {
      title: fullTitle,
      description: desc,
      url: canonical,
      siteName,
      locale: OG_LOCALE_MAP[locale],
      type,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}
