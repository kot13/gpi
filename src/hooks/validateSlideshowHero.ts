export type SlideshowSlideFields = {
  image?: unknown
  title?: string | null
  subtitle?: string | null
  buttonLabel?: string | null
  link?: {
    type?: 'custom' | 'reference' | null
    url?: string | null
    reference?: unknown
  } | null
}

export type SlideshowHeroFields = {
  type?: string
  slides?: SlideshowSlideFields[] | null
}

function isLinkValid(link: SlideshowSlideFields['link']): boolean {
  if (!link?.type) return false
  if (link.type === 'custom') return Boolean(link.url?.trim())
  if (link.type === 'reference') return Boolean(link.reference)
  return false
}

/**
 * Validates slideshow slides for the current locale (localized text fields on slide rows).
 */
export function validateSlideshowHeroForLocale(
  hero: SlideshowHeroFields | null | undefined,
  locale: string,
): void {
  if (hero?.type !== 'slideshow') return

  const slides = hero.slides
  if (!slides?.length) {
    throw new Error(
      `Cannot publish: slideshow requires at least one slide for locale "${locale}"`,
    )
  }

  slides.forEach((slide, index) => {
    const n = index + 1
    if (!slide.image) {
      throw new Error(`Cannot publish: slide ${n} missing image for locale "${locale}"`)
    }
    if (!slide.title?.trim()) {
      throw new Error(`Cannot publish: slide ${n} missing title for locale "${locale}"`)
    }
    if (!slide.subtitle?.trim()) {
      throw new Error(`Cannot publish: slide ${n} missing subtitle for locale "${locale}"`)
    }
    if (!slide.buttonLabel?.trim()) {
      throw new Error(`Cannot publish: slide ${n} missing button label for locale "${locale}"`)
    }
    if (!isLinkValid(slide.link)) {
      throw new Error(`Cannot publish: slide ${n} missing valid link for locale "${locale}"`)
    }
  })
}
