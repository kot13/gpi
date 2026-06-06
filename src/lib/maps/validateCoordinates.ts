export type CoordinateValidationError =
  | 'missing'
  | 'invalid_lat'
  | 'invalid_lng'
  | 'invalid_zoom'

export function isValidLatitude(lat: number): boolean {
  return Number.isFinite(lat) && lat >= -90 && lat <= 90
}

export function isValidLongitude(lng: number): boolean {
  return Number.isFinite(lng) && lng >= -180 && lng <= 180
}

export function isValidZoom(zoom: number): boolean {
  return Number.isFinite(zoom) && zoom >= 1 && zoom <= 18
}

export function hasValidCoordinatePair(
  lat?: number | null,
  lng?: number | null,
): lat is number {
  if (lat == null || lng == null) return false
  return isValidLatitude(lat) && isValidLongitude(lng)
}

export function validateCoordinates(
  lat?: number | null,
  lng?: number | null,
): { ok: true } | { ok: false; error: CoordinateValidationError } {
  if (lat == null || lng == null) {
    return { ok: false, error: 'missing' }
  }
  if (!isValidLatitude(lat)) {
    return { ok: false, error: 'invalid_lat' }
  }
  if (!isValidLongitude(lng)) {
    return { ok: false, error: 'invalid_lng' }
  }
  return { ok: true }
}
