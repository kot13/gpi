/** Default map center — Batumi, Georgia */
export const DEFAULT_CENTER_GE = {
  lat: 41.646,
  lng: 41.64,
} as const

export const DEFAULT_ZOOM = 15

export const SINGLE_PROPERTY_ZOOM = 14

export const ZOOM_MIN = 1
export const ZOOM_MAX = 18

/** Default viewport when no properties match filters */
export const DEFAULT_MAP_CENTER = DEFAULT_CENTER_GE

/** leaflet.markercluster maxClusterRadius (pixels) */
export const MAP_CLUSTER_MAX_RADIUS = 60

/** Approximate Georgia bounds for empty-state fallback centering */
export const GEORGIA_BOUNDS = {
  north: 43.59,
  south: 41.05,
  east: 46.74,
  west: 40.01,
} as const

/** Desktop overlay panel width — used for fitBounds paddingTopLeft */
export const MAP_PANEL_WIDTH_DESKTOP = 380

export const LEAFLET_MARKER_ICON = '/leaflet/marker-icon.png'
export const LEAFLET_MARKER_ICON_2X = '/leaflet/marker-icon-2x.png'
export const LEAFLET_MARKER_SHADOW = '/leaflet/marker-shadow.png'

export const OSM_TILE_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
export const OSM_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
