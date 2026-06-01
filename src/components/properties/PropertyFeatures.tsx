import React from 'react'

import type { Locale } from '@/lib/i18n/config'
import { featureLabel } from '@/lib/properties/labels'
import type { PropertyFeature } from '@/lib/properties/types'

type Props = {
  features?: PropertyFeature[] | null
  locale: Locale
}

export function PropertyFeatures({ features, locale }: Props) {
  if (!features?.length) return null

  return (
    <ul className="flex flex-wrap gap-2">
      {features.map((feature) => (
        <li
          key={feature}
          className="text-xs font-medium px-3 py-1.5 rounded-full bg-gpi-bg-secondary border border-gpi-border text-gpi-text"
        >
          {featureLabel(locale, feature)}
        </li>
      ))}
    </ul>
  )
}
