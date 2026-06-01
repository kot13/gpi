import Link from 'next/link'
import React from 'react'

import { Media } from '@/components/Media'
import type { Locale } from '@/lib/i18n/config'
import { getMessages } from '@/lib/i18n/getMessages'
import { cityLabel, layoutLabel } from '@/lib/properties/labels'
import { formatPriceGel, formatPriceUsd } from '@/lib/properties/formatPrice'
import { getFirstPropertyImage } from '@/lib/properties/media'
import type { PropertyListItem } from '@/lib/properties/types'
import { cn } from '@/utilities/ui'

type Props = {
  property: PropertyListItem
  locale: Locale
  className?: string
}

export function PropertyCard({ property, locale, className }: Props) {
  const t = getMessages(locale)
  const href = `/${locale}/properties/${encodeURIComponent(property.objectCode)}`
  const image = getFirstPropertyImage(property.photos)
  const p = t.properties

  return (
    <article
      className={cn(
        'group border border-gpi-border rounded-[var(--radius-card)] overflow-hidden bg-gpi-bg-secondary hover:border-gpi-brand transition-colors shadow-sm',
        className,
      )}
    >
      <Link href={href} className="block">
        <div className="relative w-full aspect-[16/10] bg-gpi-border">
          {image ? (
            <Media
              resource={image}
              fill
              imgClassName="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              size="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-gpi-muted">
              {p?.noPhoto}
            </div>
          )}
        </div>
        <div className="p-5">
          <h2 className="text-lg font-semibold text-gpi-text mb-2 font-gpi-heading group-hover:text-gpi-brand transition-colors">
            {property.title}
          </h2>
          <p className="text-sm text-gpi-muted mb-2">
            {cityLabel(locale, property.city)}
            {property.district ? ` · ${property.district}` : ''}
          </p>
          <p className="text-base font-semibold text-gpi-text mb-1">
            {formatPriceUsd(property.priceUsd, locale)}{' '}
            <span className="text-sm font-normal text-gpi-muted">
              / {formatPriceGel(property.priceGel, locale)}
            </span>
          </p>
          <p className="text-sm text-gpi-muted">
            {property.area} m² · {property.rooms} {p?.specRooms?.toLowerCase()}
            {property.layout ? ` · ${layoutLabel(locale, property.layout)}` : ''}
          </p>
        </div>
      </Link>
    </article>
  )
}
