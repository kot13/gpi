# Implementation Plan: Каталог недвижимости

**Branch**: `004-property-catalog` | **Date**: 2026-06-01 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/004-property-catalog/spec.md`

## Summary

Добавить коллекцию Payload **`properties`** с полной моделью объекта (код, статус листинга, адрес, координаты, цены, характеристики, справочники, локализованные title/description, внешние ссылки, галерея URL-фото, дата актуализации) и публичный раздел **`/{locale}/properties`**: список с фильтрами/сортировкой и детальные страницы **`/{locale}/properties/{objectCode}`** с галереей, характеристиками и картой (**Leaflet** / `react-leaflet`, client island).

Технический подход: SSG (`force-static`, `revalidate` 600) + `generateStaticParams` для карточек; каталог получает все активные объекты на сервере и передаёт в **Client Component** для фильтрации в памяти и синхронизации с `searchParams` (без SSR на запрос). Галерея — **upload → media** в админке (не внешние URL). Справочники — enum/select в CMS + словари в `src/lib/properties/` и `messages/*.json`. SEO: plugin-seo, JSON-LD `Product` + `Offer`, sitemap, hreflang. Seed — демо-объект с файлами в Media.

## Technical Context

**Language/Version**: TypeScript 5.8 / Node.js 20 LTS / Next.js 15.3 App Router / React 19 / Payload CMS 3.85

**Primary Dependencies**: `leaflet`, `react-leaflet` (карта, dynamic import); `next-intl` (UI); `@payloadcms/plugin-seo`; существующие `validateLocalizedPublish` pattern, design tokens из `src/lib/design/tokens.ts` (фича 002)

**Storage**: PostgreSQL — новая таблица коллекции `properties`; `npm run db:push` + `generate:types`

**Testing**: Vitest + RTL (словари, фильтры, валидация хуков); integration (коллекция, publish rules, static params); Playwright E2E (каталог, фильтр, карточка, карта, 3 locales)

**Target Platform**: SSG/ISR — публичные маршруты статические; Leaflet и фильтры — client islands

**Project Type**: CMS collection + frontend routes + shared lib (dictionaries, formatters)

**Performance Goals**: PageSpeed ≥ 90 на `/properties` и `/properties/[objectCode]`; LCP — первое фото с `priority` на детальной; lazy для остальных; Leaflet только на detail; фильтры без сетевых запросов

**Constraints**: ru/ka/en; без CRM-импорта v1; фото только через медиатеку (`relationTo: media`); touch ≥ 44px на фильтрах и контактах

**Scale/Scope**: 1 коллекция (~25 полей + array photos), 2 маршрута + опциональная CMS-страница `pages` slug `properties` для hero/SEO каталога; ~15–20 исходных файлов; 4 user stories

### Breakpoints (конституция IX + фича 002)

| Имя | Диапазон | Tailwind | Поведение каталога |
|-----|----------|----------|-------------------|
| mobile | 320–767px | default | Карточки в колонку; фильтры в drawer/accordion; карта h≈240px |
| tablet | 768–979px | `md:` | Сетка 2 колонки; фильтры сбоку или сверху |
| desktop | 980–1919px | `lg:` | Сетка 3 колонки; sticky sidebar фильтров |
| wide | 1920px+ | `xl:` | `max-w` контейнер; карта h≈360px |

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **I. Русский язык**: spec, plan, contracts, research на русском
- [x] **II. Статика**: `dynamic = 'force-static'`; данные properties на build/ISR; client islands только для фильтров и Leaflet
- [x] **III. Best practices**: Payload collection + drafts, hooks, `authenticatedOrPublished`; Next.js App Router; dynamic import Leaflet
- [x] **IV. Тесты**: unit (dict, filters, hooks) + integration (collection) + E2E (catalog, detail, locales) в tasks
- [x] **V. SEO/GEO**: meta/OG/hreflang; JSON-LD Offer; один `h1`; alt на фото; sitemap properties
- [x] **VI. PageSpeed**: Leaflet code-split; external images optimized where allowed; minimal client JS на каталоге
- [x] **VII. PostgreSQL**: новая коллекция; schema versioned via push/migrations
- [x] **VIII. Трёхъязычность**: localized title/description; UI filters в messages ru/ka/en; E2E 3 locales
- [x] **IX. Адаптивность**: mobile-first; breakpoints выше; touch targets на CTA и фильтрах

**Post-design re-check**: Client JS для фильтров и карты обоснован интерактивом (FR-010–013) при сохранении SSG-данных; альтернатива SSR с query params отклонена (нарушение принципа II).

## Project Structure

### Documentation (this feature)

```text
specs/004-property-catalog/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── cms-properties-collection.md
│   ├── catalog-ui.md
│   └── public-routes.md
└── tasks.md              # Phase 2 — /speckit-tasks
```

### Source Code

```text
src/
├── collections/
│   └── Properties/
│       ├── index.ts
│       └── hooks/
│           ├── revalidateProperty.ts
│           └── validatePropertyPublish.ts
├── lib/
│   └── properties/
│       ├── dictionaries.ts      # codes + label keys
│       ├── labels.ts              # resolve label by locale
│       ├── filters.ts             # pure filter/sort (unit-tested)
│       ├── formatPrice.ts
│       └── types.ts
├── hooks/
│   └── validatePropertyPublish.ts # if shared with collection hook
├── app/(frontend)/[locale]/
│   ├── properties/
│   │   ├── page.tsx               # catalog SSG
│   │   ├── page.client.tsx        # filters UI
│   │   └── [objectCode]/
│   │       ├── page.tsx           # detail SSG
│   │       └── page.client.tsx    # gallery + optional interactions
│   └── (sitemaps)/
│       └── properties-sitemap.xml/route.ts
├── components/
│   └── properties/
│       ├── PropertyCard.tsx
│       ├── PropertyFilters.tsx
│       ├── PropertyGallery.tsx
│       ├── PropertySpecs.tsx
│       ├── PropertyMap.tsx        # dynamic Leaflet
│       └── PropertyContactLinks.tsx
├── lib/payload/queries/
│   └── properties.ts
├── lib/seo/
│   └── propertyJsonLd.ts
├── endpoints/seed/
│   └── properties.ts
└── payload.config.ts              # register Properties

tests/
├── unit/lib/properties/
├── unit/hooks/validatePropertyPublish.test.ts
├── integration/properties-collection.test.ts
└── e2e/
    └── property-catalog.spec.ts
```

**Structure Decision**: Отдельная коллекция `properties` (не block в `pages`), по аналогии с `posts`. Лендинг каталога может использовать `pages` slug `properties` для hero (как `blog`) — опционально в seed.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| — | — | — |

## Phase 0 Output

См. [research.md](./research.md)

## Phase 1 Output

- [data-model.md](./data-model.md)
- [contracts/](./contracts/)
- [quickstart.md](./quickstart.md)
