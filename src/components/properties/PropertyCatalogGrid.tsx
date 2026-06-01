'use client'

import React from 'react'

import { PropertyCard } from './PropertyCard'
import type { Locale } from '@/lib/i18n/config'
import { getMessages } from '@/lib/i18n/getMessages'
import type { PropertyListItem } from '@/lib/properties/types'

type Props = {
  properties: PropertyListItem[]
  locale: Locale
  onResetFilters?: () => void
}

export function PropertyCatalogGrid({ properties, locale, onResetFilters }: Props) {
  const t = getMessages(locale)
  const p = t.properties

  if (properties.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-gpi-muted mb-4">{p?.catalogEmpty}</p>
        {onResetFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="min-h-11 px-6 rounded-md bg-gpi-brand text-white font-medium"
          >
            {p?.catalogResetFilters}
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
      {properties.map((property) => (
        <PropertyCard key={property.objectCode} property={property} locale={locale} />
      ))}
    </div>
  )
}
