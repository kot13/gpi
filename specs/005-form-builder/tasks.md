---
description: "Task list for 005-form-builder — конструктор форм и заявка на консультацию GPI"
---

# Tasks: Конструктор форм и заявка на консультацию

**Input**: Design documents from `/specs/005-form-builder/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: ОБЯЗАТЕЛЬНЫ (конституция GPI, принцип IV; plan.md — Vitest + Playwright)

**Organization**: Задачи сгруппированы по user story для независимой реализации и тестирования.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Можно выполнять параллельно (разные файлы, нет зависимостей)
- **[Story]**: User story из spec.md (US1–US3)

## Path Conventions

Монорепозиторий Payload CMS 3 + Next.js — см. [plan.md](./plan.md). Коллекции `forms`, `form-submissions`; UI в `src/components/forms/`; интеграция в `src/Footer/Component.tsx`.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Зависимости, lib/forms, i18n, иконка телефона

- [X] T001 Установить `libphonenumber-js` в `package.json` (research.md §4, plan.md)
- [X] T002 [P] Создать `src/lib/forms/types.ts` и `src/lib/forms/contactMethods.ts` — 6 способов связи, i18n keys (data-model.md, contracts/form-ui.md)
- [X] T003 [P] Создать `src/lib/forms/countries.ts` — ISO2, dialCode, flag emoji, default `GE` +995 (data-model.md)
- [X] T004 [P] Создать `src/lib/forms/validateContact.ts` — pure validation per contactMethod (data-model.md, FR-006, FR-007)
- [X] T005 [P] Добавить ключи `forms.*` (методы связи, ошибки, aria-labels) в `src/lib/i18n/messages/ru.json`, `ka.json`, `en.json` (contracts/form-ui.md, FR-005)
- [X] T006 [P] Добавить иконку `phone` в `src/components/ui/icons/` и экспорт в `socialIconMap` (contracts/form-ui.md)
- [X] T007 [P] Unit-тесты `validateContact.ts` в `tests/unit/lib/forms/validateContact.test.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Коллекции CMS, hooks, queries, типы — MUST до user stories

**⚠️ CRITICAL**: User story work не начинается до завершения этой фазы

- [X] T008 Создать `src/collections/Forms/index.ts` — поля по `data-model.md` и `contracts/cms-forms-collection.md` (localized title, submitButtonLabel, successMessage, privacyPage, placement, formType, drafts)
- [X] T009 Создать `src/collections/Forms/hooks/validateSingleFooterForm.ts` — max 1 published footer form (data-model.md)
- [X] T010 Создать `src/collections/Forms/hooks/revalidateForms.ts` — revalidate footer tag/paths ru/ka/en (research.md §8)
- [X] T011 Создать `src/collections/FormSubmissions/index.ts` — поля заявки, access create public / read authenticated (data-model.md, contracts/form-submission-api.md)
- [X] T012 Создать `src/collections/FormSubmissions/hooks/normalizeSubmission.ts` и `rejectSpam.ts` — contactDisplay, honeypot (contracts/form-submission-api.md)
- [X] T013 Подключить `Forms` и `FormSubmissions` в `src/payload.config.ts`
- [X] T014 Выполнить `npm run db:push` и `npm run generate:types` — обновить `src/payload-types.ts`
- [X] T015 [P] Создать `src/lib/forms/queries.ts` — `getFooterForm(locale)` с фильтром placement+published (contracts/cms-forms-collection.md)
- [X] T016 [P] Integration-тест коллекции `forms` в `tests/integration/forms-collection.test.ts` — duplicate footer publish, draft hidden
- [X] T017 [P] Integration-тест `form-submissions` в `tests/integration/form-submissions.test.ts` — anonymous create, honeypot reject, invalid phone

**Checkpoint**: Foundation ready — схема CMS, типы, queries и API заявок доступны

---

## Phase 3: User Story 1 — Заявка на консультацию из подвала сайта (Priority: P1) 🎯 MVP

**Goal**: Посетитель видит форму в подвале над навигацией, выбирает способ связи, отправляет заявку; для «Телефон» — country picker в pill-поле по макету

**Independent Test**: `/ru` → подвал → выбор «Телефон» → country picker + номер → отправка → success message; privacy link в новой вкладке

### Tests for User Story 1 (ОБЯЗАТЕЛЬНО)

> **NOTE: Написать тесты ПЕРВЫМИ, убедиться что они FAIL до реализации**

