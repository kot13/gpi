'use client'

import 'leaflet/dist/leaflet.css'

import L from 'leaflet'
import React, { useEffect } from 'react'
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet'

import {
  DEFAULT_ZOOM,
  LEAFLET_MARKER_ICON,
  LEAFLET_MARKER_ICON_2X,
  LEAFLET_MARKER_SHADOW,
  OSM_ATTRIBUTION,
  OSM_TILE_URL,
} from '@/lib/maps/constants'

const icon = L.icon({
  iconUrl: LEAFLET_MARKER_ICON,
  iconRetinaUrl: LEAFLET_MARKER_ICON_2X,
  shadowUrl: LEAFLET_MARKER_SHADOW,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})

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

type Props = {
  lat: number
  lng: number
  zoom?: number
}

export default function MapInner({ lat, lng, zoom = DEFAULT_ZOOM }: Props) {
  return (
    <MapContainer
      center={[lat, lng]}
      zoom={zoom}
      className="h-full w-full z-0"
      scrollWheelZoom={false}
    >
      <TileLayer attribution={OSM_ATTRIBUTION} url={OSM_TILE_URL} />
      <Marker position={[lat, lng]} icon={icon} />
      <ScrollWheelControl />
    </MapContainer>
  )
}
