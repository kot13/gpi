# Implementation Plan: Layout «Слайдшоу» для главного баннера

**Branch**: `003-slideshow-layout` | **Date**: 2026-05-31 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/003-slideshow-layout/spec.md`

## Summary

Добавить новый тип hero **«Slideshow»** в коллекцию `pages`: массив локализованных
слайдов (изображение, заголовок, подзаголовок, ссылка, текст кнопки) и клиентский
компонент `SlideshowHero` с таймлайном, зацикленной каруселью, перелистыванием,
fade in up для текста и автопрокруткой (6 с, пауза при hover/focus, off при
`prefers-reduced-motion`).

Технический подход: расширение `src/heros/config.ts`, новый `src/heros/Slideshow/`,
`embla-carousel-react` для loop + swipe, CSS-анимации (Tailwind / `tw-animate-css`)
для fade in up, переиспользование `link()` и `CMSLink` / `resolveLinkHref`.
Seed главной страницы — демо-слайды. Зависимость от design tokens фичи 002.

## Technical Context

**Language/Version**: TypeScript 5.x / Node.js 20 LTS / Next.js 15 App Router / React 19 / Payload CMS 3.85

**Primary Dependencies**: `embla-carousel-react` + `embla-carousel` (карусель, loop, a11y); существующие `link` field, `CMSLink`, `Media` / `next/image`, Tailwind CSS 4, design tokens из `src/lib/design/tokens.ts`

**Storage**: PostgreSQL — расширение JSON-схемы группы `hero` на `pages` (миграция через `npm run db:push` в dev)

**Testing**: Vitest + RTL (`SlideshowHero`, timeline, reduced motion hook); Playwright E2E (переключение, loop, mobile, 3 locales); опционально integration на поле hero в Pages

**Target Platform**: SSG/ISR — слайды сериализуются в HTML первого слайда; интерактив — Client Component island

**Project Type**: CMS schema + frontend hero (hero zone)

**Performance Goals**: PageSpeed ≥ 90 на главной со слайдшоу; LCP — `priority` на первом изображении; lazy на остальных; JS budget — один client bundle на страницах со slideshow hero

**Constraints**: SSG/ISR; ru/ka/en localized slides; один `h1` на видимый слайд; touch ≥ 44px на стрелках и сегментах таймлайна; без левого промо-блока (out of scope)

**Scale/Scope**: 1 новый hero type, 1 client component (+ подкомпоненты Timeline/Slide), ~6–8 файлов, seed update, 3 user stories

### Breakpoints (конституция IX + фича 002)

| Имя | Диапазон | Tailwind | Поведение слайдшоу |
|-----|----------|----------|-------------------|
| mobile | 320–767px | default | Полная ширина, стек текста, таймлайн + стрелки ≥44px |
| tablet | 768–979px | `md:` | Увеличенные подложки текста |
| desktop | 980–1919px | `lg:` | Референс gpi-realty.ge: широкий баннер, текст слева на изображении |
| wide | 1920px+ | `xl:` | `max-height` / `object-cover` без CLS |

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **I. Русский язык**: spec, plan, contracts на русском
- [x] **II. Статика**: данные hero в SSG; Client Component только для карусели
- [x] **III. Best practices**: Payload conditional fields, `link()` reuse, Embla, Server default + client island
- [x] **IV. Тесты**: unit (hero, timeline, a11y) + E2E (carousel, loop, locales) в tasks
- [x] **V. SEO/GEO**: один `h1` на активный слайд; `aria-hidden` на неактивных; alt из заголовка
- [x] **VI. PageSpeed**: priority first image; Embla tree-shakeable; pause autoplay on interaction
- [x] **VII. PostgreSQL**: schema hero slides в `pages`; `db:push` / миграция
- [x] **VIII. Трёхъязычность**: localized array `slides`; seed + E2E ru/ka/en
- [x] **IX. Адаптивность**: mobile-first; breakpoints в plan; touch targets

**Post-design re-check**: все gates пройдены. Client JS для карусели обоснован интерактивом (FR-007–008); альтернатива без JS не покрывает autoplay + timeline progress.

## Project Structure

### Documentation (this feature)

```text
specs/003-slideshow-layout/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── cms-hero-slideshow.md
│   └── slideshow-ui.md
└── tasks.md              # Phase 2 — /speckit-tasks
```

### Source Code

```text
src/
├── heros/
│   ├── config.ts                     # type: slideshow, slides array, conditions
│   ├── RenderHero.tsx                # register SlideshowHero
│   └── Slideshow/
│       ├── index.tsx                 # Client: Embla + autoplay + a11y
│       ├── SlideshowTimeline.tsx     # N segments, progress fill
│       ├── SlideshowSlide.tsx        # image, overlays, fade-in-up text
│       └── useReducedMotion.ts       # prefers-reduced-motion
├── fields/
│   └── link.ts                       # reuse (no change)
├── components/Link/index.tsx         # CMSLink + buttonLabel override
├── collections/Pages/index.ts        # hero tab unchanged (hero import)
├── endpoints/seed/
│   ├── home.ts                       # hero type slideshow + slides
│   └── pages/…                       # при необходимости
└── app/(frontend)/[locale]/[slug]/page.tsx  # RenderHero already wired

tests/
├── unit/heros/
│   ├── SlideshowTimeline.test.tsx
│   └── useReducedMotion.test.ts
├── unit/components/
│   └── SlideshowHero.test.tsx
└── e2e/
    └── slideshow.spec.ts             # NEW: loop, timeline, a11y, 3 locales
```

**Structure Decision**: Новый hero type в существующей группе `hero` на `pages` —
без отдельной коллекции и без block в `layout`. Соответствует spec (верхняя зона).

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
