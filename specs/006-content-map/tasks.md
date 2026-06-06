---
description: "Task list for 006-content-map — интерактивная карта в контенте страниц GPI"
---

# Tasks: Интерактивная карта в контенте страниц

**Input**: Design documents from `/specs/006-content-map/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: ОБЯЗАТЕЛЬНЫ (конституция GPI, принцип IV; plan.md — Vitest + Playwright)

**Organization**: Задачи сгруппированы по user story для независимой реализации и тестирования.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Можно выполнять параллельно (разные файлы, нет зависимостей)
- **[Story]**: User story из spec.md (US1–US3)

## Path Conventions

Монорепозиторий Payload CMS 3 + Next.js — см. [plan.md](./plan.md). Блок `mapBlock` в `pages.layout`; UI в `src/blocks/MapBlock/`, `src/components/maps/`; lib в `src/lib/maps/`.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Ассеты Leaflet, lib/maps, i18n

- [X] T001 Скопировать иконки маркера Leaflet из `node_modules/leaflet/dist/images/` в `public/leaflet/` (plan.md §Implementation Notes #3)
- [X] T002 [P] Создать `src/lib/maps/constants.ts` — `DEFAULT_CENTER_GE`, `ZOOM_MIN`/`ZOOM_MAX`, пути к `public/leaflet/` (data-model.md, research.md §7)
- [X] T003 [P] Создать `src/lib/maps/validateCoordinates.ts` — lat ∈ [-90,90], lng ∈ [-180,180], парность полей (data-model.md, FR-010)
- [X] T004 [P] Добавить ключи `maps.defaultLabel`, `maps.unavailable` в `src/lib/i18n/messages/ru.json`, `ka.json`, `en.json` (contracts/map-ui.md)
- [X] T005 [P] Unit-тесты `validateCoordinates` в `tests/unit/lib/maps/validateCoordinates.test.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Общий MapInner, схема MapBlock, регистрация в Pages, валидация публикации

**⚠️ CRITICAL**: User story work не начинается до завершения этой фазы

- [X] T006 Извлечь `src/components/maps/MapInner.tsx` из `src/components/properties/PropertyMapInner.tsx` — OSM tiles, zoom prop, self-hosted `L.icon`, `ScrollWheelControl` (research.md §6–7, contracts/map-ui.md)
- [X] T007 Рефакторить `src/components/properties/PropertyMap.tsx` и упростить/удалить `PropertyMapInner.tsx` — использовать общий `MapInner` (plan.md)
- [X] T008 Создать `src/blocks/MapBlock/config.ts` — `layoutVariant`, группа `location` (lat/lng/zoom, `localized: false`), localized title/address/phone/markerLabel, `quickContacts` (data-model.md, contracts/cms-map-block.md)
- [X] T009 Зарегистрировать `MapBlock` в массиве `blocks` в `src/collections/Pages/index.ts` (FR-001)
- [X] T010 Создать `src/blocks/MapBlock/hooks/validateMapBlockOnPublish.ts` — проверка coords в layout при publish (data-model.md, FR-010)
- [X] T011 Подключить `validateMapBlockOnPublish` в цепочку `beforeChange` в `src/collections/Pages/index.ts` (research.md §8)
- [X] T012 Выполнить `npm run db:push` и `npm run generate:types` — обновить `src/payload-types.ts` (MapBlock в union `Page.layout`)
- [X] T013 [P] Добавить заглушку `mapBlock` в `src/blocks/RenderBlocks.tsx` (до реализации Component в US1)
- [X] T014 [P] Integration-тест схемы и регистрации блока в `tests/integration/map-block.test.ts` — MapBlock в Pages config, поля location

**Checkpoint**: Foundation ready — схема блока, типы, общий MapInner, валидация publish

---

## Phase 3: User Story 1 — Просмотр карты на публичной странице (Priority: P1) 🎯 MVP

**Goal**: Посетитель видит интерактивную карту с маркером; компоновка «текст + карта»; fallback с адресом при ошибке/без JS

**Independent Test**: Опубликовать страницу с одним `mapBlock` (seed `map-demo`) → `/ru/...` → маркер, zoom/pan, текст слева на desktop

### Tests for User Story 1 (ОБЯЗАТЕЛЬНО)

