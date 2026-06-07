# Contract: Map Page UI — Properties Map Components

**Feature**: 007-properties-map  
**Date**: 2026-06-07

## Page layout

```text
Header (site nav, unchanged)
└── main (min-h-0, flex-1)
    └── PropertiesMapPageClient
        ├── PropertiesMapPanel (overlay left / bottom mobile)
        │   ├── header: count + «Фильтры» button
        │   ├── scrollable PropertyMapListItem × N
        │   └── PropertyFilters (sheet, when open)
        └── PropertiesMap (full bleed)
            └── PropertiesMapInner
                ├── TileLayer (OSM)
                ├── MarkerClusterGroup
                │   └── Marker × N
                ├── FitBoundsController
                └── ScrollWheelControl (reuse pattern)
```

**Footer**: not rendered on `/properties/map`.

## PropertiesMapPageClient

**Props**:
```typescript
{
  properties: PropertyListItem[]
  locale: Locale
  districts: string[]
}
```

**State**: selectedObjectCode, panelCollapsed (mobile), derives filtered from searchParams.

## PropertiesMap

```typescript
'use client'
// dynamic import PropertiesMapInner, { ssr: false }
// Props: {
//   points: MapPropertyPoint[]
//   selectedObjectCode?: string | null
//   onSelect: (objectCode: string) => void
//   onBoundsChange: (bounds: LatLngBounds) => void
//   fitToPoints: MapPropertyPoint[]  // trigger fitBounds when changes
// }
```

**Fallback** (before hydration): skeleton full height + panel placeholder text (i18n `properties.map.loading`).

## PropertiesMapInner

- `MapContainer` `className="h-full w-full"`
- `MarkerClusterGroup` from leaflet.markercluster
- Marker click → `onSelect(objectCode)`
- Selected marker → distinct icon class or z-index offset
- Cluster click → default zoomToBoundsOnClick

## PropertiesMapPanel

**Desktop (lg+)**:
- Fixed overlay: `absolute top-4 left-4 bottom-4 w-[min(360px,calc(100%-2rem))]`
- `bg-white/95 backdrop-blur shadow-lg rounded-lg flex flex-col z-[1000]`
- Min touch 44px on filter button and list items

**Mobile**:
- Bottom sheet: default ~45vh height, drag handle collapse to ~56px
- `panelCollapsed` toggles expanded state

**List item** (`PropertyMapListItem`):
- Reuse visual density of `PropertyCard` (thumbnail, title, location, price)
- `onMouseEnter` / `onFocus` → highlight marker
- Link to detail on click/tap

## PropertyFilters (extended)

**New props**:
```typescript
{
  basePath?: string        // default `/${locale}/properties`
  presentation?: 'sidebar' | 'sheet'
  open?: boolean           // sheet only
  onOpenChange?: (open: boolean) => void
}
```

**Sheet mode**: Radix Dialog/Sheet or existing drawer pattern from catalog mobile; same form fields as sidebar.

## Catalog integration

In `PropertiesCatalogClient`, above grid:

```tsx
<Link
  href={`/${locale}/properties/map${queryString ? `?${queryString}` : ''}`}
  className="..." // min-h 44px
>
  {t.properties.viewOnMap}
</Link>
```

`queryString = buildPropertyFilterQuery(params)`.

## lib/maps/bounds.ts

```typescript
export function isInBounds(
  lat: number,
  lng: number,
  bounds: { north: number; south: number; east: number; west: number },
): boolean

export function fitBoundsForProperties(
  map: L.Map,
  points: Array<{ lat: number; lng: number }>,
  options?: { paddingTopLeft?: [number, number]; paddingBottomRight?: [number, number]; maxZoom?: number },
): void

export function singlePropertyZoom(): number  // default 14
```

## i18n keys (add to messages)

Prefix: `properties.map.*`

| Key | Purpose |
|-----|---------|
| `properties.map.metaTitle` | SEO title |
| `properties.map.metaDescription` | SEO description |
| `properties.map.pageTitle` | Visible or sr-only h1 |
| `properties.map.filters` | Filters button (may reuse `properties.filters.title`) |
| `properties.map.empty` | No results for filters |
| `properties.map.emptyViewport` | No properties in current view |
| `properties.map.loading` | Map skeleton |
| `properties.map.resultsInView` | `{count}` in panel header |
| `properties.viewOnMap` | Catalog CTA |
| `properties.backToList` | Optional link catalog |

## Design tokens

Spacing, typography, colors from `src/lib/design/tokens.ts` (002). Panel aligns with PropertyCard / catalog sidebar.

## Responsive summary

| Breakpoint | Panel | Filters |
|------------|-------|---------|
| mobile | bottom sheet, collapsible | sheet |
| tablet | left overlay 320px | sheet |
| desktop | left overlay 360px | sheet from panel button |

## Accessibility

- Panel: `role="region"` + `aria-label` from i18n
- Filter sheet: focus trap, return focus to trigger
- Map markers: `title` or `alt` = property title
- `aria-live="polite"` on result count in panel header
- Keyboard: list navigable; Enter opens detail

## Manual test scenarios

1. Open `/ru/properties/map` — map full screen, no footer, markers visible
2. Pan map — panel list updates to viewport objects
3. Open filters on map — same fields as catalog; apply city filter — markers reduce
4. From catalog with filters → «Посмотреть на карте» — same filters, all markers in view
5. Zoom out in dense area — clusters with counts; click cluster — zoom in
6. Repeat on `/ka/` and `/en/`
7. Mobile 320px — collapse panel, use filters, open property detail
