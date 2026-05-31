import { describe, expect, it } from 'vitest'

import {
  getLocaleFromPathname,
  localizePath,
  resolveLinkHref,
  stripLocaleFromPath,
} from '@/lib/i18n/resolveLinkHref'

describe('localizePath', () => {
  it('rewrites locale prefix in internal paths', () => {
    expect(localizePath('/ru/blog', 'en')).toBe('/en/blog')
    expect(localizePath('/en/contacts', 'ru')).toBe('/ru/contacts')
  })

  it('prepends locale when path has no locale segment', () => {
    expect(localizePath('/blog', 'en')).toBe('/en/blog')
    expect(localizePath('/about', 'ka')).toBe('/ka/about')
  })

  it('leaves external URLs unchanged', () => {
    expect(localizePath('https://example.com', 'en')).toBe('https://example.com')
  })
})

describe('resolveLinkHref', () => {
  it('resolves custom links for the active locale', () => {
    expect(
      resolveLinkHref({ type: 'custom', url: '/ru/blog' }, 'en'),
    ).toBe('/en/blog')
  })

  it('resolves page references', () => {
    expect(
      resolveLinkHref(
        {
          type: 'reference',
          reference: { relationTo: 'pages', value: { slug: 'about' } },
        },
        'en',
      ),
    ).toBe('/en/about')
  })

  it('resolves home page to locale root', () => {
    expect(
      resolveLinkHref(
        {
          type: 'reference',
          reference: { relationTo: 'pages', value: { slug: 'home' } },
        },
        'ru',
      ),
    ).toBe('/ru')
  })

  it('resolves post references to blog path', () => {
    expect(
      resolveLinkHref(
        {
          type: 'reference',
          reference: { relationTo: 'posts', value: { slug: 'my-post' } },
        },
        'en',
      ),
    ).toBe('/en/blog/my-post')
  })
})

describe('pathname helpers', () => {
  it('extracts locale from pathname', () => {
    expect(getLocaleFromPathname('/en/blog')).toBe('en')
    expect(getLocaleFromPathname('/unknown')).toBe('ru')
  })

  it('strips locale prefix', () => {
    expect(stripLocaleFromPath('/ru/blog')).toBe('/blog')
    expect(stripLocaleFromPath('/en')).toBe('/')
  })
})
