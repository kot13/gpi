import { describe, expect, it } from 'vitest'

import { buildPageMetadata } from '@/lib/seo/metadata'
import { blogPostingJsonLd, realEstateAgentJsonLd, webSiteJsonLd } from '@/lib/seo/jsonLd'

describe('SEO public metadata contract', () => {
  it('buildPageMetadata includes canonical, hreflang, OG image', () => {
    const meta = buildPageMetadata({
      title: 'О нас',
      description: 'О компании GPI',
      locale: 'ru',
      path: '/about',
    })

    expect(meta.title).toContain('О нас')
    expect(meta.description).toBeTruthy()
    expect(meta.alternates?.canonical).toContain('/ru/about')
    expect(meta.alternates?.languages?.ru).toContain('/ru/about')
    expect(meta.alternates?.languages?.ka).toContain('/ka/about')
    expect(meta.alternates?.languages?.en).toContain('/en/about')
    expect(meta.openGraph?.images?.[0]).toMatchObject({ width: 1200, height: 630 })
    expect(meta.robots).toEqual({ index: true, follow: true })
  })

  it('blog JSON-LD has headline and inLanguage', () => {
    const schema = blogPostingJsonLd({
      title: 'Test',
      description: 'Desc',
      url: 'http://localhost:3000/ru/blog/test',
      locale: 'ru',
    })
    expect(schema['@type']).toBe('BlogPosting')
    expect(schema.headline).toBe('Test')
    expect(schema.inLanguage).toBe('ru')
  })

  it('site-level JSON-LD schemas are valid', () => {
    const agent = realEstateAgentJsonLd('http://localhost:3000')
    const site = webSiteJsonLd('http://localhost:3000')
    expect(agent['@type']).toBe('RealEstateAgent')
    expect(site['@type']).toBe('WebSite')
    expect(site.inLanguage).toEqual(['ru', 'ka', 'en'])
  })
})
