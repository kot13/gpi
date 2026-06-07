---
description: "Task list for 007-properties-map — карта каталога недвижимости GPI"
---

# Tasks: Карта каталога недвижимости

**Input**: Design documents from `/specs/007-properties-map/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: ОБЯЗАТЕЛЬНЫ (конституция GPI, принцип IV; plan.md — Vitest + Playwright)

**Organization**: Задачи сгруппированы по user story для независимой реализации и тестирования.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Можно выполнять параллельно (разные файлы, нет зависимостей)
- **[Story]**: User story из spec.md (US1–US3)

## Path Conventions

Монорепозиторий Payload CMS 3 + Next.js — см. [plan.md](./plan.md). Маршрут `src/app/(frontend)/[locale]/properties/map/`; карта в `src/components/maps/`; утилиты bounds в `src/lib/maps/`.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Зависимости, константы, i18n

- [X] T001 Установить `leaflet.markercluster` и `@types/leaflet.markercluster` в `package.json` (research.md §3, quickstart.md)
- [X] T002 [P] Расширить `src/lib/maps/constants.ts` — `MAP_CLUSTER_MAX_RADIUS`, `SINGLE_PROPERTY_ZOOM`, default bounds Georgia (plan.md, contracts/map-page-ui.md)
- [X] T003 [P] Добавить ключи `properties.map.*` и `properties.viewOnMap` в `src/lib/i18n/messages/ru.json`, `ka.json`, `en.json` (contracts/map-page-ui.md)
- [X] T004 [P] Создать `src/lib/maps/mapPropertyPoint.ts` — проекция `PropertyListItem` → `MapPropertyPoint`, фильтр по `validateCoordinates` (data-model.md)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Pure-функции bounds, parity фильтров, скрытие Footer — MUST до user stories

**⚠️ CRITICAL**: User story work не начинается до завершения этой фазы

- [X] T005 Создать `src/lib/maps/bounds.ts` — `isInBounds`, `filterPropertiesInBounds`, `fitBoundsForProperties`, `singlePropertyZoom` (contracts/map-page-ui.md, data-model.md)
- [X] T006 [P] Unit-тесты `src/lib/maps/bounds.ts` в `tests/unit/lib/maps/bounds.test.ts`
- [X] T007 Дополнить `src/lib/properties/filterQuery.ts` — сериализация `features`, `minGel`, `maxGel` (plan.md §Implementation Notes, FR-007)
- [X] T008 [P] Regression-тест parity catalog↔map в `tests/unit/lib/properties/filterCatalogMapParity.test.ts` — parse → build → parse для ≥15 наборов params (SC-005)
- [X] T009 Скрыть `<Footer />` на path `*/properties/map` в `src/Footer/Component.tsx` через `usePathname()` (research.md §2, FR-002)
- [X] T010 [P] Добавить `generatePropertyMapMeta` в `src/utilities/generatePropertyMeta.ts` — title/description из i18n (FR-014, contracts/public-routes.md)

**Checkpoint**: Foundation ready — bounds, filter URL parity, footer policy, metadata helper

---

## Phase 3: User Story 1 — Просмотр объектов на полноэкранной карте (Priority: P1) 🎯 MVP

**Goal**: Полноэкранная карта под Header без Footer; метки активных объектов; overlay-панель со списком объектов в viewport; переход на детальную карточку

**Independent Test**: ≥5 объектов с координатами → `/ru/properties/map` → метки и панель; pan/zoom обновляет список; Footer отсутствует; клик по элементу → detail page

### Tests for User Story 1 (ОБЯЗАТЕЛЬНО)

> **NOTE: Написать тесты ПЕРВЫМИ, убедиться что они FAIL до реализации**

- [X] T011 [P] [US1] Unit-тест `filterPropertiesInBounds` и edge cases (пустой bounds, один объект) в `tests/unit/lib/maps/bounds.test.ts`
- [X] T012 [P] [US1] Unit-тест `toMapPropertyPoints` в `tests/unit/lib/maps/mapPropertyPoint.test.ts` — исключение invalid coords
- [X] T013 [P] [US1] E2E smoke в `tests/e2e/properties-map.spec.ts` — map full screen, no footer, markers visible, panel count changes on pan (ru locale)

### Implementation for User Story 1

- [X] T014 [P] [US1] Создать `src/components/maps/PropertyMapListItem.tsx` — превью, title, city/district, price, link на detail, min touch 44px (FR-005, contracts/map-page-ui.md)
- [X] T015 [P] [US1] Создать `src/components/maps/PropertiesMapPanel.tsx` — overlay left (desktop) / bottom sheet (mobile), scroll list, `aria-live` count header (FR-004, breakpoints plan.md)
- [X] T016 [P] [US1] Создать `src/components/maps/PropertiesMap.tsx` — `dynamic(..., { ssr: false })`, loading skeleton i18n (research.md §7)
- [X] T017 [US1] Создать `src/components/maps/PropertiesMapInner.tsx` — MapContainer, TileLayer OSM, individual Markers, ScrollWheelControl, `onBoundsChange` debounce 200ms, `onSelect` highlight (без кластеров — US3)
- [X] T018 [US1] Создать `src/app/(frontend)/[locale]/properties/map/page.tsx` — `force-static`, `revalidate 600`, `getActiveProperties`, districts, `generateMetadata` via `generatePropertyMapMeta` (contracts/public-routes.md)
- [X] T019 [US1] Создать `src/app/(frontend)/[locale]/properties/map/page.client.tsx` — filter all active→map points, viewport filter для panel, `selectedObjectCode` sync panel↔marker, full-height layout `calc(100dvh - header)` (FR-001–005)
- [X] T020 [US1] Mobile collapse/expand панели в `src/components/maps/PropertiesMapPanel.tsx` — `panelCollapsed` state, drag handle (spec US1 scenario 4, plan breakpoints)
- [X] T021 [P] [US1] RTL unit-тест `PropertiesMapPanel` в `tests/unit/components/maps/PropertiesMapPanel.test.tsx` — empty viewport message, result count

**Checkpoint**: User Story 1 — карта + панель viewport работают без фильтров и без кластеризации

---

## Phase 4: User Story 2 — Фильтрация на карте и переход из каталога (Priority: P2)

**Goal**: Кнопка «Фильтры» на карте (те же поля, что каталог); «Посмотреть на карте» в каталоге с переносом query; fitBounds при загрузке с фильтрами; empty state

**Independent Test**: Каталог `/ru/properties?city=Tbilisi&minUsd=…` → «Посмотреть на карте» → те же params на map → только подходящие метки → все в viewport; фильтры на карте синхронизируют URL

### Tests for User Story 2 (ОБЯЗАТЕЛЬНО)

- [X] T022 [P] [US2] E2E фильтры на карте в `tests/e2e/properties-map.spec.ts` — open sheet, apply city, markers reduce, empty state
- [X] T023 [P] [US2] E2E catalog→map в `tests/e2e/properties-map.spec.ts` — «Посмотреть на карте» preserves query, fitBounds all markers visible
- [X] T024 [P] [US2] Unit-тест `PropertyFilters` с `basePath` map route в `tests/unit/components/properties/PropertyFilters.test.tsx`

### Implementation for User Story 2

- [X] T025 [US2] Расширить `src/components/properties/PropertyFilters.tsx` — props `basePath`, `presentation: 'sidebar' | 'sheet'`, `open`/`onOpenChange`; submit → `router.replace` на basePath (research.md §6, FR-006)
- [X] T026 [US2] Кнопка «Фильтры» + Sheet с `PropertyFilters` в `src/components/maps/PropertiesMapPanel.tsx` — `basePath=/${locale}/properties/map` (FR-006)
- [X] T027 [US2] URL filter pipeline в `src/app/(frontend)/[locale]/properties/map/page.client.tsx` — `parsePropertyFilterParams` → `filterProperties` → `sortProperties` → markers; порядок panel = sort (FR-007)
- [X] T028 [US2] `fitBoundsForProperties` при mount и смене filtered set в `src/app/(frontend)/[locale]/properties/map/page.client.tsx` — padding под ширину panel desktop (FR-009, SC-002)
- [X] T029 [US2] Empty state при нуле результатов фильтра в `src/app/(frontend)/[locale]/properties/map/page.client.tsx` — i18n `properties.map.empty`, reset filters CTA (FR-012)
- [X] T030 [US2] Кнопка «Посмотреть на карте» в `src/app/(frontend)/[locale]/properties/page.client.tsx` — `Link` с `buildPropertyFilterQuery(params)`, min-h 44px (FR-008, contracts/map-page-ui.md)
- [X] T031 [P] [US2] Ссылка «К списку» / `properties.backToList` в `src/components/maps/PropertiesMapPanel.tsx` → catalog с текущим query (FR-007 scenario 6)

**Checkpoint**: User Stories 1 + 2 — каталог ↔ карта с общими фильтрами и fitBounds

---

## Phase 5: User Story 3 — Кластеризация меток (Priority: P3)

**Goal**: На мелком масштабе близкие метки группируются в кластеры с count; клик по кластеру zoom in; один объект — без кластера

**Independent Test**: 30+ объектов с близкими coords → zoom out → кластеры с числом → click cluster → zoom in → individual markers

### Tests for User Story 3 (ОБЯЗАТЕЛЬНО)

- [X] T032 [P] [US3] E2E кластеризация в `tests/e2e/properties-map.spec.ts` — cluster visible at low zoom, click expands (requires seed density or test fixture)
- [X] T033 [P] [US3] Опциональный seed ≥30 объектов в `src/endpoints/seed/properties-map-density.ts` + hook в `src/endpoints/seed/index.ts` для dev/E2E cluster (data-model.md, quickstart.md)

### Implementation for User Story 3

- [X] T034 [US3] Интегрировать `leaflet.markercluster` в `src/components/maps/PropertiesMapInner.tsx` — `MarkerClusterGroup`, `zoomToBoundsOnClick`, count on cluster (FR-010–011, research.md §3)
- [X] T035 [US3] Импорт `leaflet.markercluster/dist/MarkerCluster.css` и `MarkerCluster.Default.css` в `src/components/maps/PropertiesMap.tsx` client chunk only (plan.md §Implementation Notes)
- [X] T036 [US3] Применить `MAP_CLUSTER_MAX_RADIUS` из `src/lib/maps/constants.ts` в `PropertiesMapInner.tsx`; single-marker path без cluster artifact (US3 scenario 4)

**Checkpoint**: Все три user story независимо тестируемы; кластеризация на dense datasets

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Revalidation, SEO, locales, performance, quickstart

- [X] T037 [P] Добавить `/{locale}/properties/map` в revalidate paths в `src/collections/Properties/hooks/revalidateProperty.ts` для ru/ka/en (contracts/public-routes.md)
- [X] T038 [P] Integration-тест static map route в `tests/integration/properties-map-route.test.ts` — page exports `force-static`, metadata keys present
- [X] T039 [P] E2E три локали `/ka/properties/map`, `/en/properties/map` в `tests/e2e/properties-map.spec.ts` (принцип VIII)
- [X] T040 [P] E2E mobile viewport 320px — panel collapse, filters sheet в `tests/e2e/properties-map.spec.ts` (принцип IX, SC-006)
- [X] T041 [P] SEO: sr-only или visible h1 `properties.map.pageTitle` на map page в `src/app/(frontend)/[locale]/properties/map/page.client.tsx` (FR-014)
- [X] T042 [P] Проверка PageSpeed ≥ 90 mobile/desktop на `/ru/properties/map` и regression `/ru/properties` без Leaflet chunk — задокументировать в `specs/007-properties-map/quickstart.md` (принцип VI)
- [X] T043 Прогнать smoke checklist из `specs/007-properties-map/quickstart.md` и отметить выполненные пункты

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Setup — **BLOCKS all user stories**
- **User Story 1 (Phase 3)**: Depends on Foundational — MVP, no US2/US3 required
- **User Story 2 (Phase 4)**: Depends on Foundational + US1 page shell (panel, map route)
- **User Story 3 (Phase 5)**: Depends on Foundational + US1 `PropertiesMapInner` (extends with cluster layer)
- **Polish (Phase 6)**: Depends on US1–US3 (or US1+US2 minimum for release)

### User Story Dependencies

| Story | Depends on | Independent test |
|-------|------------|------------------|
| US1 (P1) | Phase 2 | Map + panel viewport, no filters CTA |
| US2 (P2) | US1 route/components | Catalog↔map filters + fitBounds |
| US3 (P3) | US1 PropertiesMapInner | Clusters at low zoom |

### Within Each User Story

- Tests FIRST (fail before impl)
- Lib/helpers before components
- Components before page.client orchestration
- Server page.tsx after client contract clear

### Parallel Opportunities

- **Phase 1**: T002, T003, T004 parallel after T001
- **Phase 2**: T006, T008, T010 parallel after T005/T007
- **US1**: T011–T014 parallel; T015–T016 parallel; T018–T019 sequential after map components
- **US2**: T022–T024 parallel; T025 before T026–T031
- **US3**: T032–T033 parallel; T034–T036 sequential
- **Polish**: T037–T042 all parallel

---

## Parallel Example: User Story 1

```bash
# Tests together:
T011 bounds viewport tests
T012 mapPropertyPoint tests
T013 E2E smoke

