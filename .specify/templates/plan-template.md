# Implementation Plan: [FEATURE]

**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [link]

**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

[Extract from feature spec: primary requirement + technical approach from research]

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: TypeScript / Node.js 20+ (Next.js App Router, React 19)

**Primary Dependencies**: PayloadCMS, Next.js, React, PostgreSQL adapter

**Storage**: PostgreSQL (единственная СУБД проекта GPI)

**Testing**: Vitest/Jest (unit), Playwright/Cypress (E2E при необходимости) — обязательное полное покрытие

**Target Platform**: Статический сайт (SSG/ISR), деплой на Node.js-хостинг или edge

**Project Type**: Сайт агентства недвижимости GPI (PayloadCMS + Next.js)

**Performance Goals**: Google PageSpeed Insights ≥ 90 (mobile и desktop)

**Constraints**: Статическая генерация публичных страниц; SEO/GEO (метатеги, OG, JSON-LD); спецификации на русском; трёхъязычность сайта (ru/ka/en); адаптивная вёрстка (mobile-first)

**Scale/Scope**: [уточнить для фичи: число страниц, коллекций, объектов недвижимости]

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Проверить соответствие `.specify/memory/constitution.md` (все пункты MUST пройти):

- [ ] **I. Русский язык**: spec и plan написаны на русском
- [ ] **II. Статика**: публичные страницы — SSG/ISR, без необоснованного SSR
- [ ] **III. Best practices**: PayloadCMS, Next.js, React — по официальным рекомендациям
- [ ] **IV. Тесты**: для каждой user story запланированы unit/integration/E2E тесты
- [ ] **V. SEO/GEO**: иерархия заголовков, метатеги, OG, JSON-LD для публичных страниц
- [ ] **VI. PageSpeed**: целевой показатель ≥ 90; оптимизация изображений и JS
- [ ] **VII. PostgreSQL**: данные и контент через PostgreSQL, миграции версионированы
- [ ] **VIII. Трёхъязычность**: каждая публичная страница на ru, ka и en; hreflang; переключатель языка; локализация в PayloadCMS
- [ ] **IX. Адаптивность**: mobile-first; breakpoints mobile/tablet/desktop; без горизонтальной прокрутки; touch targets ≥ 44px

При нарушении — заполнить Complexity Tracking с обоснованием.

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
src/
├── app/                    # Next.js App Router (публичные страницы)
│   ├── [locale]/           # Локализованные маршруты (ru, ka, en)
│   ├── (frontend)/         # Статические маршруты
│   └── (payload)/          # PayloadCMS admin и API
├── collections/            # Коллекции PayloadCMS (localized fields)
├── components/             # React-компоненты
├── i18n/                   # Переводы UI-строк (ru, ka, en)
├── lib/                    # Утилиты, SEO/JSON-LD helpers
└── payload.config.ts       # Конфигурация PayloadCMS (localization)

tests/
├── unit/
├── integration/
└── e2e/
```

**Structure Decision**: Монорепозиторий PayloadCMS + Next.js (см. дерево выше).
Публичный сайт — статическая генерация; админка PayloadCMS — отдельный маршрут.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
