import { describe, expect, it } from 'vitest'
import { validateAllLocalesBeforePublish } from '@/hooks/validateLocalizedPublish'

describe('validateAllLocalesBeforePublish', () => {
  it('passes when all locales have required fields', () => {
    expect(() =>
      validateAllLocalesBeforePublish(
        {
          title: { ru: 'RU', ka: 'KA', en: 'EN' },
          slug: { ru: 'ru-slug', ka: 'ka-slug', en: 'en-slug' },
        },
        ['title', 'slug'],
      ),
    ).not.toThrow()
  })

  it('throws when a locale is missing a required field', () => {
    expect(() =>
      validateAllLocalesBeforePublish(
        {
          title: { ru: 'RU', ka: '', en: 'EN' },
          slug: { ru: 'ru-slug', ka: 'ka-slug', en: 'en-slug' },
        },
        ['title', 'slug'],
      ),
    ).toThrow(/title.*ka/)
  })

  it('throws when slug missing for en locale', () => {
    expect(() =>
      validateAllLocalesBeforePublish(
        {
          title: { ru: 'RU', ka: 'KA', en: 'EN' },
          slug: { ru: 'ru-slug', ka: 'ka-slug', en: '' },
        },
        ['title', 'slug'],
      ),
    ).toThrow(/slug.*en/)
  })
})