> **NOTE: Написать тесты ПЕРВЫМИ, убедиться что они FAIL до реализации**

- [X] T015 [P] [US1] Unit-тест fallback и layout в `tests/unit/components/maps/MapBlock.test.tsx` — нет coords → адрес без MapContainer; `textAndMap` grid (contracts/map-ui.md, FR-013)
- [X] T016 [P] [US1] Расширить `tests/integration/map-block.test.ts` — страница с mapBlock в layout содержит lat/lng в persisted JSON

### Implementation for User Story 1

- [X] T017 [P] [US1] Создать `src/components/maps/MapBlockTextColumn.tsx` — h2 title, address, phone (`tel:` link), `SocialLinks` из `quickContacts` (contracts/map-ui.md, FR-008)
- [X] T018 [P] [US1] Создать `src/components/maps/ContentMap.tsx` — `dynamic(() => import MapInner, { ssr: false })`, loading skeleton, `aria-label` (research.md §6, FR-005, FR-012)
- [X] T019 [US1] Создать `src/blocks/MapBlock/Component.tsx` — server wrapper: `layoutVariant`, text column + ContentMap, fallback при invalid coords (contracts/map-ui.md)
- [X] T020 [US1] Подключить `MapBlock` component в `src/blocks/RenderBlocks.tsx` вместо заглушки (FR-001)
- [X] T021 [US1] Создать `src/endpoints/seed/pages/map-demo.ts` — одна страница с одним mapBlock (координаты Батуми) + подключить в `src/endpoints/seed/index.ts` для dev/E2E US1

**Checkpoint**: User Story 1 — публичная карта с маркером на seed-странице

---

## Phase 4: User Story 2 — Указание точки на карте в панели управления (Priority: P2)

**Goal**: Менеджер добавляет блок «Карта», кликает/перетаскивает маркер; lat/lng синхронизируются с полями; публикация без точки блокируется

**Independent Test**: Admin → Pages → map block → клик по карте → сохранить → lat/lng в полях; publish без coords → ошибка

### Tests for User Story 2 (ОБЯЗАТЕЛЬНО)

- [X] T022 [P] [US2] Расширить `tests/integration/map-block.test.ts` — publish страницы с mapBlock без lat/lng → validation error (FR-010, edge cases spec)

### Implementation for User Story 2

- [X] T023 [US2] Создать `src/blocks/MapBlock/fields/MapPointPicker/index.tsx` — client Leaflet: click map, draggable marker, sync `useField` lat/lng/zoom (contracts/cms-map-block.md, FR-003, FR-004)
- [X] T024 [US2] Добавить UI-поле `mapPicker` в группу `location` в `src/blocks/MapBlock/config.ts` (contracts/cms-map-block.md)
- [X] T025 [US2] Выполнить `npm run generate:importmap` — зарегистрировать `MapPointPicker` в `src/app/(payload)/admin/importMap.js`
- [X] T026 [US2] Русские admin labels, descriptions и default zoom в `src/blocks/MapBlock/config.ts` (принцип I — admin UX на русском)

**Checkpoint**: User Story 2 — интерактивный picker в админке, валидация координат

---

## Phase 5: User Story 3 — Страница контактов с несколькими офисами (Priority: P3)

**Goal**: Страница «Контакты» по макету: hero + два mapBlock (Батуми, Тбилиси), `textAndMap`, телефон, quick contacts

**Independent Test**: `/ru/contacts` → два блока с маркерами и текстами; обновление одного офиса не ломает второй

### Tests for User Story 3 (ОБЯЗАТЕЛЬНО)

- [X] T027 [P] [US3] E2E в `tests/e2e/contacts-map.spec.ts` — два `.leaflet-container`, заголовки городов, маркеры на `/ru/contacts` (spec P3, SC-003)
- [X] T028 [P] [US3] E2E локали `/ka/contacts` и `/en/contacts` — локализованные title/address (FR-009, SC-006)

### Implementation for User Story 3

- [X] T029 [US3] Создать `src/endpoints/seed/pages/contacts.ts` — hero title «Мы работаем…», два mapBlock (Batumi + Tbilisi), phone, quickContacts, coords из data-model.md (plan.md §5)
- [X] T030 [US3] Подключить contacts seed в `src/endpoints/seed/index.ts` и локализовать тексты ru/ka/en (quickstart.md)

