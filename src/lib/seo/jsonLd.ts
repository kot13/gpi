import type { Locale } from '@/lib/i18n/config'

export function webPageJsonLd(input: {
  title: string
  description?: string | null
  url: string
  locale: Locale
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: input.title,
    description: input.description || undefined,
    url: input.url,
    inLanguage: input.locale,
    isPartOf: {
      '@type': 'WebSite',
      name: 'GPI',
      url: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
    },
  }
}

export function blogPostingJsonLd(input: {
  title: string
  description?: string | null
  url: string
  imageUrl?: string | null
  publishedAt?: string | null
  locale: Locale
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: input.title,
    description: input.description || undefined,
    image: input.imageUrl || undefined,
    datePublished: input.publishedAt || undefined,
    inLanguage: input.locale,
    author: {
      '@type': 'Organization',
      name: 'GPI',
    },
    mainEntityOfPage: input.url,
  }
}

export function realEstateAgentJsonLd(baseUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    name: 'Georgia Private Investment',
    url: baseUrl,
    logo: `${baseUrl}/images/logo.svg`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Batumi',
      addressCountry: 'GE',
    },
  }
}

export function webSiteJsonLd(baseUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'GPI — Georgia Private Investment',
    url: baseUrl,
    inLanguage: ['ru', 'ka', 'en'],
    publisher: {
      '@type': 'Organization',
      name: 'Georgia Private Investment',
      logo: `${baseUrl}/images/logo.svg`,
    },
  }
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}