- [X] T018 [P] [US1] Расширить `tests/integration/globals/footer.test.ts` — footer рендерит ConsultationFormSection при published footer form
- [X] T019 [P] [US1] E2E в `tests/e2e/consultation-form.spec.ts` — phone picker, submit, success, privacy `target=_blank`

### Implementation for User Story 1

- [X] T020 [P] [US1] Создать `src/components/forms/PhoneContactInput.tsx` — pill-поле: flag + dial code select слева, masked input справа (contracts/form-ui.md, clarification 2026-06-06)
- [X] T021 [P] [US1] Создать `src/components/forms/ContactMethodPicker.tsx` — 6 иконок, radiogroup, selected ring brand, touch ≥44px (contracts/form-ui.md)
- [X] T022 [P] [US1] Создать `src/components/forms/ContactField.tsx` — switch по contactMethod; reuse PhoneContactInput для phone/whatsapp/viber (FR-006)
- [X] T023 [P] [US1] Создать `src/components/forms/FormPrivacyLink.tsx` и `FormStatusMessage.tsx` — `target="_blank"` `rel="noopener noreferrer"`, `aria-live` (FR-008)
- [X] T024 [US1] Создать `src/components/forms/ConsultationForm.tsx` — client, `react-hook-form`, POST `/api/form-submissions`, double-submit guard (contracts/form-submission-api.md, FR-009)
- [X] T025 [US1] Создать `src/components/forms/ConsultationFormSection.tsx` — тёмный фон, `h2` title, responsive layout (contracts/form-ui.md, FR-004)
- [X] T026 [US1] Интегрировать форму в `src/Footer/Component.tsx` — `getFooterForm(locale)`, секция **над** nav/company block (FR-003)
- [X] T027 [US1] Минимальный seed опубликованной формы `consultation` в `src/endpoints/seed/forms.ts` + подключение в `src/endpoints/seed/index.ts` для dev/E2E US1

**Checkpoint**: User Story 1 — публичная форма в подвале, заявка сохраняется в БД

---

## Phase 4: User Story 2 — Управление формами в конструкторе (Priority: P2)

**Goal**: Менеджер создаёт/редактирует формы в админке, локализует тексты, назначает footer placement, публикует

**Independent Test**: Admin → Forms → изменить title ka → publish → `/ka` показывает новый заголовок; снятие с публикации скрывает форму

### Tests for User Story 2 (ОБЯЗАТЕЛЬНО)

- [X] T028 [P] [US2] Расширить `tests/integration/forms-collection.test.ts` — localized fields ru/ka/en, switch placement footer→none
- [X] T029 [P] [US2] Integration-тест revalidate в `tests/integration/forms-collection.test.ts` — afterChange forms triggers footer cache invalidation

### Implementation for User Story 2

- [X] T030 [US2] Русские admin labels, tabs (Контент / Настройки) и `defaultColumns` в `src/collections/Forms/index.ts` (contracts/cms-forms-collection.md)
- [X] T031 [US2] Подключить hooks `validateSingleFooterForm`, `revalidateForms` в `src/collections/Forms/index.ts`
- [X] T032 [US2] Доработать `src/endpoints/seed/forms.ts` — полные тексты ru/ka/en по макету, `privacyPage` relation (FR-002, quickstart.md)
- [X] T033 [US2] Read access filter — публично только published forms в `src/collections/Forms/index.ts` (data-model.md)
- [X] T034 [US2] Документировать шаги Admin в `specs/005-form-builder/quickstart.md` (секция Admin checklist)

**Checkpoint**: User Story 2 — конструктор форм в панели, контент-команда управляет текстами

---

## Phase 5: User Story 3 — Просмотр и обработка заявок (Priority: P3)

**Goal**: Менеджер видит список заявок, фильтрует по дате, отмечает «обработана»

**Independent Test**: Отправить заявку с сайта → Admin → Form Submissions → запись с name, contactMethod, contactDisplay, locale, status new → mark processed

### Tests for User Story 3 (ОБЯЗАТЕЛЬНО)

- [X] T035 [P] [US3] Расширить `tests/integration/form-submissions.test.ts` — date filter query, status update authenticated only
- [X] T036 [P] [US3] Integration-тест — submission содержит countryCode+dialCode для phone в `tests/integration/form-submissions.test.ts`

### Implementation for User Story 3

