import type { MapPropertyPoint } from './mapPropertyPoint'
import { SINGLE_PROPERTY_ZOOM } from './constants'

export type MapBounds = {
  north: number
  south: number
  east: number
  west: number
}

export function singlePropertyZoom(): number {
  return SINGLE_PROPERTY_ZOOM
}

export function isInBounds(lat: number, lng: number, bounds: MapBounds): boolean {
  return (
    lat <= bounds.north &&
    lat >= bounds.south &&
    lng <= bounds.east &&
    lng >= bounds.west
  )
}

export function filterPropertiesInBounds<T extends { lat: number; lng: number }>(
  items: T[],
  bounds: MapBounds | null,
): T[] {
  if (!bounds) return items
  return items.filter((item) => isInBounds(item.lat, item.lng, bounds))
}

export function filterMapPointsInBounds(
  points: MapPropertyPoint[],
  bounds: MapBounds | null,
): MapPropertyPoint[] {
  return filterPropertiesInBounds(points, bounds)
}

export function getBoundsFromPoints(
  points: Array<{ lat: number; lng: number }>,
): MapBounds | null {
  if (points.length === 0) return null

  let north = points[0]!.lat
  let south = points[0]!.lat
  let east = points[0]!.lng
  let west = points[0]!.lng

  for (const point of points) {
    north = Math.max(north, point.lat)
    south = Math.min(south, point.lat)
    east = Math.max(east, point.lng)
    west = Math.min(west, point.lng)
  }

  return { north, south, east, west }
}

export type FitBoundsPadding = {
  paddingTopLeft?: [number, number]
  paddingBottomRight?: [number, number]
  maxZoom?: number
}

/** Leaflet map instance — typed loosely to keep bounds.ts testable without DOM */
export type LeafletMapLike = {
  fitBounds: (
    bounds: [[number, number], [number, number]],
    options?: FitBoundsPadding,
  ) => void
  setView: (center: [number, number], zoom: number) => void
}

export function fitBoundsForProperties(
  map: LeafletMapLike,
  points: Array<{ lat: number; lng: number }>,
  options?: FitBoundsPadding,
): void {
  if (points.length === 0) return

  if (points.length === 1) {
    const point = points[0]!
    map.setView([point.lat, point.lng], singlePropertyZoom())
    return
  }

  const bounds = getBoundsFromPoints(points)
  if (!bounds) return

  map.fitBounds(
    [
      [bounds.south, bounds.west],
      [bounds.north, bounds.east],
    ],
    options,
  )
}
