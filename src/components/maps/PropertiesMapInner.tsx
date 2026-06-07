'use client'

import 'leaflet/dist/leaflet.css'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import './properties-map.css'

import L from 'leaflet'
import 'leaflet.markercluster'
import React, { useEffect, useMemo, useRef } from 'react'
import { MapContainer, TileLayer, useMap } from 'react-leaflet'

import type { MapBounds } from '@/lib/maps/bounds'
import { fitBoundsForProperties } from '@/lib/maps/bounds'
import type { MapPropertyPoint } from '@/lib/maps/mapPropertyPoint'
import { createPropertyPriceIcon } from '@/lib/maps/priceMarkerIcon'
import type { Locale } from '@/lib/i18n/config'
import {
  DEFAULT_MAP_CENTER,
  DEFAULT_ZOOM,
  MAP_CLUSTER_MAX_RADIUS,
  MAP_PANEL_WIDTH_DESKTOP,
  OSM_ATTRIBUTION,
  OSM_TILE_URL,
} from '@/lib/maps/constants'

function ScrollWheelControl() {
  const map = useMap()

  useEffect(() => {
    map.scrollWheelZoom.disable()
    const enable = () => map.scrollWheelZoom.enable()
    const disable = () => map.scrollWheelZoom.disable()
    map.on('focus', enable)
    map.on('blur', disable)
    return () => {
      map.off('focus', enable)
      map.off('blur', disable)
    }
  }, [map])

  return null
}

function ZoomControlRight() {
  const map = useMap()

  useEffect(() => {
    const control = L.control.zoom({ position: 'topright' })
    control.addTo(map)
    return () => {
      control.remove()
    }
  }, [map])

  return null
}

function MapBoundsReporter({
  onBoundsChange,
}: {
  onBoundsChange: (bounds: MapBounds) => void
}) {
  const map = useMap()

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | undefined

    const report = () => {
      if (timeout) clearTimeout(timeout)
      timeout = setTimeout(() => {
        const b = map.getBounds()
        onBoundsChange({
          north: b.getNorth(),
          south: b.getSouth(),
          east: b.getEast(),
          west: b.getWest(),
        })
      }, 200)
    }

    map.on('moveend', report)
    map.on('zoomend', report)
    report()

    return () => {
      map.off('moveend', report)
      map.off('zoomend', report)
      if (timeout) clearTimeout(timeout)
    }
  }, [map, onBoundsChange])

  return null
}

function FitBoundsController({
  points,
  fitKey,
}: {
  points: MapPropertyPoint[]
  fitKey: string
}) {
  const map = useMap()

  useEffect(() => {
    if (points.length === 0) return

    const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 980
    fitBoundsForProperties(map, points, {
      paddingTopLeft: isDesktop ? [MAP_PANEL_WIDTH_DESKTOP, 48] : [24, 24],
      paddingBottomRight: [24, 24],
      maxZoom: 16,
    })
  }, [map, points, fitKey])

  return null
}

function MarkerClusterLayer({
  points,
  locale,
  selectedObjectCode,
  hoveredObjectCode,
  onSelect,
}: {
  points: MapPropertyPoint[]
  locale: Locale
  selectedObjectCode: string | null
  hoveredObjectCode: string | null
  onSelect: (objectCode: string) => void
}) {
  const map = useMap()
  const clusterRef = useRef<L.MarkerClusterGroup | null>(null)

  useEffect(() => {
    const cluster = L.markerClusterGroup({
      maxClusterRadius: MAP_CLUSTER_MAX_RADIUS,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
    })

    clusterRef.current = cluster
    map.addLayer(cluster)

    return () => {
      map.removeLayer(cluster)
      clusterRef.current = null
    }
  }, [map])

  useEffect(() => {
    const cluster = clusterRef.current
    if (!cluster) return

    cluster.clearLayers()

    for (const point of points) {
      const isHighlighted =
        point.objectCode === selectedObjectCode || point.objectCode === hoveredObjectCode
      const marker = L.marker([point.lat, point.lng], {
        icon: createPropertyPriceIcon(point.priceUsd, locale, isHighlighted),
        title: point.title,
      })
      marker.on('click', () => onSelect(point.objectCode))
      cluster.addLayer(marker)
    }
  }, [points, locale, selectedObjectCode, hoveredObjectCode, onSelect])

  return null
}

type Props = {
  locale: Locale
  points: MapPropertyPoint[]
  selectedObjectCode: string | null
  hoveredObjectCode: string | null
  onSelect: (objectCode: string) => void
  onBoundsChange: (bounds: MapBounds) => void
  fitKey: string
}

export default function PropertiesMapInner({
  locale,
  points,
  selectedObjectCode,
  hoveredObjectCode,
  onSelect,
  onBoundsChange,
  fitKey,
}: Props) {
  const center = useMemo(() => {
    if (points.length === 1) {
      return [points[0]!.lat, points[0]!.lng] as [number, number]
    }
    return [DEFAULT_MAP_CENTER.lat, DEFAULT_MAP_CENTER.lng] as [number, number]
  }, [points])

  return (
    <MapContainer
      center={center}
      zoom={DEFAULT_ZOOM}
      className="gpi-properties-map h-full w-full z-0"
      scrollWheelZoom={false}
      zoomControl={false}
    >
      <TileLayer attribution={OSM_ATTRIBUTION} url={OSM_TILE_URL} />
      <ZoomControlRight />
      <ScrollWheelControl />
      <MapBoundsReporter onBoundsChange={onBoundsChange} />
      <FitBoundsController points={points} fitKey={fitKey} />
      <MarkerClusterLayer
        locale={locale}
        points={points}
        selectedObjectCode={selectedObjectCode}
        hoveredObjectCode={hoveredObjectCode}
        onSelect={onSelect}
      />
    </MapContainer>
  )
}
