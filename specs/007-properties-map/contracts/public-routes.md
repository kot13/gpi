# Contract: Public Routes — Properties Map

**Feature**: 007-properties-map  
**Date**: 2026-06-07

## Routes

| Route | File | Rendering |
|-------|------|-----------|
| `/{locale}/properties/map` | `[locale]/properties/map/page.tsx` | SSG + ISR 600 |

**Locales**: `ru`, `ka`, `en` — invalid locale → `notFound()`.

**Layout**: наследует `[locale]/layout.tsx` (Header + main); Footer **не рендерится** на этом path (см. map-page-ui.md).

## Map page (`page.tsx`)

**Server**:
- `getActiveProperties(locale)` — полный список активных объектов (как catalog)
- `generateMetadata` — i18n keys `properties.map.metaTitle`, `properties.map.metaDescription`
- `export const dynamic = 'force-static'`
- `export const revalidate = 600`

**Client** (`page.client.tsx`):
- Parse `searchParams` — **идентично catalog** (см. 004 `public-routes.md`)
- `filterProperties` + `sortProperties` → набор меток
- `PropertiesMap` (dynamic, ssr:false) + `PropertiesMapPanel`
- Initial `fitBoundsForProperties` when filtered set changes
- `PropertyFilters` in sheet mode, `basePath=/${locale}/properties/map`

## Query parameters (shared with catalog)

| Param | Type | Notes |
|-------|------|-------|
| `city` | repeated | multi |
| `district` | string | |
| `minUsd`, `maxUsd` | number | |
| `minGel`, `maxGel` | number | |
| `rooms` | number | |
| `layout`, `condition`, `repair`, `heating`, `readiness` | repeated | multi |
| `features` | comma-separated | |
| `sort` | enum | `updatedAt-desc` \| `priceUsd-asc` \| `priceUsd-desc` |

Build link from catalog: `buildPropertyFilterQuery(parsePropertyFilterParams(...))`.

## Catalog → Map navigation

| From | To |
|------|-----|
| `/{locale}/properties?{filters}` | `/{locale}/properties/map?{same filters}` |

Button: `properties.viewOnMap` in catalog client UI.

## Map → Catalog navigation

Filters applied on map update URL on `/properties/map`; link «Список» / breadcrumb → `/{locale}/properties?{same query}`.

## Revalidation

Extend `revalidateProperty` hook paths:
- `/{locale}/properties/map` for `ru`, `ka`, `en`

## Sitemap

Optional: include map URLs in properties section or exclude (utility page) — default **include** with lower priority than catalog.

## 404 policy

- Invalid locale → 404
- Map page always exists (no slug param)

## hreflang

Reuse locale layout `alternates.languages`; map page metadata adds canonical `/{locale}/properties/map`.
