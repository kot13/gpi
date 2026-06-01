# Contract: Public Routes — Property Catalog

**Feature**: 004-property-catalog  
**Date**: 2026-06-01

## Routes

| Route | File | Rendering |
|-------|------|-----------|
| `/{locale}/properties` | `[locale]/properties/page.tsx` | SSG + ISR 600 |
| `/{locale}/properties/{objectCode}` | `[locale]/properties/[objectCode]/page.tsx` | SSG + ISR 600 |

**Locales**: `ru`, `ka`, `en` — invalid locale → `notFound()`.

## Catalog page (`page.tsx`)

**Server**:
- `getPageBySlug('properties', locale)` — optional hero (как blog)
- `getActiveProperties(locale)` — full list for client filters
- `generateMetadata` from page doc or fallback i18n keys

**Client** (`page.client.tsx`):
- Parse `searchParams`: `city`, `district`, `minUsd`, `maxUsd`, `minGel`, `maxGel`, `rooms`, `layout`, `condition`, `features` (comma-separated), `readiness`, `sort` (`updatedAt-desc` \| `priceUsd-asc` \| `priceUsd-desc`)
- Filter/sort via `filterProperties(list, params)` pure function
- Paginate client-side if `length > 24`
- Update URL without full navigation (`router.replace`)

## Detail page (`[objectCode]/page.tsx`)

**Server**:
- `getPropertyByCode(objectCode, locale)` — if null or not public → `notFound()`
- `generateStaticParams`: cross product active codes (locale in layout, param only `objectCode`)

**Metadata**:
- `title`: meta.title ?? property.title
- `description`: meta.description ?? truncated description
- `openGraph.images`: meta.image ?? first photo from media gallery
- `alternates.languages`: ru/ka/en URLs same objectCode

**Client**:
- `PropertyGallery` — keyboard nav, reduced motion
- `PropertyMap` — dynamic import, ssr: false

## JSON-LD

**Catalog**: `CollectionPage` + `ItemList` (name + url per item).

**Detail**: `Product` + `Offer` (priceCurrency USD primary, optional second Offer GEL); `geo` if lat/lng.

Implement in `src/lib/seo/propertyJsonLd.ts`.

## Sitemap

New route: `(sitemaps)/properties-sitemap.xml/route.ts`

- Include only `published` + `active` properties
- All locales × objectCode

## hreflang

Reuse `generateMeta` / layout patterns from pages and posts.

## 404 policy

- Unknown `objectCode` → 404
- `inactive` or draft → 404 (not cached stale HTML)

## Revalidation

On property change, revalidate:
- `/ru/properties`, `/ka/properties`, `/en/properties`
- `/ru/properties/{code}`, etc.
- sitemap route
