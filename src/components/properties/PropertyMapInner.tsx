'use client'

import 'leaflet/dist/leaflet.css'

import L from 'leaflet'
import React, { useEffect } from 'react'
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet'

// Fix default marker icons in bundlers
const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
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
}

export default function PropertyMapInner({ lat, lng }: Props) {
  return (
    <MapContainer
      center={[lat, lng]}
      zoom={15}
      className="h-full w-full z-0"
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[lat, lng]} icon={icon} />
      <ScrollWheelControl />
    </MapContainer>
  )
}
