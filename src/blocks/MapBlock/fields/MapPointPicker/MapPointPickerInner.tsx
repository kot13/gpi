'use client'

import 'leaflet/dist/leaflet.css'

import L from 'leaflet'
import React, { useEffect } from 'react'
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet'

import {
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

function MapViewSync({ lat, lng, zoom }: { lat: number; lng: number; zoom: number }) {
  const map = useMap()

  useEffect(() => {
    map.setView([lat, lng], zoom)
  }, [map, lat, lng, zoom])

  return null
}

function MapClickHandler({ onPick }: { onPick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng)
    },
  })
  return null
}

type Props = {
  lat: number
  lng: number
  zoom: number
  onPick: (lat: number, lng: number) => void
}

export default function MapPointPickerInner({ lat, lng, zoom, onPick }: Props) {
  return (
    <MapContainer
      center={[lat, lng]}
      zoom={zoom}
      style={{ height: '100%', width: '100%' }}
      scrollWheelZoom
    >
      <TileLayer attribution={OSM_ATTRIBUTION} url={OSM_TILE_URL} />
      <MapClickHandler onPick={onPick} />
      <MapViewSync lat={lat} lng={lng} zoom={zoom} />
      <Marker
        draggable
        position={[lat, lng]}
        icon={icon}
        eventHandlers={{
          dragend: (e) => {
            const { lat: nextLat, lng: nextLng } = e.target.getLatLng()
            onPick(nextLat, nextLng)
          },
        }}
      />
    </MapContainer>
  )
}
