# Implementation Plan: Карта каталога недвижимости

**Branch**: `007-properties-map` | **Date**: 2026-06-07 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/007-properties-map/spec.md`

## Summary

Добавить полноэкранную страницу **`/{locale}/properties/map`**: интерактивная карта всех активных объектов с координатами, левая overlay-панель со списком объектов в текущем viewport, кнопка «Фильтры» (переиспользование `PropertyFilters`), кластеризация меток на мелком масштабе, автоподбор bounds при переходе из каталога. В каталоге — кнопка «Посмотреть на карте» с переносом `searchParams`. Подвал скрыт на странице карты; верхняя навигация сохраняется.

Технический подход: SSG (`force-static`, `revalidate` 600) + серверная загрузка `getActiveProperties(locale)`; client island для Leaflet (multi-marker + `leaflet.markercluster`), фильтрации in-memory, синхронизации URL и viewport-списка. Переиспользование `MapInner`/констант OSM из фичи 006; общие pure-функции `filterProperties`, `parsePropertyFilterParams`, `buildPropertyFilterQuery` из `src/lib/properties/`.

## Technical Context

**Language/Version**: TypeScript 5.8 / Node.js 20 LTS / Next.js 15.3 App Router / React 19 / Payload CMS 3.85

**Primary Dependencies**: `leaflet` ^1.9.4, `react-leaflet` ^5.0.0 (в проекте); **`leaflet.markercluster`** + CSS (новая зависимость); существующие `PropertyFilters`, `PropertyCard`, `MapInner`, `lib/maps/constants`, `lib/properties/filters`

**Storage**: PostgreSQL — без новых коллекций; данные из существующей `properties`

**Testing**: Vitest + RTL (bounds, viewport filter, fitBounds helper); unit regression filters catalog↔map; Playwright E2E (map page, filters sync, «Посмотреть на карте», cluster smoke, 3 locales, mobile panel)

**Target Platform**: SSG/ISR — маршрут карты статический; Leaflet + кластеры + панель — client-only island (`dynamic`, `ssr: false`)

**Project Type**: Frontend route + shared map components + расширение catalog UI

**Performance Goals**: PageSpeed ≥ 90 на `/properties/map`; dynamic import Leaflet + markercluster; debounce viewport list 150–300 ms; fitBounds только на init и смене фильтров

**Constraints**: ru/ka/en; те же filter searchParams, что каталог; touch ≥ 44px; без SSR для карты; подвал скрыт только на map route

**Scale/Scope**: 1 новый маршрут, ~6–8 компонентов, refactor Footer (conditional), кнопка в catalog, 3 user stories; без изменений CMS schema

### Breakpoints (конституция IX)

| Имя | Диапазон | Tailwind | Поведение страницы карты |
|-----|----------|----------|--------------------------|
| mobile | 320–767px | default | Панель — bottom sheet или collapsible drawer (~40% высоты); кнопка «Фильтры» в панели; карта под/за панелью |
| tablet | 768–979px | `md:` | Панель слева фикс. ширина ~320px, overlay на карте |
| desktop | 980–1919px | `lg:` | Панель слева ~360px; карта full bleed |
| wide | 1920px+ | `xl:` | max-width панели; карта на всю ширину viewport |

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **I. Русский язык**: spec, plan, contracts, research на русском
- [x] **II. Статика**: `dynamic = 'force-static'`; properties на build/ISR; client island для Leaflet/кластеров/панели
- [x] **III. Best practices**: переиспользование PropertyFilters, filters.ts, MapInner/constants; Next.js nested route + dynamic import
- [x] **IV. Тесты**: unit (bounds, viewport) + E2E (map, filters sync, locales) в quickstart/tasks
- [x] **V. SEO/GEO**: generateMetadata для map page; один скрытый/визуальный h1 или sr-only; hreflang через layout; JSON-LD опционально ItemList
- [x] **VI. PageSpeed**: code-split Leaflet + markercluster; debounce moveend; без загрузки карты на catalog list
- [x] **VII. PostgreSQL**: без новых таблиц; данные из properties
- [x] **VIII. Трёхъязычность**: UI keys `properties.map.*` в ru/ka/en; E2E 3 locales
- [x] **IX. Адаптивность**: mobile-first panel; breakpoints выше; 44px на кнопках фильтров и элементах списка

**Post-design re-check**: Client JS для карты, кластеров и viewport-панели обоснован интерактивом (FR-004–011) при SSG данных с сервера. Скрытие Footer через client wrapper по pathname — минимальное изменение layout без миграции всех маршрутов в route groups (research §2).

## Project Structure

### Documentation (this feature)

```text
specs/007-properties-map/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── map-page-ui.md
│   └── public-routes.md
└── tasks.md              # Phase 2 — /speckit-tasks
```

### Source Code

```text
src/
├── app/(frontend)/[locale]/
│   └── properties/
│       └── map/
│           ├── page.tsx               # SSG server: getActiveProperties, metadata
│           └── page.client.tsx        # map shell + panel + filters
├── components/
│   ├── maps/
│   │   ├── PropertiesMap.tsx          # dynamic wrapper ssr:false
│   │   ├── PropertiesMapInner.tsx     # MapContainer + MarkerClusterGroup
│   │   ├── PropertiesMapPanel.tsx     # overlay list + Filters button
│   │   └── PropertyMapMarker.tsx      # optional highlighted marker
│   └── properties/
│       ├── PropertyFilters.tsx        # + optional variant prop (sidebar | sheet)
│       └── PropertyCatalogGrid.tsx    # + link «Посмотреть на карте»
├── Footer/
│   └── Component.tsx                  # hide on /properties/map (client segment check)
├── lib/
│   ├── maps/
│   │   ├── bounds.ts                  # fitBoundsForProperties, isInBounds
│   │   └── constants.ts               # + MAP_CLUSTER options, default country bounds
│   └── properties/
│       └── filterQuery.ts             # ensure parity with catalog params (features, gel)
└── lib/i18n/messages/
    ├── ru.json                        # properties.map.*
    ├── ka.json
    └── en.json

