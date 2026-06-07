'use client'

import Link from 'next/link'
import { ChevronDown, ChevronUp } from 'lucide-react'
import React, { useCallback, useEffect, useRef, useState } from 'react'

import { PropertyFilters } from '@/components/properties/PropertyFilters'
import type { Locale } from '@/lib/i18n/config'
import { getMessages } from '@/lib/i18n/getMessages'
import { buildPropertyFilterQuery } from '@/lib/properties/filterQuery'
import type { PropertyFilterParams } from '@/lib/properties/types'
import type { MapPropertyPoint } from '@/lib/maps/mapPropertyPoint'
import { cn } from '@/utilities/ui'

import { PropertyMapListItem } from './PropertyMapListItem'

type Props = {
  locale: Locale
  districts: string[]
  visiblePoints: MapPropertyPoint[]
  selectedObjectCode: string | null
  filterParams: PropertyFilterParams
  onHover: (objectCode: string | null) => void
  onSelect: (objectCode: string) => void
}

export function PropertiesMapPanel({
  locale,
  districts,
  visiblePoints,
  selectedObjectCode,
  filterParams,
  onHover,
  onSelect,
}: Props) {
  const t = getMessages(locale)
  const p = t.properties
  const mapT = p?.map

  const [panelCollapsed, setPanelCollapsed] = useState(false)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const itemRefs = useRef<Map<string, HTMLAnchorElement>>(new Map())

  const setItemRef = useCallback((objectCode: string, element: HTMLAnchorElement | null) => {
    if (element) {
      itemRefs.current.set(objectCode, element)
    } else {
      itemRefs.current.delete(objectCode)
    }
  }, [])

  useEffect(() => {
    if (!selectedObjectCode) return

    setPanelCollapsed(false)

    const element = itemRefs.current.get(selectedObjectCode)
    if (element) {
      element.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    }
  }, [selectedObjectCode, visiblePoints])

  const catalogQuery = buildPropertyFilterQuery(filterParams)
  const catalogHref = `/${locale}/properties${catalogQuery ? `?${catalogQuery}` : ''}`

  const resultsLabel =
    mapT?.resultsInView?.replace('{count}', String(visiblePoints.length)) ??
    String(visiblePoints.length)

  return (
    <>
      <aside
        role="region"
        aria-label={mapT?.pageTitle ?? 'Property map'}
        className={cn(
          'absolute z-[1000] flex flex-col bg-white/95 backdrop-blur shadow-lg',
          'left-0 right-0 bottom-0 max-h-[45vh] rounded-t-xl lg:rounded-xl',
          'lg:left-4 lg:top-4 lg:bottom-4 lg:right-auto lg:w-[min(360px,calc(100%-2rem))] lg:max-h-none',
          panelCollapsed && 'max-h-14 lg:max-h-none lg:w-auto lg:min-w-[280px]',
        )}
      >
        <div className="flex items-center gap-2 border-b border-gpi-border px-3 py-2 shrink-0">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-gpi-text truncate">{mapT?.pageTitle}</p>
            {!panelCollapsed && (
              <p className="text-xs text-gpi-muted" aria-live="polite">
                {resultsLabel}
              </p>
            )}
          </div>
          <button
            type="button"
            className="min-h-11 min-w-11 inline-flex items-center justify-center rounded-md border border-gpi-border text-sm font-medium px-3 lg:min-w-0"
            onClick={() => setFiltersOpen(true)}
          >
            {mapT?.filters ?? p?.filtersTitle}
          </button>
          <button
            type="button"
            className="lg:hidden min-h-11 min-w-11 inline-flex items-center justify-center rounded-md border border-gpi-border"
            aria-expanded={!panelCollapsed}
            onClick={() => setPanelCollapsed((c) => !c)}
          >
            {panelCollapsed ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            <span className="sr-only">
              {panelCollapsed ? mapT?.panelExpand : mapT?.panelCollapse}
            </span>
          </button>
        </div>

        {!panelCollapsed && (
          <div className="flex flex-col min-h-0 flex-1 overflow-hidden">
            <div className="px-3 py-2 border-b border-gpi-border">
              <Link
                href={catalogHref}
                className="text-sm font-medium text-gpi-brand hover:underline min-h-11 inline-flex items-center"
              >
                {p?.backToList}
              </Link>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {visiblePoints.length === 0 ? (
                <p className="text-sm text-gpi-muted py-4 text-center">{mapT?.emptyViewport}</p>
              ) : (
                visiblePoints.map((point) => (
                  <PropertyMapListItem
                    key={point.objectCode}
                    ref={(element) => setItemRef(point.objectCode, element)}
                    point={point}
                    locale={locale}
                    selected={point.objectCode === selectedObjectCode}
                    onHover={onHover}
                    onSelect={onSelect}
                  />
                ))
              )}
            </div>
          </div>
        )}
      </aside>

      <PropertyFilters
        locale={locale}
        districts={districts}
        basePath={`/${locale}/properties/map`}
        presentation="sheet"
        open={filtersOpen}
        onOpenChange={setFiltersOpen}
      />
    </>
  )
}
