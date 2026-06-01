---
description: "Task list for 004-property-catalog — каталог недвижимости GPI"
---

# Tasks: Каталог недвижимости

**Input**: Design documents from `/specs/004-property-catalog/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: ОБЯЗАТЕЛЬНЫ (конституция GPI, принцип IV; plan.md — Vitest + Playwright)

**Organization**: Задачи сгруппированы по user story для независимой реализации и тестирования.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Можно выполнять параллельно (разные файлы, нет зависимостей)
- **[Story]**: User story из spec.md (US1–US4)

## Path Conventions

Монорепозиторий Payload CMS 3 + Next.js — см. [plan.md](./plan.md). Коллекция `properties`, маршруты `src/app/(frontend)/[locale]/properties/`.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Зависимости Leaflet, словари, i18n, утилиты фильтрации

- [X] T001 Установить `leaflet`, `react-leaflet` и `@types/leaflet` (dev) в `package.json` (research.md §12)
- [X] T002 [P] Создать `src/lib/properties/dictionaries.ts` и `src/lib/properties/types.ts` — коды справочников из spec FR-004 (contracts/cms-properties-collection.md)
- [X] T003 [P] Создать `src/lib/properties/labels.ts` и `src/lib/properties/formatPrice.ts` — подписи по locale, формат USD/GEL
- [X] T004 [P] Добавить ключи `properties.*` (каталог, фильтры, сортировка, контакты, словари) в `src/lib/i18n/messages/ru.json`, `ka.json`, `en.json` (contracts/catalog-ui.md)
- [X] T005 [P] Создать `src/lib/properties/filters.ts` — pure `filterProperties` / `sortProperties` + типы query params (contracts/public-routes.md)
- [X] T006 [P] Unit-тесты `filters.ts` и `labels.ts` в `tests/unit/lib/properties/filters.test.ts` и `labels.test.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Коллекция `properties`, hooks, queries, типы — MUST до user stories

**⚠️ CRITICAL**: User story work не начинается до завершения этой фазы

- [X] T007 Создать `src/collections/Properties/index.ts` — поля по `data-model.md` и `contracts/cms-properties-collection.md` (photos: `upload` → `media`, `listingStatus`, drafts)
- [X] T008 Создать `src/hooks/validatePropertyPublish.ts` — unique `objectCode`, publish rules, alt на media, координаты Грузии (FR-008, data-model.md)
- [X] T009 Создать `src/collections/Properties/hooks/revalidateProperty.ts` — revalidate catalog + detail + sitemap paths ru/ka/en
- [X] T010 Подключить `Properties` в `src/payload.config.ts` (collections array)
- [X] T011 Выполнить `npm run db:push` и `npm run generate:types` — обновить `src/payload-types.ts`
- [X] T012 [P] Создать `src/lib/payload/queries/properties.ts` — `getActiveProperties`, `getPropertyByCode`, `getPropertyStaticParams`
- [X] T013 [P] Integration-тест коллекции в `tests/integration/properties-collection.test.ts` — duplicate objectCode, publish validation
- [X] T014 [P] Unit-тест `validatePropertyPublish` в `tests/unit/hooks/validatePropertyPublish.test.ts`

**Checkpoint**: Foundation ready — схема CMS, типы и queries доступны

---

## Phase 3: User Story 1 — Управление объектами в панели контента (Priority: P1) 🎯 MVP

**Goal**: Менеджер создаёт/редактирует объекты с полной моделью, загружает фото в медиатеку, публикует на трёх языках

**Independent Test**: Admin → Properties → объект `1037` со всеми полями и 2+ фото → publish ru/ka/en; дубликат objectCode → ошибка

### Tests for User Story 1 (ОБЯЗАТЕЛЬНО)

> **NOTE: Написать тесты ПЕРВЫМИ, убедиться что они FAIL до реализации**

- [X] T015 [P] [US1] Расширить `tests/integration/properties-collection.test.ts` — publish block без title ka, success с полным набором полей
- [X] T016 [P] [US1] Unit-тесты граничных случаев `validatePropertyPublish` в `tests/unit/hooks/validatePropertyPublish.test.ts`

### Implementation for User Story 1

- [X] T017 [US1] Русские labels, descriptions и tabs (Основное / Локация / Характеристики / Медиа / SEO) в `src/collections/Properties/index.ts`
- [X] T018 [US1] Подключить `beforeChange`: `validatePropertyPublish` и SEO plugin fields в `src/collections/Properties/index.ts`
- [X] T019 [US1] `admin.defaultColumns`, `useAsTitle`, `preview` / `livePreview` URL для properties в `src/collections/Properties/index.ts`
- [X] T020 [P] [US1] Создать `src/endpoints/seed/properties.ts` — демо-объект `1037` (Batumi) с загрузкой изображений в Media (не URL Drive)
- [X] T021 [US1] Подключить seed properties в `src/endpoints/seed/index.ts` (или общий seed runner)
- [X] T022 [US1] Документировать шаги Admin в `specs/004-property-catalog/quickstart.md` (секция Admin)

