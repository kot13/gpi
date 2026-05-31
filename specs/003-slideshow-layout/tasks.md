---
description: "Task list for 003-slideshow-layout — hero Slideshow с таймлайном и анимациями"
---

# Tasks: Layout «Слайдшоу» для главного баннера

**Input**: Design documents from `/specs/003-slideshow-layout/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: ОБЯЗАТЕЛЬНЫ (конституция GPI, принцип IV; plan.md — Vitest + Playwright)

**Organization**: Задачи сгруппированы по user story для независимой реализации и тестирования.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Можно выполнять параллельно (разные файлы, нет зависимостей)
- **[Story]**: User story из spec.md (US1–US3)

## Path Conventions

Монорепозиторий Payload CMS 3 + Next.js — см. [plan.md](./plan.md). Hero type `slideshow` в `src/heros/`.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Зависимости карусели, i18n, CSS-токены анимаций

- [X] T001 Установить `embla-carousel` и `embla-carousel-react` в `package.json` (research.md §2)
- [X] T002 [P] Добавить ключи `slideshow.prev`, `slideshow.next`, `slideshow.slideN` в `src/lib/i18n/messages/ru.json`, `ka.json`, `en.json` (contracts/slideshow-ui.md)
- [X] T003 [P] Добавить CSS-переменные слайдшоу (`--slideshow-transition-ms`, `--slideshow-autoplay-ms`, `--slideshow-fade-up-ms`) и класс `.gpi-slideshow` в `src/app/(frontend)/globals.css` (contracts/slideshow-ui.md)
- [X] T004 [P] Создать хук `useReducedMotion` в `src/heros/Slideshow/useReducedMotion.ts`
- [X] T005 [P] Unit-тест `readReducedMotionPreference` в `tests/unit/lib/motion/reducedMotion.test.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: CMS-схема hero `slideshow`, типы, валидация публикации — MUST до user stories

**⚠️ CRITICAL**: User story work не начинается до завершения этой фазы

- [X] T006 Расширить `src/heros/config.ts`: опция `slideshow`, массив `slides` (image, title, subtitle, link, buttonLabel), conditions для скрытия richText/links/media (contracts/cms-hero-slideshow.md)
- [X] T007 Расширить `src/hooks/validateLocalizedPublish.ts` — валидация слайдов при `hero.type === 'slideshow'` (data-model.md, FR-004)
- [X] T008 Выполнить `npm run db:push` и `npm run generate:types` — обновить `src/payload-types.ts`
- [X] T009 Зарегистрировать заглушку `SlideshowHero` в `src/heros/RenderHero.tsx` (возврат `null` или placeholder до US1)
- [X] T010 [P] Integration-тест валидации slideshow hero в `tests/integration/pages-slideshow-hero.test.ts`

**Checkpoint**: Foundation ready — схема CMS и типы доступны

---

## Phase 3: User Story 1 — Просмотр слайдшоу на главной (Priority: P1) 🎯 MVP

**Goal**: Посетитель видит карусель с таймлайном, перелистыванием, fade in up, loop и CTA

**Independent Test**: Опубликовать home с 2+ слайдами → `/ru` — первый слайд, переключение стрелкой/таймлайном, loop, кнопка ведёт по ссылке

### Tests for User Story 1 (ОБЯЗАТЕЛЬНО)

> **NOTE: Написать тесты ПЕРВЫМИ, убедиться что они FAIL до реализации**

- [X] T011 [P] [US1] Покрытие UI слайдшоу — E2E `tests/e2e/slideshow.spec.ts` (unit render: ограничение vitest/rolldown + React 19)
- [X] T012 [P] [US1] E2E smoke слайдшоу в `tests/e2e/slideshow.spec.ts`
- [X] T013 [US1] E2E carousel: переключение, loop, timeline click в `tests/e2e/slideshow.spec.ts` (@1280px, `/ru`)

### Implementation for User Story 1

- [X] T014 [P] [US1] Создать `src/heros/Slideshow/SlideshowSlide.tsx` — image (`Media`, priority index 0), подложки, title/subtitle, `CMSLink` + `buttonLabel`
- [X] T015 [P] [US1] Создать `src/heros/Slideshow/SlideshowTimeline.tsx` — N сегментов, progress 6s, click → scrollTo
- [X] T016 [US1] Создать `src/heros/Slideshow/index.tsx` — Embla loop, autoplay/pause, slide transition, fade in up, nav arrows (contracts/slideshow-ui.md)
- [X] T017 [US1] Добавить keyframes/utility fade-in-up и slide transition в `src/app/(frontend)/globals.css` (привязка к `.gpi-slideshow`)
- [X] T018 [US1] Подключить `SlideshowHero` в `src/heros/RenderHero.tsx` вместо заглушки
- [X] T019 [P] [US1] Поддержать `buttonLabel` в `src/components/Link/index.tsx` (или prop override label для CTA слайда)
- [X] T020 [US1] Согласовать full-bleed hero: отступы/`pt-16` в `src/app/(frontend)/[locale]/[slug]/page.tsx` при `hero.type === slideshow`
- [X] T021 [US1] Обновить seed главной: `hero.type = slideshow`, 2–3 слайда ru/ka/en в `src/endpoints/seed/home.ts` (и `src/endpoints/seed/index.ts` при необходимости)

**Checkpoint**: User Story 1 — слайдшоу работает на публичной главной

---

## Phase 4: User Story 2 — Управление слайдами в CMS (Priority: P1)

**Goal**: Редактор выбирает Slideshow, управляет слайдами, публикация блокируется при неполных полях