**Checkpoint**: User Story 3 — страница контактов по макету на всех локалях

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Адаптив, a11y, производительность, финальная проверка

- [X] T031 [P] E2E mobile 320px в `tests/e2e/contacts-map.spec.ts` — textAndMap stack, без horizontal scroll контентной области (FR-011, SC-003)
- [X] T032 [P] Проверить иерархию заголовков на `/ru/contacts` — один `h1` (hero), города — `h2` в map blocks (принцип V)
- [X] T033 [P] При PageSpeed &lt; 90 на contacts — lazy init второй карты через `IntersectionObserver` в `src/components/maps/ContentMap.tsx` (plan.md §Implementation Notes #6, SC-005)
- [X] T034 Запустить `npm run test:unit`, `npm run test:integration`, `npm run test:e2e -- tests/e2e/contacts-map.spec.ts` — все green
- [ ] T035 Выполнить чеклист `specs/006-content-map/quickstart.md` (Lighthouse mobile `/ru/contacts` ≥ 90 — ручная проверка)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: без зависимостей
- **Foundational (Phase 2)**: после Setup — **блокирует** все user stories
- **US1 (Phase 3)**: после Phase 2 — **MVP для посетителей** (+ T021 seed)
- **US2 (Phase 4)**: после Phase 2; параллельно с US1 после T014 (admin picker не блокирует публичный рендер при seed с coords)
- **US3 (Phase 5)**: после Phase 2; желательно после US1 (рабочий MapBlock component)
- **Polish (Phase 6)**: после US1–US3

### User Story Dependencies

| Story | Зависит от | Независимый тест |
|-------|------------|------------------|
| US1 | Phase 2 (+ T021 seed) | `/ru/...` map-demo — маркер и fallback |
| US2 | Phase 2 | Admin picker + publish validation |
| US3 | Phase 2, US1 Component | `/ru/contacts` — два блока карты |

### Within Each User Story

- Тесты MUST быть написаны и FAIL до реализации
- T006 MapInner до T018 ContentMap и T023 MapPointPicker
- T012 `generate:types` до T019 Component (типы MapBlock)
- T019 Component до T020 RenderBlocks

### Parallel Opportunities

- Phase 1: T002–T005 параллельно после T001
- Phase 2: T013–T014 параллельно после T012
- US1: T015–T016 параллельно; T017–T018 параллельно; затем T019–T021
- US2: T022 параллельно с началом T023 (разные файлы после T022 написан)
- US3: T027–T028 параллельно; T029–T030 последовательно
- Polish: T031–T033 параллельно

### Parallel Example: User Story 1

```bash
# Тесты (после T014):
tests/unit/components/maps/MapBlock.test.tsx
tests/integration/map-block.test.ts

# Компоненты (параллельно):
src/components/maps/MapBlockTextColumn.tsx
src/components/maps/ContentMap.tsx
# затем src/blocks/MapBlock/Component.tsx → RenderBlocks.tsx → seed map-demo
```

---

## Implementation Strategy

### MVP First (User Story 1)

1. Phase 1 Setup
2. Phase 2 Foundational
3. Phase 3 US1 (+ T021 seed)
4. **STOP**: seed + `/ru` — карта с маркером, fallback с адресом
5. Добавить US2 → US3 → Polish

### Incremental Delivery

1. Setup + Foundational → схема mapBlock + MapInner
2. US1 → карта на публичных страницах (MVP)
3. US2 → менеджеры указывают точку в админке
4. US3 → страница контактов по макету
5. Polish → 3 locales, mobile, PageSpeed

### Suggested MVP scope

**US1 only** (T001–T021): один mapBlock на странице, публичный рендер — основная ценность для посетителей.

**Полная фича**: T001–T035 — admin picker, контакты, polish.

---

## Notes

- `leaflet` и `react-leaflet` уже в `package.json` — новых зависимостей не требуется
- Координаты `localized: false`; тексты блока — `localized: true` (research.md §5)
- Карта в rich text постов — out of scope v1 (Assumptions)
- После T025 обязательно `generate:importmap` при изменении MapPointPicker
- Маршруты «Как добраться» — out of scope v1