# Components together (after T005–T010):
T014 PropertyMapListItem
T015 PropertiesMapPanel
T016 PropertiesMap wrapper
```

---

## Parallel Example: User Story 2

```bash
# After US1 checkpoint:
T022 E2E map filters
T023 E2E catalog→map
T024 PropertyFilters unit test

# Then:
T025 PropertyFilters sheet mode → T026 panel filters button → T027–T029 page.client
T030 catalog CTA (parallel file: page.client.tsx catalog)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (**CRITICAL**)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: `/ru/properties/map` — map, panel, no footer, detail links
5. Demo/deploy MVP

### Incremental Delivery

1. Setup + Foundational → foundation ready
2. US1 → полноэкранная карта с панелью (MVP)
3. US2 → фильтры + связка с каталогом
4. US3 → кластеризация для масштаба
5. Polish → SEO, revalidation, PageSpeed, 3 locales

### Parallel Team Strategy

1. Team: Phase 1 + 2 together
2. After Phase 2:
   - Dev A: US1 (map + panel)
   - Dev B: US2 (PropertyFilters + catalog CTA) — starts after US1 page shell (~T018)
   - Dev C: US3 (markercluster) — starts after T017 PropertiesMapInner exists
3. Polish together after stories merge

---

## Notes

- Новых коллекций Payload CMS **нет** — Phase 2 не включает db:push
- Кластеризация (US3) intentionally после US1 individual markers — меньший diff для MVP review
- Переиспользовать OSM tiles и scroll-wheel guard из `src/components/maps/MapInner.tsx` / `src/lib/maps/constants.ts`
- Не грузить Leaflet на `/properties` catalog — только dynamic import на map route (принцип VI)
- Commit после каждой фазы или логической группы задач
