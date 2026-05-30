import { describe, expect, it } from 'vitest'
import { buildPageMetadata } from '@/lib/seo/metadata'

describe('buildPageMetadata', () => {
  it('builds title with GPI suffix', () => {
    const meta = buildPageMetadata({
      title: 'О нас',
      description: 'О компании GPI',
      locale: 'ru',
      path: '/about',
    })
    expect(meta.title).toBe('О нас | GPI')
    expect(meta.description).toBe('О компании GPI')
  })

  it('sets openGraph locale for ka', () => {
    const meta = buildPageMetadata({
      title: 'Test',
      locale: 'ka',
      path: '/test',
    })
    expect(meta.openGraph?.locale).toBe('ka_GE')
  })
})