- [X] T037 [US3] Admin `defaultColumns`, `defaultSort: -submittedAt`, list filters (date range, status) в `src/collections/FormSubmissions/index.ts` (FR-010, contracts/cms-forms-collection.md)
- [X] T038 [US3] Read-only поля заявки в admin detail view; editable только `status` в `src/collections/FormSubmissions/index.ts`
- [X] T039 [US3] Визуальное различие status `new` vs `processed` в admin list (badge/цвет) в `src/collections/FormSubmissions/index.ts`
- [X] T040 [US3] Доработать `normalizeSubmission.ts` — E.164 contactDisplay для phone/whatsapp/viber (data-model.md)
- [X] T041 [US3] E2E smoke: submit → verify в admin через API или test helper в `tests/e2e/consultation-form.spec.ts`

**Checkpoint**: User Story 3 — полный цикл лидогенерации для менеджера

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Локали, адаптив, a11y, производительность, финальная проверка

- [X] T042 [P] E2E форма на `/ka` и `/en` в `tests/e2e/consultation-form.spec.ts` — все 6 contact methods smoke
- [X] T043 [P] E2E mobile 320px: форма в подвале без horizontal scroll, touch targets в `tests/e2e/consultation-form.spec.ts` (FR-011, SC-004)
- [X] T044 [P] Проверить `h2` заголовок формы (не `h1`) на catalog, blog, home в footer section (принцип V)
- [X] T045 [P] RTL unit-тесты `PhoneContactInput` и `ContactMethodPicker` в `tests/unit/components/forms/` — смена country/method сбрасывает контакт (edge cases spec)
- [X] T046 Запустить `npm run test:unit`, `npm run test:integration`, `npm run test:e2e -- tests/e2e/consultation-form.spec.ts` — все green
- [X] T047 Выполнить чеклист `specs/005-form-builder/quickstart.md` (Lighthouse mobile `/ru` ≥ 90 — ручная проверка)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: без зависимостей
- **Foundational (Phase 2)**: после Setup — **блокирует** все user stories
- **US1 (Phase 3)**: после Phase 2 — **MVP для посетителей** (+ T027 seed для E2E)
- **US2 (Phase 4)**: после Phase 2; расширяет admin/seed поверх T008; параллельно с US1 после T014
- **US3 (Phase 5)**: после Phase 2; желательно после US1 (есть реальные заявки для проверки admin)
- **Polish (Phase 6)**: после US1–US3

### User Story Dependencies

| Story | Зависит от | Независимый тест |
|-------|------------|------------------|
| US1 | Phase 2 (+ T027 seed) | Публичная форма + submit с `/ru` |
| US2 | Phase 2 | Admin edit form → отражение на сайте |
| US3 | Phase 2 (+ US1 submit) | Admin list + status processed |

### Parallel Opportunities

- Phase 1: T002–T007 параллельно после T001
- Phase 2: T015–T017 параллельно после T014
- US1: T018–T019 параллельно; T020–T023 параллельно; затем T024–T026
- US2: T028–T029 параллельно
- US3: T035–T036 параллельно
- Polish: T042–T045 параллельно

### Parallel Example: User Story 1

```bash
# Тесты (после T014, T027):
tests/integration/globals/footer.test.ts
tests/e2e/consultation-form.spec.ts

# Компоненты (параллельно):
src/components/forms/PhoneContactInput.tsx
src/components/forms/ContactMethodPicker.tsx
src/components/forms/ContactField.tsx
src/components/forms/FormPrivacyLink.tsx
# затем ConsultationForm.tsx → Footer/Component.tsx
```

---

## Implementation Strategy

### MVP First (User Story 1)

1. Phase 1 Setup
2. Phase 2 Foundational
3. Phase 3 US1 (+ T027 seed)
4. **STOP**: E2E submit green на `/ru`
5. Добавить US2 → US3 → Polish

### Incremental Delivery

1. Setup + Foundational → schema + API ready
2. US1 → лиды с сайта (MVP для бизнеса)
3. US2 → контент-команда управляет формой
4. US3 → менеджеры обрабатывают заявки
5. Polish → 3 locales, mobile, PageSpeed

### Suggested MVP scope

**US1 only** (T001–T027): форма в подвале + приём заявок — основная ценность фичи.

**Полная фича**: T001–T047 — конструктор, заявки, admin workflow, polish.

---

## Notes

- Phone country picker — только inline pill по макету (clarify 2026-06-06); WhatsApp/Viber reuse `PhoneContactInput` в v1
- Форма не рендерится на `/admin` и служебных маршрутах (Assumptions)
- После T014 обязательно `generate:types` перед UI-компонентами
- POST заявок — Payload REST, не Server Action (research.md §3)
- CRM/email уведомления — out of scope v1