**Independent Test**: Admin → Home → Hero Slideshow → добавить 2 слайда, опубликовать ru/en — поля видны, ошибка при пустом title

### Tests for User Story 2 (ОБЯЗАТЕЛЬНО)

- [X] T022 [P] [US2] Дополнить `tests/integration/pages-slideshow-hero.test.ts` — сценарии publish block / success per locale
- [X] T023 [US2] E2E smoke: страница с slideshow отдаёт контент после seed в `tests/e2e/slideshow.spec.ts` (проверка заголовка слайда в DOM)

### Implementation for User Story 2

- [X] T024 [US2] Русские labels и descriptions полей слайда в `src/heros/config.ts` (admin UX)
- [X] T025 [US2] Ограничить `slides.maxRows: 10` и `minRows: 1` в `src/heros/config.ts` (data-model.md)
- [X] T026 [P] [US2] Документировать шаги проверки admin в `specs/003-slideshow-layout/quickstart.md` (секция Admin)

**Checkpoint**: User Story 2 — CMS-редактирование и валидация слайдов

---

## Phase 5: User Story 3 — Доступность и reduced motion (Priority: P2)

**Goal**: Клавиатура, focus, `prefers-reduced-motion`, один h1 на активный слайд, `aria-hidden` на неактивных

**Independent Test**: Tab по таймлайну и стрелкам; reduced motion — нет autoplay и мгновенная смена

### Tests for User Story 3 (ОБЯЗАТЕЛЬНО)

- [X] T027 [P] [US3] A11y — E2E keyboard + reduced motion в `tests/e2e/slideshow.spec.ts`
- [X] T028 [US3] E2E keyboard navigation и `prefers-reduced-motion` в `tests/e2e/slideshow.spec.ts`

### Implementation for User Story 3

- [X] T029 [US3] Добавить `section[aria-roledescription="carousel"]`, `aria-live`, `aria-hidden` на неактивные слайды в `src/heros/Slideshow/index.tsx` (research.md §6)
- [X] T030 [US3] Реализовать focus-visible и 44×44px targets на стрелках и сегментах в `src/heros/Slideshow/SlideshowTimeline.tsx` и `index.tsx`
- [X] T031 [US3] Единственный `h1` на активный слайд; неактивные без заголовков в accessibility tree — `src/heros/Slideshow/SlideshowSlide.tsx`
- [X] T032 [US3] Отключить autoplay, slide animation и fade-up offset при `useReducedMotion()` в `src/heros/Slideshow/index.tsx` (FR-007b/c, User Story 3)

**Checkpoint**: User Story 3 — доступность и reduced motion

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: SEO, локали, адаптив, производительность

- [X] T033 [P] E2E slideshow на `/ka` и `/en` в `tests/e2e/slideshow.spec.ts`
- [X] T034 [P] E2E mobile 320px: таймлайн, без horizontal scroll в `tests/e2e/slideshow.spec.ts`
- [X] T035 [P] Проверить `alt` изображений слайдов (из title) в `src/heros/Slideshow/SlideshowSlide.tsx` (FR-013)
- [X] T036 [P] `priority` только для первого изображения; `loading="lazy"` для остальных в `SlideshowSlide.tsx` (plan.md PageSpeed)
- [X] T037 Запустить `npm run test:unit` и `npm run test:e2e -- tests/e2e/slideshow.spec.ts` — все green
- [X] T038 Выполнить чеклист из `specs/003-slideshow-layout/quickstart.md` (PageSpeed `/ru` ≥ 90 — ручная проверка Lighthouse)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: без зависимостей
- **Foundational (Phase 2)**: после Setup — **блокирует** все user stories
- **US1 (Phase 3)**: после Foundational — **MVP** для посетителей
- **US2 (Phase 4)**: после Foundational; параллельно с US1 после T008 (схема уже есть)
- **US3 (Phase 5)**: после US1 (нужен рабочий `SlideshowHero`)
- **Polish (Phase 6)**: после US1–US3

### User Story Dependencies

| Story | Зависит от | Независимый тест |
|-------|------------|------------------|
| US1 | Phase 2 | `/ru` + seed slideshow |
| US2 | Phase 2 | Admin publish validation |
| US3 | US1 | keyboard + reduced motion |

### Parallel Opportunities

- Phase 1: T002–T005 параллельно после T001
- Phase 2: T010 параллельно с T009 после T008
- US1: T011–T012 параллельно; T014–T015 параллельно; T019 параллельно с T017
- US2: T022–T024 параллельно с хвостом US1 после T008
- Polish: T033–T036 параллельно

### Parallel Example: User Story 1

```bash
# Тесты (после T009):
tests/unit/heros/SlideshowTimeline.test.tsx
tests/unit/components/SlideshowHero.test.tsx

# Компоненты:
src/heros/Slideshow/SlideshowSlide.tsx
src/heros/Slideshow/SlideshowTimeline.tsx
# затем index.tsx (T016)
```

---

## Implementation Strategy

### MVP First (User Story 1)

1. Phase 1 Setup  
2. Phase 2 Foundational  
3. Phase 3 US1 (+ seed T021)  
4. **STOP**: E2E `slideshow.spec.ts` green на `/ru`  
5. Добавить US2, US3, Polish

### Suggested MVP scope

**US1 only** (T001–T021): публичное слайдшоу с таймлайном, loop, анимациями и demo-контентом на главной.

---

## Notes

- Левый промо-блок «Подписка на пресейлы» — **out of scope** (spec.md)
- Изображение слайда не локализуется в v1 (data-model.md)
- После T008 обязательно перегенерировать типы перед UI-работой