**Checkpoint**: User Story 1 — CRUD и публикация объектов в админке

---

## Phase 4: User Story 2 — Просмотр каталога на сайте (Priority: P2)

**Goal**: Посетитель видит список активных объектов, фильтрует и сортирует на `/{locale}/properties`

**Independent Test**: 3+ опубликованных объекта → `/ru/properties` — карточки, фильтр по городу, пустое состояние при нуле результатов

### Tests for User Story 2 (ОБЯЗАТЕЛЬНО)

- [X] T023 [P] [US2] Integration-тест сборки каталога в `tests/integration/properties-catalog-page.test.ts` — только active+published
- [X] T024 [P] [US2] E2E smoke каталога в `tests/e2e/property-catalog.spec.ts` — список, фильтр city, empty state

### Implementation for User Story 2

- [X] T025 [P] [US2] Создать `src/components/properties/PropertyCard.tsx` — превью Media, цены, локация, ссылка на detail
- [X] T026 [P] [US2] Создать `src/components/properties/PropertyFilters.tsx` — фильтры + sort, touch ≥44px, `aria-live` (contracts/catalog-ui.md)
- [X] T027 [US2] Создать `src/app/(frontend)/[locale]/properties/page.tsx` — SSG, `getActiveProperties`, optional `getPageBySlug('properties')`, `generateMetadata`
- [X] T028 [US2] Создать `src/app/(frontend)/[locale]/properties/page.client.tsx` — фильтрация, URL sync, client pagination >24
- [X] T029 [P] [US2] Создать `src/components/properties/PropertyCatalogGrid.tsx` — сетка + empty state с reset filters
- [X] T030 [US2] Seed или обновить `pages` slug `properties` для hero каталога в `src/endpoints/seed/` (по аналогии с blog)
- [X] T031 [US2] Добавить placeholder изображения каталога в `public/images/` при отсутствии фото (edge case spec)

**Checkpoint**: User Story 2 — публичный каталог с фильтрами

---

## Phase 5: User Story 3 — Карточка объекта и карта (Priority: P3)

**Goal**: Детальная страница с галереей, характеристиками, контактами и Leaflet-картой

**Independent Test**: `/ru/properties/1037` — галерея, specs, Telegram; карта при lat/lng; 404 для inactive

### Tests for User Story 3 (ОБЯЗАТЕЛЬНО)

- [X] T032 [P] [US3] Integration `generateStaticParams` + `notFound` в `tests/integration/properties-detail-page.test.ts`
- [X] T033 [US3] E2E detail + map marker в `tests/e2e/property-catalog.spec.ts` — `/ru/properties/1037`

### Implementation for User Story 3

- [X] T034 [P] [US3] Создать `src/components/properties/PropertyGallery.tsx` — без autoplay, reduced motion, `ImageMedia`, placeholder (contracts/catalog-ui.md)
- [X] T035 [P] [US3] Создать `src/components/properties/PropertySpecs.tsx` и `PropertyFeatures.tsx` — словари через `labels.ts`
- [X] T036 [P] [US3] Создать `src/components/properties/PropertyContactLinks.tsx` — telegram/crm/drive только если заполнены
- [X] T037 [US3] Создать `src/components/properties/PropertyMap.tsx` — dynamic import `react-leaflet`, OSM tiles, `scrollWheelZoom: false` до focus (research.md §8)
- [X] T038 [US3] Создать `src/app/(frontend)/[locale]/properties/[objectCode]/page.tsx` — SSG, `generateStaticParams`, `notFound`, metadata
- [X] T039 [US3] Создать `src/app/(frontend)/[locale]/properties/[objectCode]/page.client.tsx` — обёртка gallery при необходимости
- [X] T040 [US3] Импорт `leaflet/dist/leaflet.css` в client-компоненте карты; `priority` на первое фото detail (plan.md PageSpeed)

**Checkpoint**: User Story 3 — детальная карточка и карта

---

## Phase 6: User Story 4 — SEO и обнаруживаемость (Priority: P4)

**Goal**: Метаданные, OG, JSON-LD, sitemap для каталога и объектов; hreflang на трёх языках

**Independent Test**: Rich Results / view-source — `Product`+`Offer` на detail; `ItemList` на catalog; inactive → 404 + noindex policy

### Tests for User Story 4 (ОБЯЗАТЕЛЬНО)

- [X] T041 [P] [US4] Unit-тест JSON-LD builders в `tests/unit/lib/seo/propertyJsonLd.test.ts`
- [X] T042 [US4] E2E проверка `title`/`canonical` на catalog и detail в `tests/e2e/property-catalog.spec.ts` (@ru, @ka, @en)

