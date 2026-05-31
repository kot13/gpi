import { describe, expect, it } from 'vitest'

import { validateSlideshowHeroForLocale } from '@/hooks/validateSlideshowHero'

describe('Pages slideshow hero validation', () => {
  it('blocks publish when slideshow has no slides', () => {
    expect(() => validateSlideshowHeroForLocale({ type: 'slideshow', slides: [] }, 'ru')).toThrow()
  })

  it('allows publish when all slide fields are present per locale', () => {
    expect(() =>
      validateSlideshowHeroForLocale(
        {
          type: 'slideshow',
          slides: [
            {
              image: 10,
              title: 'A',
              subtitle: 'B',
              buttonLabel: 'C',
              link: { type: 'custom', url: 'https://example.com' },
            },
            {
              image: 11,
              title: 'D',
              subtitle: 'E',
              buttonLabel: 'F',
              link: { type: 'reference', reference: { relationTo: 'pages', value: 1 } },
            },
          ],
        },
        'ka',
      ),
    ).not.toThrow()
  })
})
