import React from 'react'

import type { Page } from '@/payload-types'
import type { Locale } from '@/lib/i18n/config'
import { DEFAULT_LOCALE } from '@/lib/i18n/config'

import RichText from '@/components/RichText'

type LowImpactHeroType = {
  locale?: Locale
} & (
  | {
      children?: React.ReactNode
      richText?: never
    }
  | (Omit<Page['hero'], 'richText'> & {
      children?: never
      richText?: Page['hero']['richText']
    })
)

export const LowImpactHero: React.FC<LowImpactHeroType> = ({
  children,
  richText,
  locale = DEFAULT_LOCALE,
}) => {
  return (
    <div className="container mt-16">
      <div className="max-w-[48rem]">
        {children || (richText && <RichText data={richText} enableGutter={false} locale={locale} />)}
      </div>
    </div>
  )
}
