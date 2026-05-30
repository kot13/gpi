import { describe, expect, it } from 'vitest'

import { blogPostingJsonLd, realEstateAgentJsonLd, webSiteJsonLd } from '@/lib/seo/jsonLd'

describe('jsonLd helpers', () => {
  it('builds BlogPosting schema', () => {
    const schema = blogPostingJsonLd({
      title: 'Test Post',
      description: 'Desc',
      url: 'http://localhost:3000/ru/blog/test',
      locale: 'ru',
    })
    expect(schema['@type']).toBe('BlogPosting')
    expect(schema.headline).toBe('Test Post')
  })

  it('builds RealEstateAgent schema', () => {
    const schema = realEstateAgentJsonLd('http://localhost:3000')
    expect(schema['@type']).toBe('RealEstateAgent')
    expect(schema.name).toContain('Georgia')
  })

  it('builds WebSite schema', () => {
    const schema = webSiteJsonLd('http://localhost:3000')
    expect(schema['@type']).toBe('WebSite')
    expect(schema.inLanguage).toContain('ru')
  })
})
