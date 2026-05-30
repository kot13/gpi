# Implementation Plan: Инициализация CMS — страницы, блог, шапка и подвал

**Branch**: `001-cms-foundation` | **Date**: 2026-05-30 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/001-cms-foundation/spec.md`

## Summary

Инициализация проекта GPI на **PayloadCMS 3 + Next.js 15 (App Router) + PostgreSQL**
с публичным статическим сайтом (SSG/ISR). Реализуются коллекции **Pages**,
**BlogPosts**, **BlogCategories**, глобальные настройки **Header** и **Footer**,
трёхъязычная локализация (ru/ka/en), SEO/GEO, адаптивная вёрстка в стиле
[gpi-realty.ge](https://gpi-realty.ge/) и полное покрытие тестами.

Технический подход: монорепозиторий по официальному шаблону Payload CMS for
Next.js; публичные маршруты — Server Components + `generateStaticParams`;
инвалидация кеша через Payload hooks (`revalidatePath`) при публикации контента.

## Technical Context

**Language/Version**: TypeScript 5.x / Node.js 20 LTS / Next.js 15 App Router / React 19

**Primary Dependencies**: Payload CMS 3, `@payloadcms/db-postgres`, `@payloadcms/richtext-lexical`, `@payloadcms/plugin-seo`, `next-intl` (UI-строки), Tailwind CSS 4, `sharp` (изображения)

**Storage**: PostgreSQL 16 (Docker для dev; managed PostgreSQL для prod)

**Testing**: Vitest (unit/integration), `@testing-library/react` (компоненты), Playwright (E2E: локали + breakpoints)

**Target Platform**: Статический сайт (SSG + ISR on-demand revalidation), Payload Admin на `/admin`

**Project Type**: Сайт агентства недвижимости GPI (CMS + публичный frontend)

**Performance Goals**: Google PageSpeed Insights ≥ 90 (mobile и desktop)

**Constraints**: SSG/ISR для публичных страниц; ru/ka/en; SEO (metadata, OG, JSON-LD, hreflang); mobile-first 320–1920px+; дизайн gpi-realty.ge

**Scale/Scope**: 5 коллекций/globals, ~15–30 информационных страниц, блог (десятки записей), 3 локали

### Breakpoints (конституция IX)

| Имя | Диапазон | Tailwind |
|-----|----------|----------|
| mobile | 320–767px | default |
| tablet | 768–1023px | `md:` |
| desktop | 1024–1919px | `lg:` |
| wide | 1920px+ | `xl:` |

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **I. Русский язык**: spec и plan на русском
- [x] **II. Статика**: публичные страницы — SSG/ISR через `generateStaticParams` + on-demand revalidation; SSR не используется для публичного контента
- [x] **III. Best practices**: официальный шаблон Payload+Next.js, Lexical, plugin-seo, App Router metadata API
- [x] **IV. Тесты**: Vitest + Playwright для всех user stories (см. quickstart.md)
- [x] **V. SEO/GEO**: Metadata API, `@payloadcms/plugin-seo`, JSON-LD helpers, hreflang в layout
- [x] **VI. PageSpeed**: Server Components, `next/image`, minimal client JS, static generation
- [x] **VII. PostgreSQL**: `@payloadcms/db-postgres`, миграции Payload
- [x] **VIII. Трёхъязычность**: Payload localization (ru, ka, en), `/[locale]/...`, LanguageSwitcher
- [x] **IX. Адаптивность**: Tailwind mobile-first, breakpoints задокументированы выше, Playwright viewport tests

**Post-design re-check**: все gates пройдены, нарушений нет.

## Project Structure

### Documentation (this feature)

```text
specs/001-cms-foundation/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── public-routes.md
│   ├── collections-schema.md
│   └── seo-metadata.md
└── tasks.md              # Phase 2 — /speckit-tasks
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── (frontend)/
│   │   └── [locale]/
│   │       ├── layout.tsx              # Header, Footer, hreflang
│   │       ├── page.tsx                # Главная (CMS page slug: home)
│   │       ├── [...slug]/page.tsx      # Динамические CMS-страницы
│   │       └── blog/
│   │           ├── page.tsx            # Список записей
│   │           ├── [slug]/page.tsx     # Запись блога
│   │           └── category/[slug]/page.tsx
│   └── (payload)/
│       ├── admin/[[...segments]]/
│       └── api/[...slug]/
├── collections/
│   ├── Pages.ts
│   ├── BlogPosts.ts
│   ├── BlogCategories.ts
│   ├── Media.ts
│   └── Users.ts
├── globals/
│   ├── Header.ts
│   └── Footer.ts
├── components/
│   ├── layout/                         # Header, Footer, LanguageSwitcher, Nav
│   ├── blog/                           # BlogCard, BlogList, BlogPost
│   ├── pages/                          # PageContent, RichText
│   └── ui/                             # Button, Icon, SocialLinks
├── lib/
│   ├── payload/                        # getPayload, queries
│   ├── seo/                            # metadata, jsonLd, hreflang
│   └── i18n/                           # UI translations (next-intl)
├── hooks/
│   └── revalidateFrontend.ts           # Payload afterChange → revalidatePath
├── payload.config.ts
└── payload-types.ts                    # generated

tests/
├── unit/
│   ├── lib/seo/
│   └── components/
├── integration/
│   ├── collections/
│   └── payload/
└── e2e/
    ├── pages.spec.ts
    ├── blog.spec.ts
    ├── header-footer.spec.ts
    └── responsive.spec.ts

public/
├── fonts/
└── images/                             # logo, placeholders

docker-compose.yml                      # PostgreSQL dev
.env.example
```

**Structure Decision**: Официальная структура Payload CMS 3 + Next.js в одном
`src/`. Коллекции и globals — отдельные модули. Публичный frontend в `(frontend)`,
админка и REST/GraphQL API в `(payload)`.

## Complexity Tracking

> Нарушений конституции нет — таблица не заполняется.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| — | — | — |

## Phase 0 Output

См. [research.md](./research.md)

## Phase 1 Output

- [data-model.md](./data-model.md)
- [contracts/](./contracts/)
- [quickstart.md](./quickstart.md)
