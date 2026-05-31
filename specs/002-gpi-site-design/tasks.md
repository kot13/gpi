---
description: "Task list for 002-gpi-site-design — визуальное соответствие gpi-realty.ge"
---

# Tasks: Визуальное соответствие gpi-realty.ge

**Input**: Design documents from `/specs/002-gpi-site-design/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: ОБЯЗАТЕЛЬНЫ (конституция GPI, принцип IV; plan.md — Vitest + Playwright)

**Organization**: Задачи сгруппированы по user story для независимой реализации и тестирования.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Можно выполнять параллельно (разные файлы, нет зависимостей)
- **[Story]**: User story из spec.md (US1–US4)

## Path Conventions

Монорепозиторий Payload CMS 3 + Next.js — см. [plan.md](./plan.md). Изменения только presentation layer.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Подготовка шрифтов, design tokens map и UI-строк для блога

- [X] T001 Добавить файлы шрифта Circe (woff2) в `public/fonts/` или задокументировать fallback в `public/fonts/README.md` (research.md §1)
- [X] T002 Настроить `next/font` — Circe local + Unbounded Google — в `src/app/(frontend)/layout.tsx`
- [X] T003 Создать typed token map в `src/lib/design/tokens.ts` (contracts/design-tokens.md)
- [X] T004 [P] Добавить UI-строки блога (hero, intro, reading time, empty state) в `src/lib/i18n/messages/ru.json`, `ka.json`, `en.json`
- [X] T005 [P] Обновить скелет unit-теста design tokens в `tests/unit/styles/tokens.test.ts` под новые переменные
- [X] T006 [P] Добавить helper форматирования даты записи блога в `src/lib/i18n/formatDate.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Design tokens и базовая тема — MUST завершиться до user stories

**⚠️ CRITICAL**: User story work не начинается до завершения этой фазы

