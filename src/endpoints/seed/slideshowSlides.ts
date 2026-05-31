import type { Page } from '@/payload-types'

import type { Locale } from '@/lib/i18n/config'

type SlideInput = {
  imageId: number
  title: string
  subtitle: string
  buttonLabel: string
  url: string
}

/** Canonical Russian copy (matches CMS home hero slideshow). */
const HOME_SLIDES_RU: Omit<SlideInput, 'imageId'>[] = [
  {
    title: 'Подписка',
    subtitle: 'С нами вы получите лучшую цену при входе на самом старте',
    buttonLabel: 'Подробнее',
    url: '/ru/blog',
  },
  {
    title: 'Скидки в Pontus Rotana',
    subtitle: 'до 5% + кешбэк 1% от GPI',
    buttonLabel: 'Подробнее',
    url: '/ru/blog',
  },
  {
    title: 'VR Krtsanisi Resort Residence',
    subtitle: 'Курорт внутри Тбилиси',
    buttonLabel: 'Подробнее',
    url: '/ru/blog',
  },
]

const HOME_SLIDES: Record<Locale, Omit<SlideInput, 'imageId'>[]> = {
  ru: HOME_SLIDES_RU,
  ka: [
    {
      title: 'გამოწერა',
      subtitle: 'ჩვენთან ერთად საუკეთესო ფასს მიიღებთ პროექტის დაწყების ეტაპზე',
      buttonLabel: 'დეტალურად',
      url: '/ka/blog',
    },
    {
      title: 'ფასდაკლებები Pontus Rotana-ში',
      subtitle: '5%-მდე + 1% კეშბექი GPI-დან',
      buttonLabel: 'დეტალურად',
      url: '/ka/blog',
    },
    {
      title: 'VR Krtsanisi Resort Residence',
      subtitle: 'კურორტი თბილისის შიგნით',
      buttonLabel: 'დეტალურად',
      url: '/ka/blog',
    },
  ],
  en: [
    {
      title: 'Subscribe',
      subtitle: 'With us you get the best price when you join at the very start',
      buttonLabel: 'Read more',
      url: '/en/blog',
    },
    {
      title: 'Discounts at Pontus Rotana',
      subtitle: 'Up to 5% + 1% cashback from GPI',
      buttonLabel: 'Read more',
      url: '/en/blog',
    },
    {
      title: 'VR Krtsanisi Resort Residence',
      subtitle: 'A resort within Tbilisi',
      buttonLabel: 'Read more',
      url: '/en/blog',
    },
  ],
}

export function buildSlideshowHero(slides: SlideInput[]): Page['hero'] {
  return {
    type: 'slideshow',
    slides: slides.map((slide) => ({
      image: slide.imageId,
      title: slide.title,
      subtitle: slide.subtitle,
      buttonLabel: slide.buttonLabel,
      link: {
        type: 'custom',
        url: slide.url,
        newTab: false,
      },
    })),
  } as Page['hero']
}

export function buildHomeSlideshowHero(locale: Locale, imageId: number): Page['hero'] {
  return buildSlideshowHero(
    HOME_SLIDES[locale].map((slide) => ({
      ...slide,
      imageId,
    })),
  )
}
