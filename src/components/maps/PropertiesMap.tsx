'use client'

import dynamic from 'next/dynamic'
import React from 'react'

import type { MapBounds } from '@/lib/maps/bounds'
import type { MapPropertyPoint } from '@/lib/maps/mapPropertyPoint'
import type { Locale } from '@/lib/i18n/config'
import { getMessages } from '@/lib/i18n/getMessages'

type InnerProps = {
  locale: Locale
  points: MapPropertyPoint[]
  selectedObjectCode: string | null
  hoveredObjectCode: string | null
  onSelect: (objectCode: string) => void
  onBoundsChange: (bounds: MapBounds) => void
  fitKey: string
}

function MapLoadingFallback({ locale }: { locale: Locale }) {
  const t = getMessages(locale)
  return (
    <div className="flex h-full w-full items-center justify-center bg-gpi-border/30 text-gpi-muted">
      {t.properties?.map?.loading ?? '…'}
    </div>
  )
}

const PropertiesMapInner = dynamic(() => import('./PropertiesMapInner'), {
  ssr: false,
})

type Props = InnerProps

export function PropertiesMap(props: Props) {
  const { locale } = props

  return (
    <div className="absolute inset-0">
      <React.Suspense fallback={<MapLoadingFallback locale={locale} />}>
        <PropertiesMapInner {...props} />
      </React.Suspense>
    </div>
  )
}
