# Implementation Plan: Интерактивная карта в контенте страниц

**Branch**: `006-content-map` | **Date**: 2026-06-06 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/006-content-map/spec.md`

## Summary

Добавить Payload Block **`mapBlock`** в layout страниц: интерактивный выбор точки в админке (Leaflet + react-leaflet, custom `MapPointPicker`), публичный рендер с одним маркером и компоновкой «только карта» / «текст + карта» (макет контактов). Переиспользовать и обобщить существующий `PropertyMapInner`; seed страницы «Контакты» с офисами Батуми и Тбилиси.

Технический подход: координаты `localized: false`; тексты блока — `localized: true`; client island через `dynamic(..., { ssr: false })`; OSM tiles; fallback с адресом для SC-004.

## Technical Context

**Language/Version**: TypeScript 5.8 / Node.js 20 LTS / Next.js 15.3 App Router / React 19 / Payload CMS 3.85

**Primary Dependencies**: `leaflet` ^1.9.4, `react-leaflet` ^5.0.0 (уже в проекте); `@payloadcms/ui` (MapPointPicker); существующие `SocialLinks`, `RenderBlocks`, design tokens GPI

**Storage**: PostgreSQL — координаты и тексты в JSONB `pages.layout` (localized blocks); `npm run db:push` + `generate:types`

**Testing**: Vitest + RTL (`validateCoordinates`, MapBlock fallback); integration (block schema, publish validation); Playwright E2E (contacts maps, 3 locales)

**Target Platform**: SSG/ISR для страниц; карта — client-only island (не SSR)

**Project Type**: Payload block + shared map components + seed

**Performance Goals**: PageSpeed ≥ 90; dynamic import Leaflet; SC-005 — не более −5 пунктов vs страница без карты

**Constraints**: ru/ka/en; lat/lng shared across locales; h2 для title блока; touch ≥ 44px на quick contact icons

**Scale/Scope**: 1 block type, ~6–8 компонентов, refactor PropertyMap, 1 seed page, 3 user stories

### Breakpoints (конституция IX + макет контактов)

| Имя | Диапазон | Tailwind | Поведение MapBlock |
|-----|----------|----------|-------------------|
| mobile | 320–767px | default | textAndMap: stack, текст сверху; карта `h-60` full width |
| tablet | 768–979px | `md:` | textAndMap: 2 колонки; карта `h-80` |
| desktop | 980–1919px | `lg:` | 2 колонки; карта `h-96`; gap увеличен |
| wide | 1920px+ | `xl:` | container max-w как у сайта |

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **I. Русский язык**: spec, plan, contracts, research на русском
- [x] **II. Статика**: страницы SSG/ISR; карта — client island после статического HTML с текстовым fallback; не SSR на запрос
- [x] **III. Best practices**: Payload block pattern; Next.js `dynamic` ssr:false; переиспользование PropertyMap/SocialLinks
- [x] **IV. Тесты**: unit + integration + E2E в quickstart/tasks
- [x] **V. SEO/GEO**: h2 для title блока; адрес в HTML fallback; aria-labels; не ломает h1 страницы
- [x] **VI. PageSpeed**: dynamic Leaflet; scroll-wheel guard; self-hosted marker icons; lazy client chunk
- [x] **VII. PostgreSQL**: данные в pages layout; db:push
- [x] **VIII. Трёхъязычность**: localized title/address/phone/markerLabel; coords shared; E2E ru/ka/en
- [x] **IX. Адаптивность**: mobile-first grid; breakpoints выше; 44px touch на SocialLinks

**Post-design re-check**: Client JS для Leaflet обоснован интерактивом (FR-005) при SSG страницы с серверным текстовым fallback (FR-013). Два MapContainer на странице контактов — допустимо при dynamic import (research §10).

## Project Structure

### Documentation (this feature)

```text
specs/006-content-map/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── cms-map-block.md
│   └── map-ui.md
└── tasks.md              # Phase 2 — /speckit-tasks
```

### Source Code

```text
src/
├── blocks/
│   └── MapBlock/
│       ├── config.ts
│       ├── Component.tsx              # server wrapper
│       ├── hooks/
│       │   └── validateMapBlockOnPublish.ts
│       └── fields/
│           └── MapPointPicker/
│               └── index.tsx          # admin client field
├── components/
│   └── maps/
│       ├── MapInner.tsx               # shared (extract from PropertyMapInner)
│       ├── ContentMap.tsx             # dynamic wrapper
│       └── MapBlockTextColumn.tsx
├── lib/
│   └── maps/
│       ├── validateCoordinates.ts
│       └── constants.ts               # DEFAULT_CENTER_GE, ZOOM_MIN/MAX
├── components/properties/
│   ├── PropertyMap.tsx                # refactor → use MapInner
│   └── PropertyMapInner.tsx           # thin re-export or remove
├── blocks/RenderBlocks.tsx            # + mapBlock
├── collections/Pages/index.ts         # register MapBlock; hook validate
├── lib/i18n/messages/
│   ├── ru.json                        # maps.*
│   ├── ka.json
│   └── en.json
├── endpoints/seed/
│   └── pages/contacts.ts
└── public/leaflet/                    # marker-icon.png, etc.

tests/
├── unit/lib/maps/
│   └── validateCoordinates.test.ts
├── unit/components/maps/
│   └── MapBlock.test.tsx
├── integration/
│   └── map-block.test.ts
└── e2e/
    └── contacts-map.spec.ts
```

**Structure Decision**: Монорепозиторий Payload + Next.js. Один block `mapBlock`; общий `MapInner` для Properties и Content. Admin picker — custom UI field в группе `location`.

## Complexity Tracking

> Нарушений конституции, требующих исключения, нет.

| Topic | Decision | Simpler Alternative Rejected Because |
|-------|----------|--------------------------------------|
| Client island для карты | `dynamic` + `ssr: false` | Leaflet требует DOM; без island нет интерактива |
| Custom MapPointPicker | Leaflet в админке | Только number fields нарушают FR-003 |
| 2 MapContainer на contacts | Независимые блоки | Single-map multi-marker нарушает FR-014 и layout spec |

## Phase 0 & 1 Artifacts

| Artifact | Path | Status |
|----------|------|--------|
| Research | [research.md](./research.md) | ✅ |
| Data model | [data-model.md](./data-model.md) | ✅ |
| CMS contract | [contracts/cms-map-block.md](./contracts/cms-map-block.md) | ✅ |
| UI contract | [contracts/map-ui.md](./contracts/map-ui.md) | ✅ |
| Quickstart | [quickstart.md](./quickstart.md) | ✅ |

## Implementation Notes (для /speckit-tasks)

1. **Порядок**: `lib/maps` → `components/maps/MapInner` + refactor PropertyMap → MapPointPicker → MapBlock config → Component → RenderBlocks + Pages hooks → i18n → seed contacts → tests
2. **importMap**: после добавления `MapPointPicker` — `npm run generate:importmap`
3. **Marker assets**: скопировать из `node_modules/leaflet/dist/images/` в `public/leaflet/`; обновить `L.icon` paths
4. **Publish validation**: расширить `validateLocalizedPublish` или отдельный hook в цепочке `beforeChange` Pages
5. **Contacts hero**: заголовок страницы «Мы работаем…» — в hero tab страницы, не в map block
6. **PageSpeed**: при fail SC-005 рассмотреть `IntersectionObserver` lazy mount второй карты
