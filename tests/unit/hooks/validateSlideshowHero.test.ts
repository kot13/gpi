import { describe, expect, it } from 'vitest'

import { validateSlideshowHeroForLocale } from '@/hooks/validateSlideshowHero'

describe('validateSlideshowHeroForLocale', () => {
  it('passes for valid slideshow hero', () => {
    expect(() =>
      validateSlideshowHeroForLocale(
        {
          type: 'slideshow',
          slides: [
            {
              image: 1,
              title: 'Title',
              subtitle: 'Sub',
              buttonLabel: 'Go',
              link: { type: 'custom', url: '/ru/blog' },
            },
          ],
        },
        'ru',
      ),
    ).not.toThrow()
  })

  it('throws when slides array is empty', () => {
    expect(() =>
      validateSlideshowHeroForLocale({ type: 'slideshow', slides: [] }, 'ru'),
    ).toThrow(/at least one slide/)
  })

  it('throws when slide missing title', () => {
    expect(() =>
      validateSlideshowHeroForLocale(
        {
          type: 'slideshow',
          slides: [
            {
              image: 1,
              title: '',
              subtitle: 'Sub',
              buttonLabel: 'Go',
              link: { type: 'custom', url: '/x' },
            },
          ],
        },
        'en',
      ),
    ).toThrow(/missing title/)
  })

  it('ignores non-slideshow hero types', () => {
    expect(() => validateSlideshowHeroForLocale({ type: 'lowImpact' }, 'ru')).not.toThrow()
  })
})