- [X] T007 Обновить color/spacing tokens в `src/app/(frontend)/globals.css` по `contracts/design-tokens.md` (`--color-gpi-brand`, белый фон, `#414141` text)
- [X] T008 Добавить variant `.gpi-prose` и typography scale (h1–h3, body) в `src/app/(frontend)/globals.css`
- [X] T009 Переключить root layout на светлую тему GPI: убрать `className="dark"`, применить `--font-gpi-body`/`--font-gpi-heading` в `src/app/(frontend)/layout.tsx`
- [X] T010 [P] Обновить base body styles (bg-gpi-bg, text-gpi-text) в `src/app/(frontend)/globals.css`
- [X] T011 [P] Заменить устаревший `gpi-accent` (gold) на `gpi-brand` (#7E2226) во всех затронутых компонентах (`grep -r gpi-accent src/`)
- [X] T012 Задать breakpoint burger-menu `max-[980px]` через Tailwind arbitrary variant или custom media в `src/app/(frontend)/globals.css`
- [X] T013 [P] Довести unit-тест tokens до green: все variables из `contracts/design-tokens.md` в `tests/unit/styles/tokens.test.ts`

**Checkpoint**: Foundation ready — design tokens и шрифты подключены

---

## Phase 3: User Story 1 — Единая типографика и визуальный стиль (Priority: P1) 🎯 MVP

**Goal**: Единые шрифты, цвета и типографика на всех публичных страницах (ru/ka/en)

**Independent Test**: Открыть `/ru` и CMS-страницу — шрифты Circe/Unbounded, иерархия h1–h3, один h1, без horizontal scroll на 320px

### Tests for User Story 1 (ОБЯЗАТЕЛЬНО)

> **NOTE: Написать тесты ПЕРВЫМИ, убедиться что они FAIL до реализации**

- [X] T014 [P] [US1] Unit-тест typography scale в `tests/unit/styles/typography.test.ts` (presence of .gpi-prose rules)
- [X] T015 [P] [US1] Unit-тест `src/lib/design/tokens.ts` в `tests/unit/lib/design/tokens.test.ts`
- [X] T016 [US1] E2E-тест типографики и h1 в `tests/e2e/responsive.spec.ts` (single h1, no horizontal scroll @320px на `/ru`)

### Implementation for User Story 1

- [X] T017 [P] [US1] Применить class `.gpi-prose` к Lexical-контенту в `src/components/pages/RichText.tsx`
- [X] T018 [P] [US1] Обновить типографику CMS-страниц (h1, lead) в `src/components/pages/PageContent.tsx`
- [X] T019 [US1] Обновить типографику RichText блоков в `src/components/RichText/index.tsx` (blog/CMS shared)
- [X] T020 [US1] Проверить единственный h1 на главной в `src/app/(frontend)/[locale]/page.tsx` и CMS routes
- [X] T021 [US1] Проверить читаемость типографики на `/ka` и `/en` (визуально + E2E smoke в `tests/e2e/pages.spec.ts`)

**Checkpoint**: User Story 1 — типографика и tokens работают на всех публичных страницах

---

## Phase 4: User Story 2 — Шапка и подвал на всех страницах (Priority: P1)

**Goal**: Header/Footer по референсу gpi-realty.ge; burger-menu на mobile ≤980px

**Independent Test**: Открыть `/ru`, `/ru/blog`, CMS-страницу — desktop nav + footer legal; на 375px burger открывается/закрывается, все пункты доступны

### Tests for User Story 2 (ОБЯЗАТЕЛЬНО)

- [X] T022 [P] [US2] Unit-тест MobileNav (open/close/Escape) в `tests/unit/components/MobileNav.test.tsx`
- [X] T023 [P] [US2] Unit-тест LanguageSwitcher active state в `tests/unit/components/LanguageSwitcher.test.tsx`
- [X] T024 [US2] E2E burger menu и footer в `tests/e2e/header-footer.spec.ts` (desktop nav @1280px, burger @375px, Escape, footer legal block, ru/ka/en)

### Implementation for User Story 2

- [X] T025 [P] [US2] Создать `src/components/layout/MobileNav.tsx` — overlay, focus trap, aria, 44px touch targets (contracts/ui-components.md)
- [X] T026 [P] [US2] Создать `src/components/layout/BurgerButton.tsx` — иконка burger/X, aria-expanded
- [X] T027 [US2] Рефакторинг sticky white header + интеграция MobileNav в `src/Header/Component.client.tsx`
- [X] T028 [US2] Стили nav links и active state (#7E2226 bold) в `src/Header/Nav/index.tsx`
- [X] T029 [P] [US2] Обновить стили LanguageSwitcher (RU/KA/EN) в `src/components/layout/LanguageSwitcher.tsx`
- [X] T030 [P] [US2] Обновить SocialLinks размер иконок 40×40 в `src/components/ui/SocialLinks.tsx`
- [X] T031 [US2] Обновить Footer layout и legal block по референсу в `src/Footer/Component.tsx`
- [X] T032 [US2] Консолидировать дублирующий Header: re-export или удалить `src/components/layout/Header.tsx`
- [X] T033 [US2] Убедиться что Header/Footer рендерятся на 404 в `src/app/(frontend)/[locale]/not-found.tsx`

**Checkpoint**: User Story 2 — шапка/подвал и burger-menu на всех страницах

---

## Phase 5: User Story 3 — Блог: список записей (Priority: P2)

**Goal**: Hero-секция и карточки записей как на gpi-realty.ge/blog/ru

**Independent Test**: 3+ записи → `/ru/blog` — hero, grid карточек (image, category, title, description), responsive 1/2/3 col

### Tests for User Story 3 (ОБЯЗАТЕЛЬНО)

- [X] T034 [P] [US3] Unit-тест BlogCard render в `tests/unit/components/BlogCard.test.tsx`
- [X] T035 [US3] E2E blog list layout в `tests/e2e/blog.spec.ts` (hero, card structure, grid @320/768/1280, ru/ka/en)

### Implementation for User Story 3

- [X] T036 [P] [US3] Обновить стили карточки (radius 16px, hover border brand) в `src/components/Card/index.tsx`
- [X] T037 [P] [US3] Добавить hero-секцию и empty state в `src/components/blog/BlogList.tsx`
- [X] T038 [US3] Интегрировать hero + localized UI strings в `src/app/(frontend)/[locale]/blog/page.tsx`
- [X] T039 [US3] Адаптивная сетка карточек (1/2/3 col) в `src/components/blog/BlogList.tsx`
- [X] T040 [P] [US3] Стилизовать Pagination под GPI theme в `src/components/Pagination/index.tsx`
- [X] T041 [US3] Применить те же card styles на странице рубрики `src/app/(frontend)/[locale]/blog/category/[slug]/page.tsx`

**Checkpoint**: User Story 3 — список блога визуально соответствует референсу

---

## Phase 6: User Story 4 — Блог: страница записи (Priority: P2)

**Goal**: Layout статьи + meta (date, category) + CTA strip (WhatsApp/Telegram)

**Independent Test**: `/ru/blog/{slug}` — h1, hero image, date, category, prose, CTA links; mobile без horizontal scroll

### Tests for User Story 4 (ОБЯЗАТЕЛЬНО)

- [X] T042 [P] [US4] Unit-тест BlogPostView meta row в `tests/unit/components/BlogPostView.test.tsx`
- [X] T043 [P] [US4] Unit-тест BlogPostCTA links в `tests/unit/components/BlogPostCTA.test.tsx`
- [X] T044 [US4] E2E blog post page в `tests/e2e/blog.spec.ts` (title, date, category, CTA, prose, mobile @320px)

### Implementation for User Story 4

- [X] T045 [P] [US4] Создать CTA strip в `src/components/blog/BlogPostCTA.tsx` (social links from header, localized labels)
- [X] T046 [US4] Рефакторинг article layout (hero, meta, h1, description, prose) в `src/components/blog/BlogPostView.tsx`
- [X] T047 [US4] Добавить formatted date через `src/lib/i18n/formatDate.ts` в `src/components/blog/BlogPostView.tsx`
- [X] T048 [US4] Обновить page wrapper и spacing в `src/app/(frontend)/[locale]/blog/[slug]/page.tsx`
- [X] T049 [P] [US4] Placeholder layout для записи без hero-image в `src/components/blog/BlogPostView.tsx`

**Checkpoint**: User Story 4 — страница записи соответствует референсу

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: PageSpeed, SEO, адаптивность, документация

- [X] T050 [P] Прогнать и зафиксировать PageSpeed ≥ 90 на `/ru` и `/ru/blog` (build + Lighthouse); записать результат в `specs/002-gpi-site-design/quickstart.md`
- [X] T051 [P] SEO smoke: один h1, alt images, semantic HTML на `/ru/blog` и `/ru/blog/{slug}` — `tests/e2e/blog.spec.ts`
- [X] T052 [P] Адаптивность: обновить viewport matrix 320/768/1920 в `tests/e2e/responsive.spec.ts`
- [X] T053 [P] Локализация: проверить UI-строки блога и LanguageSwitcher на ru/ka/en в E2E
- [X] T054 Обновить `tests/unit/styles/tokens.test.ts` — удалить проверки deprecated `--color-gpi-accent` gold
- [X] T055 Запустить `npm run test` и `npm run test:e2e` — все green
- [X] T056 Выполнить visual acceptance checklist из `specs/002-gpi-site-design/quickstart.md`
- [X] T057 [P] Обновить `README.md` — секция Design System (tokens, fonts, breakpoints)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 — **BLOCKS all user stories**
- **US1 (Phase 3)**: Depends on Phase 2
- **US2 (Phase 4)**: Depends on Phase 2; может параллельно с US1 после Phase 2 (разные файлы)
- **US3 (Phase 5)**: Depends on Phase 2 + US1 (prose/tokens); рекомендуется после US1
- **US4 (Phase 6)**: Depends on Phase 2 + US1; US3 не блокирует US4
- **Polish (Phase 7)**: Depends on US1–US4 (или минимум US1+US2 для partial release)

### User Story Dependencies

| Story | Depends on | Independent Test |
|-------|------------|------------------|
| US1 (P1) | Phase 2 | `/ru` + CMS page typography |
| US2 (P1) | Phase 2 | Header/footer + burger all routes |
| US3 (P2) | Phase 2, US1 (prose) | `/ru/blog` cards + hero |
| US4 (P2) | Phase 2, US1 (prose) | `/ru/blog/{slug}` article + CTA |

### Within Each User Story

- Tests FIRST (fail → implement → pass)
- Foundational tokens before components
- Shared components (MobileNav) before Header integration

### Parallel Opportunities

- **Phase 1**: T004, T005, T006 параллельно после T003
- **Phase 2**: T010, T011, T013 параллельно после T007
- **After Phase 2**: US1 и US2 можно вести параллельно (разные директории)
- **US3 + US4**: BlogCard/BlogList параллельно с BlogPostCTA после US1

---

## Parallel Example: User Story 2

```bash
# Tests parallel:
T022: tests/unit/components/MobileNav.test.tsx
T023: tests/unit/components/LanguageSwitcher.test.tsx

# Implementation parallel:
T025: src/components/layout/MobileNav.tsx
T026: src/components/layout/BurgerButton.tsx
T029: src/components/layout/LanguageSwitcher.tsx
T030: src/components/ui/SocialLinks.tsx
# Then sequential: T027 Header integration
```

---

## Parallel Example: User Story 3 + 4

```bash
# After US1 complete, parallel:
T036: src/components/Card/index.tsx        # US3
T045: src/components/blog/BlogPostCTA.tsx   # US4

# Then:
T038: blog/page.tsx                         # US3
T046: BlogPostView.tsx                      # US4
```

---

## Implementation Strategy

### MVP First (User Story 1 + 2)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (**critical**)
3. Complete Phase 3: US1 (typography)
4. Complete Phase 4: US2 (header/footer/burger)
5. **STOP and VALIDATE**: Visual compare with gpi-realty.ge on `/ru`, `/ru/about`
6. Deploy/demo — site уже узнаваем как GPI

### Incremental Delivery

1. Setup + Foundational → tokens ready
2. US1 → typography on all pages
3. US2 → brand shell (header/footer/burger) — **MVP для бренда**
4. US3 → blog list redesign
5. US4 → blog post redesign
6. Polish → PageSpeed, full E2E green

### Suggested MVP Scope

**Minimum shippable**: Phase 1 + Phase 2 + **US1** + **US2** (типографика + header/footer/burger).

Blog visual parity (US3 + US4) — следующий increment.

---

## Notes

- CMS schema **не меняется** — только presentation layer
- Шрифт Circe: при отсутствии woff2 использовать fallback из research.md до получения файлов от заказчика
- Burger breakpoint: **980px** (не 767px из spec — plan/research уточняют по Tilda референсу)
- Все задачи с exact file paths — готовы для `/speckit-implement`
- Commit после каждой фазы или logical group

---

## Task Summary

| Phase | Tasks | Story |
|-------|-------|-------|
| Phase 1 Setup | T001–T006 (6) | — |
| Phase 2 Foundational | T007–T013 (7) | — |
| Phase 3 US1 | T014–T021 (8) | Typography P1 |
| Phase 4 US2 | T022–T033 (12) | Header/Footer P1 |
| Phase 5 US3 | T034–T041 (8) | Blog list P2 |
| Phase 6 US4 | T042–T049 (8) | Blog post P2 |
| Phase 7 Polish | T050–T057 (8) | — |
| **Total** | **57 tasks** | |