tests/
├── unit/lib/maps/
│   └── bounds.test.ts
├── unit/lib/properties/
│   └── filterCatalogMapParity.test.ts
└── e2e/
    └── properties-map.spec.ts
```

**Structure Decision**: Отдельный маршрут `properties/map` под существующим каталогом; общая логика фильтров в `lib/properties/`; карта — новые компоненты в `components/maps/`, не расширение single-marker `MapInner` (разная ответственность).

## Complexity Tracking

| Topic | Decision | Simpler Alternative Rejected Because |
|-------|----------|--------------------------------------|
| Client island (Leaflet + cluster) | `dynamic` + `ssr: false` | Leaflet/markercluster требуют DOM |
| Скрытие Footer | Client check pathname `/properties/map` | Nested layout не убирает Footer родителя без route-group split всего `[locale]` |
| markercluster dependency | `leaflet.markercluster` | 50+ меток без кластеров нечитаемы (FR-010, SC-004) |
| In-memory filter + viewport | Pure functions + moveend | SSR по bounds нарушает принцип II и UX (pan/zoom) |

## Phase 0 & 1 Artifacts

| Artifact | Path | Status |
|----------|------|--------|
| Research | [research.md](./research.md) | ✅ |
| Data model | [data-model.md](./data-model.md) | ✅ |
| Public routes | [contracts/public-routes.md](./contracts/public-routes.md) | ✅ |
| Map UI contract | [contracts/map-page-ui.md](./contracts/map-page-ui.md) | ✅ |
| Quickstart | [quickstart.md](./quickstart.md) | ✅ |

## Implementation Notes (для /speckit-tasks)

1. **Порядок**: `lib/maps/bounds.ts` → `PropertiesMapInner` + markercluster → `PropertiesMapPanel` → `page.tsx` + `page.client.tsx` → Footer hide → `PropertyFilters` sheet variant → catalog CTA → i18n → tests
2. **Зависимость**: `npm install leaflet.markercluster` + `@types/leaflet.markercluster`; импорт CSS markercluster в client chunk
3. **fitBounds**: при mount и при изменении filtered set (не на каждый pan); padding учитывает ширину левой панели на desktop
4. **Highlight sync**: hover/selected `objectCode` state shared между panel item и marker icon class
5. **Revalidation**: добавить `/properties/map` в `revalidateProperty` paths (все locales)
6. **filterQuery parity**: дополнить `buildPropertyFilterQuery` полями `features`, `minGel`, `maxGel` если отсутствуют — regression test catalog↔map
