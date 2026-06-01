# Contract: Catalog UI — Property Components

**Feature**: 004-property-catalog  
**Date**: 2026-06-01

## Component tree

```
properties/page.tsx
├── RenderHero? (from pages slug properties)
├── PropertyFilters (client)
├── PropertyGrid
│   └── PropertyCard × N
└── PropertyEmptyState

properties/[objectCode]/page.tsx
├── PropertyGallery (client)
├── PropertyHeader (title, prices, updatedAt)
├── PropertySpecs (characteristics + dictionary labels)
├── PropertyFeatures (chips)
├── PropertyDescription
├── PropertyMap (client, dynamic)
└── PropertyContactLinks
```

## PropertyCard

**Displays**: first photo or placeholder; `title`; city + district labels; `priceUsd` + `priceGel`; `area`, `rooms`, `layout` label; link to detail.

**A11y**: entire card or title link focusable; alt = title.

## PropertyFilters

**Controls** (min touch 44px):
- City: select
- District: text or select from distinct values in dataset
- Price USD: min/max range inputs
- Rooms: select
- Layout, condition, readiness: multi/single select
- Features: multi checkbox group
- Sort: select
- Reset button

**Behavior**: debounce 300ms on text inputs; sync to URL; announce result count for screen readers (`aria-live="polite"`).

## PropertyGallery

- Main image + thumbnails
- No autoplay (spec edge case reduced motion)
- Broken image → placeholder per slide
- Images from Media collection via `next/image` / `ImageMedia` (локальные URL медиатеки)

## PropertyMap

```typescript
// PropertyMap.tsx — contract
'use client'
// dynamic import react-leaflet MapContainer, TileLayer, Marker
// Props: { lat: number; lng: number; label?: string }
// If invalid coords: return null
// Attribution: © OpenStreetMap contributors
// scrollWheelZoom: false until focus
```

**Bundle**: only loaded on detail route chunk.

## PropertyContactLinks

| Field | UI |
|-------|-----|
| `telegramUrl` | Button «Telegram» if set |
| `crmUrl` | Button «CRM» if set |
| `driveFolderUrl` | Link «Материалы» / i18n key if set |

External links: `rel="noopener noreferrer"`, `target="_blank"`.

## i18n keys (add to messages)

Prefix: `properties.*`

Examples:
- `properties.catalogTitle`
- `properties.empty`
- `properties.filters.reset`
- `properties.sort.updatedAtDesc`
- `properties.contact.telegram`
- `properties.map.unavailable`
- Dictionary keys: `properties.city.Tbilisi`, `properties.feature.sea_view`, etc.

## Design tokens

Use spacing, typography, colors from `src/lib/design/tokens.ts` (фича 002). Cards align with blog list density.

## Responsive

| Breakpoint | Grid cols | Filters |
|------------|-----------|---------|
| mobile | 1 | drawer / collapsible |
| tablet | 2 | top bar |
| desktop | 3 | sidebar sticky |

## E2E scenarios (Playwright)

1. Catalog lists seeded property on `/ru/properties`
2. Filter by city Batumi → only Batumi cards
3. Open detail `/ru/properties/1037` — title visible
4. Map container visible when coords set
5. Switch locale to `/ka/properties/1037` — localized title
6. Inactive property URL → 404
