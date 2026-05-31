# Implementation Plan: Визуальное соответствие gpi-realty.ge

**Branch**: `002-gpi-site-design` | **Date**: 2026-05-30 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/002-gpi-site-design/spec.md`

## Summary

Привести **presentation layer** публичного сайта GPI к визуальному паритету с
[gpi-realty.ge](https://gpi-realty.ge/): шрифты (Circe + Unbounded), типографика,
цветовая палитра (белый фон, бордовый акцент `#7E2226`), шапка и подвал на всех
страницах, **бургер-меню** на mobile (≤980px по референсу), карточки блога и
страница записи по референсу.

Технический подход: расширение design tokens в Tailwind CSS 4, замена Geist на
`next/font` (Circe через локальные woff2 или ближайший web-safe fallback),
рефакторинг `Header`/`Footer`/`BlogCard`/`BlogPostView`, новый Client Component
`MobileNav` (бургер + overlay). **Без изменений схемы CMS** — данные из
`001-cms-foundation`.

## Technical Context

**Language/Version**: TypeScript 5.x / Node.js 20 LTS / Next.js 15 App Router / React 19

**Primary Dependencies**: Tailwind CSS 4, `@tailwindcss/typography`, `next/font`, существующий стек Payload CMS 3 (без новых коллекций)

**Storage**: PostgreSQL — без изменений (контент из globals Header/Footer, Posts)

**Testing**: Vitest (unit: tokens, typography helpers), `@testing-library/react` (Header, MobileNav, BlogCard), Playwright (E2E: burger menu, responsive, blog layout, 3 locales)

**Target Platform**: SSG/ISR публичный frontend; изменения только в `(frontend)`

**Project Type**: UI-фича поверх существующего CMS (presentation layer)

**Performance Goals**: PageSpeed ≥ 90 на `/ru` и `/ru/blog`; self-hosted fonts с `font-display: swap`

**Constraints**: SSG/ISR; ru/ka/en; SEO (h1, alt); mobile-first 320–1920px+; touch targets ≥ 44px; без новых client bundles на страницах без интерактива

**Scale/Scope**: ~8–12 React-компонентов, 1 CSS tokens file, 0 миграций БД, 4 user stories

### Breakpoints (конституция IX + референс Tilda)

| Имя | Диапазон | Tailwind | Референс Tilda |
|-----|----------|----------|----------------|
| mobile | 320–767px | default | ≤639px |
| tablet | 768–979px | `md:` | 640–979px |
| desktop | 980–1919px | `lg:` | ≥980px (desktop nav) |
| wide | 1920px+ | `xl:` | 1200px+ artboard |

**Примечание**: бургер-меню включается на `< lg` (≤979px), что соответствует
референсу (`max-width: 980px` в Tilda).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **I. Русский язык**: spec и plan на русском
- [x] **II. Статика**: только стили и компоненты; SSG/ISR не меняется
- [x] **III. Best practices**: Server Components по умолчанию; Client только для MobileNav/burger; `next/font` для шрифтов
- [x] **IV. Тесты**: unit (tokens, components) + E2E (burger, blog, responsive) для каждой user story
- [x] **V. SEO/GEO**: сохранение h1, alt, semantic HTML; визуальные изменения не ломают metadata
- [x] **VI. PageSpeed**: self-hosted fonts, minimal client JS (только header burger), `next/image` без изменений
- [x] **VII. PostgreSQL**: без изменений схемы
- [x] **VIII. Трёхъязычность**: LanguageSwitcher в desktop nav и mobile menu; стили едины для ru/ka/en
- [x] **IX. Адаптивность**: mobile-first, breakpoints задокументированы; burger ≤979px; touch 44px

**Post-design re-check**: все gates пройдены, нарушений нет.

## Project Structure

### Documentation (this feature)

```text
specs/002-gpi-site-design/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── design-tokens.md
│   └── ui-components.md
└── tasks.md              # Phase 2 — /speckit-tasks
```

### Source Code (изменяемые файлы)

```text
src/
├── app/(frontend)/
│   ├── layout.tsx                    # Шрифты Circe/Unbounded, светлая тема body
│   ├── globals.css                   # GPI design tokens, typography, prose
│   └── [locale]/
│       ├── layout.tsx                # без изменений структуры
│       └── blog/
│           ├── page.tsx              # Hero-блок списка блога
│           └── [slug]/page.tsx       # обёртка BlogPostView
├── Header/
│   ├── Component.client.tsx          # Desktop + MobileNav, sticky white header
│   └── Nav/index.tsx                 # Стили nav links, active state
├── Footer/
│   └── Component.tsx                 # Светлый/тёмный footer по референсу
├── components/
│   ├── layout/
│   │   ├── MobileNav.tsx             # NEW: burger, overlay, a11y
│   │   ├── Header.tsx                # Консолидация с Header/
│   │   ├── LanguageSwitcher.tsx      # Стили EN/RU/KA как референс
│   │   └── Nav.tsx
│   ├── blog/
│   │   ├── BlogCard.tsx              # Re-export + стили карточки
│   │   ├── BlogList.tsx              # Сетка, hero, empty state
│   │   ├── BlogPostView.tsx          # Article layout, meta, CTA strip
│   │   └── BlogPostCTA.tsx           # NEW: мессенджеры (links from footer/header)
│   ├── Card/index.tsx                # GPI card styling
│   └── pages/
│       ├── PageContent.tsx           # Типографика CMS-страниц
│       └── RichText.tsx              # prose gpi-prose
├── lib/
│   └── design/
│       └── tokens.ts                 # NEW: typed token map для тестов
└── public/
    └── fonts/                        # Circe woff2 (если лицензия/файлы доступны)

tests/
├── unit/
│   ├── styles/tokens.test.ts         # Обновить под новые tokens
│   └── components/
│       ├── MobileNav.test.tsx        # NEW
│       └── BlogCard.test.tsx
└── e2e/
    ├── header-footer.spec.ts         # Burger menu scenarios
    ├── blog.spec.ts                  # Card + post layout
    └── responsive.spec.ts            # 320/768/1920
```

**Structure Decision**: Изменения локализованы в `(frontend)`, `Header/`, `Footer/`,
`components/blog/`, `globals.css`. CMS collections/globals **не трогаем**.

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
