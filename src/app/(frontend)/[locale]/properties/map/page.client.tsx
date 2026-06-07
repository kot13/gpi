'use client'

import { useSearchParams } from 'next/navigation'
import React, { useCallback, useMemo, useState } from 'react'

import { PropertiesMap } from '@/components/maps/PropertiesMap'
import { PropertiesMapPanel } from '@/components/maps/PropertiesMapPanel'
import type { Locale } from '@/lib/i18n/config'
import { getMessages } from '@/lib/i18n/getMessages'
import type { MapBounds } from '@/lib/maps/bounds'
import { filterMapPointsInBounds } from '@/lib/maps/bounds'
import { toMapPropertyPoints } from '@/lib/maps/mapPropertyPoint'
import { buildPropertyFilterQuery } from '@/lib/properties/filterQuery'
import {
  filterProperties,
  parsePropertyFilterParams,
  searchParamsToFilterRecord,
  sortProperties,
} from '@/lib/properties/filters'
import type { PropertyListItem } from '@/lib/properties/types'
import Link from 'next/link'

type Props = {
  properties: PropertyListItem[]
  locale: Locale
  districts: string[]
}

export default function PropertiesMapPageClient({ properties, locale, districts }: Props) {
  const searchParams = useSearchParams()
  const t = getMessages(locale)
  const mapT = t.properties?.map

  const [viewportBounds, setViewportBounds] = useState<MapBounds | null>(null)
  const [selectedObjectCode, setSelectedObjectCode] = useState<string | null>(null)
  const [hoveredObjectCode, setHoveredObjectCode] = useState<string | null>(null)

  const filterParams = useMemo(
    () => parsePropertyFilterParams(searchParamsToFilterRecord(searchParams)),
    [searchParams],
  )

  const filteredProperties = useMemo(
    () => sortProperties(filterProperties(properties, filterParams), filterParams.sort),
    [properties, filterParams],
  )

  const mapPoints = useMemo(
    () => toMapPropertyPoints(filteredProperties, locale),
    [filteredProperties, locale],
  )

  const visiblePoints = useMemo(
    () => filterMapPointsInBounds(mapPoints, viewportBounds),
    [mapPoints, viewportBounds],
  )

  const fitKey = useMemo(
    () => buildPropertyFilterQuery(filterParams) || 'all',
    [filterParams],
  )

  const handleBoundsChange = useCallback((bounds: MapBounds) => {
    setViewportBounds(bounds)
  }, [])

  const hasFilters = Boolean(buildPropertyFilterQuery(filterParams))

  return (
    <div className="relative h-[calc(100dvh-var(--header-height))] w-full overflow-hidden">
      <h1 className="sr-only">{mapT?.pageTitle}</h1>

      {mapPoints.length === 0 ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center z-10 bg-gpi-bg">
          <p className="text-gpi-muted max-w-md">{mapT?.empty}</p>
          {hasFilters && (
            <Link
              href={`/${locale}/properties/map`}
              className="min-h-11 inline-flex items-center rounded-md bg-gpi-brand px-4 text-white font-medium"
            >
              {t.properties?.catalogResetFilters}
            </Link>
          )}
          <Link
            href={`/${locale}/properties`}
            className="text-sm text-gpi-brand hover:underline min-h-11 inline-flex items-center"
          >
            {t.properties?.backToList}
          </Link>
        </div>
      ) : (
        <>
          <PropertiesMap
            locale={locale}
            points={mapPoints}
            selectedObjectCode={selectedObjectCode}
            hoveredObjectCode={hoveredObjectCode}
            onSelect={setSelectedObjectCode}
            onBoundsChange={handleBoundsChange}
            fitKey={fitKey}
          />
          <PropertiesMapPanel
            locale={locale}
            districts={districts}
            visiblePoints={visiblePoints}
            selectedObjectCode={selectedObjectCode}
            filterParams={filterParams}
            onHover={setHoveredObjectCode}
            onSelect={setSelectedObjectCode}
          />
        </>
      )}
    </div>
  )
}
