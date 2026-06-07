'use client'

import Link from 'next/link'
import React, { forwardRef } from 'react'

import { Media } from '@/components/Media'
import type { Locale } from '@/lib/i18n/config'
import { getMessages } from '@/lib/i18n/getMessages'
import type { MapPropertyPoint } from '@/lib/maps/mapPropertyPoint'
import { formatPriceGel, formatPriceUsd } from '@/lib/properties/formatPrice'
import { cn } from '@/utilities/ui'

type Props = {
  point: MapPropertyPoint
  locale: Locale
  selected?: boolean
  onHover?: (objectCode: string | null) => void
  onSelect?: (objectCode: string) => void
}

export const PropertyMapListItem = forwardRef<HTMLAnchorElement, Props>(function PropertyMapListItem(
  { point, locale, selected, onHover, onSelect },
  ref,
) {
  const t = getMessages(locale)
  const p = t.properties

  return (
    <Link
      ref={ref}
      href={point.detailHref}
      className={cn(
        'flex gap-3 min-h-11 p-3 rounded-md border transition-colors',
        selected
          ? 'border-gpi-brand bg-gpi-brand/5'
          : 'border-gpi-border bg-gpi-bg hover:border-gpi-brand/60',
      )}
      onMouseEnter={() => onHover?.(point.objectCode)}
      onMouseLeave={() => onHover?.(null)}
      onFocus={() => onHover?.(point.objectCode)}
      onBlur={() => onHover?.(null)}
      onClick={() => onSelect?.(point.objectCode)}
    >
      <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded bg-gpi-border">
        {point.photo ? (
          <Media resource={point.photo} fill imgClassName="object-cover" size="80px" />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-gpi-muted px-1 text-center">
            {p?.noPhoto}
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-medium text-gpi-text truncate">{point.title}</p>
        <p className="text-sm text-gpi-muted truncate">
          {point.cityLabel}
          {point.district ? ` · ${point.district}` : ''}
        </p>
        <p className="text-sm font-semibold text-gpi-text mt-1">
          {formatPriceUsd(point.priceUsd, locale)}{' '}
          <span className="font-normal text-gpi-muted">
            / {formatPriceGel(point.priceGel, locale)}
          </span>
        </p>
      </div>
    </Link>
  )
})
