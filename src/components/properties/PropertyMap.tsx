'use client'

import dynamic from 'next/dynamic'
import React from 'react'

import type { Locale } from '@/lib/i18n/config'
import { getMessages } from '@/lib/i18n/getMessages'
import { isGeorgiaCoordinates } from '@/hooks/validatePropertyPublish'

const MapInner = dynamic(() => import('@/components/maps/MapInner'), {
  ssr: false,
  loading: () => <div className="h-60 md:h-80 rounded-lg bg-gpi-border animate-pulse" />,
})

type Props = {
  lat?: number | null
  lng?: number | null
  locale: Locale
  label?: string
}

export function PropertyMap({ lat, lng, locale, label }: Props) {
  const t = getMessages(locale)

  if (!isGeorgiaCoordinates(lat, lng) || lat == null || lng == null) {
    return <p className="text-sm text-gpi-muted">{t.properties?.mapUnavailable}</p>
  }

  return (
    <div
      className="h-60 md:h-80 rounded-lg overflow-hidden border border-gpi-border"
      aria-label={label ?? 'Map'}
    >
      <MapInner lat={lat} lng={lng} />
    </div>
  )
}
