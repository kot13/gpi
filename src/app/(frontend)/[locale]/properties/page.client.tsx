'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import React, { useMemo } from 'react'

import { PropertyCatalogGrid } from '@/components/properties/PropertyCatalogGrid'
import { PropertyFilters } from '@/components/properties/PropertyFilters'
import type { Locale } from '@/lib/i18n/config'
import { getMessages } from '@/lib/i18n/getMessages'
import { buildPropertyFilterQuery } from '@/lib/properties/filterQuery'
import {
  CATALOG_PAGE_SIZE,
  filterProperties,
  paginateProperties,
  parsePropertyFilterParams,
  searchParamsToFilterRecord,
  sortProperties,
} from '@/lib/properties/filters'
import type { PropertyListItem } from '@/lib/properties/types'

type Props = {
  properties: PropertyListItem[]
  locale: Locale
  districts: string[]
}

export default function PropertiesCatalogClient({ properties, locale, districts }: Props) {
  const searchParams = useSearchParams()
  const t = getMessages(locale)

  const params = useMemo(
    () => parsePropertyFilterParams(searchParamsToFilterRecord(searchParams)),
    [searchParams],
  )

  const filtered = useMemo(() => {
    const list = sortProperties(filterProperties(properties, params), params.sort)
    return paginateProperties(list, 1, CATALOG_PAGE_SIZE)
  }, [properties, params])

  const resultsLabel = t.properties?.catalogResults?.replace(
    '{count}',
    String(filtered.length),
  )

  const resetFilters = () => {
    window.location.href = `/${locale}/properties`
  }

  const mapQuery = buildPropertyFilterQuery(params)
  const mapHref = `/${locale}/properties/map${mapQuery ? `?${mapQuery}` : ''}`

  return (
    <div className="container py-8">
      <div className="mb-6">
        <Link
          href={mapHref}
          className="inline-flex min-h-11 items-center rounded-md bg-gpi-brand px-4 text-sm font-medium text-white hover:bg-gpi-brand/90"
        >
          {t.properties?.viewOnMap}
        </Link>
      </div>
      <div className="lg:grid lg:grid-cols-[280px_1fr] lg:gap-10">
        <PropertyFilters locale={locale} districts={districts} className="mb-8 lg:mb-0" />
        <div>
          <p className="text-sm text-gpi-muted mb-4" aria-live="polite">
            {resultsLabel}
          </p>
          <PropertyCatalogGrid
            properties={filtered}
            locale={locale}
            onResetFilters={resetFilters}
          />
        </div>
      </div>
    </div>
  )
}
