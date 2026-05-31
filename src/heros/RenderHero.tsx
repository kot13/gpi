import React from 'react'

import type { Page } from '@/payload-types'
import type { Locale } from '@/lib/i18n/config'

import { HighImpactHero } from '@/heros/HighImpact'
import { LowImpactHero } from '@/heros/LowImpact'
import { MediumImpactHero } from '@/heros/MediumImpact'
import { SlideshowHero } from '@/heros/Slideshow'

const heroes = {
  highImpact: HighImpactHero,
  lowImpact: LowImpactHero,
  mediumImpact: MediumImpactHero,
  slideshow: SlideshowHero,
}

export const RenderHero: React.FC<Page['hero'] & { locale: Locale }> = (props) => {
  const { type, locale, ...heroProps } = props || {}

  if (!type || type === 'none') return null

  const HeroToRender = heroes[type]

  if (!HeroToRender) return null

  return <HeroToRender {...heroProps} type={type} locale={locale} />
}
