'use client'

import dynamic from 'next/dynamic'
import { useField, useFieldPath } from '@payloadcms/ui'
import React, { useCallback, useMemo } from 'react'

import { DEFAULT_CENTER_GE, DEFAULT_ZOOM } from '@/lib/maps/constants'
import { hasValidCoordinatePair } from '@/lib/maps/validateCoordinates'

const MapPointPickerInner = dynamic(() => import('./MapPointPickerInner'), {
  ssr: false,
  loading: () => (
    <div
      className="rounded bg-(--theme-elevation-100) animate-pulse"
      style={{ height: '320px' }}
      aria-hidden
    />
  ),
})

type Props = {
  path: string
}

function roundCoord(value: number): number {
  return Math.round(value * 1_000_000) / 1_000_000
}

export const MapPointPicker: React.FC<Props> = ({ path }) => {
  const fieldPath = useFieldPath()
  const parentPath = (fieldPath || path).replace(/\.mapPicker$/, '')

  const { value: lat, setValue: setLat } = useField<number | null>({ path: `${parentPath}.lat` })
  const { value: lng, setValue: setLng } = useField<number | null>({ path: `${parentPath}.lng` })
  const { value: zoom, setValue: setZoom } = useField<number | null>({
    path: `${parentPath}.zoom`,
  })

  const onPick = useCallback(
    (nextLat: number, nextLng: number) => {
      setLat(roundCoord(nextLat))
      setLng(roundCoord(nextLng))
      if (zoom == null) {
        setZoom(DEFAULT_ZOOM)
      }
    },
    [setLat, setLng, setZoom, zoom],
  )

  const center = useMemo(() => {
    if (hasValidCoordinatePair(lat, lng)) {
      return { lat, lng }
    }
    return DEFAULT_CENTER_GE
  }, [lat, lng])

  const mapZoom = zoom ?? DEFAULT_ZOOM

  return (
    <div className="field-type">
      <p className="field-description" style={{ marginBottom: '0.5rem' }}>
        Кликните по карте или перетащите маркер. Координаты сохранятся в полях широты и долготы.
      </p>
      <div
        className="rounded border border-(--theme-elevation-150)"
        style={{ height: '320px', overflow: 'hidden' }}
      >
        <MapPointPickerInner
          lat={center.lat}
          lng={center.lng}
          zoom={mapZoom}
          onPick={onPick}
        />
      </div>
    </div>
  )
}
