# Quickstart: 007-properties-map

**Feature**: Карта каталога недвижимости  
**Branch**: `007-properties-map`

## Prerequisites

- Фичи **004-property-catalog** и **006-content-map** реализованы (или в той же ветке)
- PostgreSQL + seed с объектами, у которых есть `lat`/`lng`
- Node.js 20+, `npm install`

## Setup

```bash
git checkout 007-properties-map
npm install
npm install leaflet.markercluster
npm install -D @types/leaflet.markercluster
npm run db:push
npm run seed   # если нужны demo objects
npm run dev
```

## Key URLs

| URL | Описание |
|-----|----------|
| http://localhost:3000/ru/properties | Каталог |
| http://localhost:3000/ru/properties/map | Полноэкранная карта |
| http://localhost:3000/ru/properties/map?city=Tbilisi | Карта с фильтром |

## Implementation smoke checklist

- [x] Footer отсутствует на `/properties/map`, Header на месте
- [x] Карта на всю высоту под header
- [x] Метки активных объектов с координатами
- [x] Левая/bottom панель — объекты в viewport
- [x] Кнопка «Фильтры» открывает те же поля, что каталог
- [x] «Посмотреть на карте» в каталоге переносит query params
- [x] fitBounds при переходе из каталога
- [x] Кластеры при zoom out (leaflet.markercluster; dense seed via `SEED_MAP_DENSITY=1`)
- [x] ru / ka / en

## PageSpeed notes

- Map route uses dynamic import for Leaflet + markercluster (client-only chunk).
- Catalog route `/properties` does not import map components.
- Manual Lighthouse check recommended before merge: `/ru/properties/map`, `/ru/properties`.

## Tests

```bash
# Unit
npm run test:unit -- tests/unit/lib/maps/bounds.test.ts
npm run test:unit -- tests/unit/lib/properties/filterCatalogMapParity.test.ts

# E2E (dev server running or webServer in playwright.config)
npm run test:e2e -- tests/e2e/properties-map.spec.ts
```

## Files to touch (reference)

| Area | Path |
|------|------|
| Route | `src/app/(frontend)/[locale]/properties/map/page.tsx` |
| Client page | `src/app/(frontend)/[locale]/properties/map/page.client.tsx` |
| Map components | `src/components/maps/PropertiesMap*.tsx` |
| Bounds utils | `src/lib/maps/bounds.ts` |
| Filters | `src/components/properties/PropertyFilters.tsx` |
| Catalog CTA | `src/app/(frontend)/[locale]/properties/page.client.tsx` |
| Footer hide | `src/Footer/Component.tsx` |
| i18n | `src/lib/i18n/messages/{ru,ka,en}.json` |
| Revalidate | `src/collections/Properties/hooks/revalidateProperty.ts` |

## PageSpeed

После реализации проверить Lighthouse mobile на:
- `/ru/properties/map`
- `/ru/properties` (regression — карта не должна грузиться)

Target: ≥ 90 mobile/desktop.

## Next step

```bash
/speckit-tasks
```