### Implementation for User Story 4

- [X] T043 [P] [US4] Создать `src/lib/seo/propertyJsonLd.ts` — `productOfferJsonLd`, `catalogItemListJsonLd` (contracts/public-routes.md)
- [X] T044 [US4] Встроить JSON-LD в `src/app/(frontend)/[locale]/properties/page.tsx` и `[objectCode]/page.tsx`
- [X] T045 [US4] Доработать `generateMetadata` — OG image из первого Media, hreflang alternates (FR-014)
- [X] T046 [US4] Создать `src/app/(frontend)/(sitemaps)/properties-sitemap.xml/route.ts` — active properties × locales
- [X] T047 [US4] Подключить properties sitemap в `next-sitemap.config.cjs` при необходимости

**Checkpoint**: User Story 4 — SEO/GEO для каталога

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Навигация, локали, адаптив, производительность, финальная проверка

- [X] T048 [P] E2E каталог и detail на `/ka` и `/en` в `tests/e2e/property-catalog.spec.ts`
- [X] T049 [P] E2E mobile 320px: фильтры, карточки, без horizontal scroll в `tests/e2e/property-catalog.spec.ts`
- [X] T050 [P] Проверить один `h1` на catalog и detail; alt из Media на всех img в `PropertyCard` / `PropertyGallery`
- [X] T051 [P] Добавить пункт «Каталог» в seed header (`src/endpoints/seed/`) → `/{locale}/properties`
- [X] T052 Запустить `npm run test:unit`, `npm run test:integration`, `npm run test:e2e -- tests/e2e/property-catalog.spec.ts` — все green
- [X] T053 Выполнить чеклист `specs/004-property-catalog/quickstart.md` (Lighthouse mobile `/ru/properties` и detail ≥ 90 — ручная проверка)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: без зависимостей
- **Foundational (Phase 2)**: после Setup — **блокирует** все user stories
- **US1 (Phase 3)**: после Phase 2 — **MVP** для контент-команды
- **US2 (Phase 4)**: после Phase 2; желательно после T020–T021 (seed) для E2E
- **US3 (Phase 5)**: после US2 (ссылки из каталога) или параллельно после T012 с seed
- **US4 (Phase 6)**: после US2–US3 (страницы существуют)
- **Polish (Phase 7)**: после US1–US4

### User Story Dependencies

| Story | Зависит от | Независимый тест |
|-------|------------|------------------|
| US1 | Phase 2 | Admin: create/publish property 1037 |
| US2 | Phase 2 (+ seed) | `/ru/properties` + фильтры |
| US3 | Phase 2 (+ seed) | `/ru/properties/1037` + карта |
| US4 | US2, US3 routes | meta + JSON-LD в HTML |

### Parallel Opportunities

- Phase 1: T002–T006 параллельно после T001
- Phase 2: T012–T014 параллельно после T011
- US1: T015–T016 параллельно; T020 параллельно с T017–T019 после T011
- US2: T023–T025 параллельно; T025–T026 параллельно
- US3: T034–T036 параллельно
- US4: T041, T043 параллельно
- Polish: T048–T051 параллельно

### Parallel Example: User Story 2

```bash
# Тесты (после T012, seed):
tests/integration/properties-catalog-page.test.ts
tests/e2e/property-catalog.spec.ts

# Компоненты:
src/components/properties/PropertyCard.tsx
src/components/properties/PropertyFilters.tsx
# затем page.tsx + page.client.tsx
```

---

## Implementation Strategy

### MVP First (User Story 1)

1. Phase 1 Setup  
2. Phase 2 Foundational  
3. Phase 3 US1 (+ seed T020–T021)  
4. **STOP**: Admin publish + integration tests green  
5. Добавить US2 → US3 → US4 → Polish

### Incremental Delivery

1. Setup + Foundational → schema ready  
2. US1 → менеджеры наполняют каталог  
3. US2 → публичный список  
4. US3 → деталь + карта  
5. US4 → SEO + sitemap  
6. Polish → 3 locales, mobile, PageSpeed

### Suggested MVP scope

**US1 only** (T001–T022): коллекция `properties`, валидация, seed с медиа — контент-менеджмент без публичных страниц.

**MVP для посетителей**: US1 + US2 + US3 (T001–T040) — каталог и карточки без отдельной SEO-фазы (минимальные meta из title в page.tsx).

---

## Notes

- Фото **только** через медиатеку (clarify 2026-06-01); `driveFolderUrl` — ссылка на материалы, не галерея
- `objectCode` в URL не локализуется
- После T011 обязательно `generate:types` перед UI
- Leaflet — только client island на detail (принцип II)
- CRM/API import — out of scope v1
