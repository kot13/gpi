# Implementation Plan: Конструктор форм и заявка на консультацию

**Branch**: `005-form-builder` | **Date**: 2026-06-06 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/005-form-builder/spec.md`

## Summary

Добавить конструктор форм в Payload CMS (коллекция **`forms`**) и приём заявок (**`form-submissions`**). Первая форма — шаблон **`consultation`**: имя, выбор способа связи (6 иконок), динамическое поле контакта (для «Телефон» — inline country picker с флагом и кодом в pill-поле по макету), кнопка отправки, ссылка на политику в новой вкладке. Опубликованная форма с `placement: footer` отображается **над навигацией** в подвале на всех публичных страницах.

Технический подход: конфиг формы — SSG через запрос в server `Footer`; интерактив — client island `ConsultationForm` (`react-hook-form` + валидация); отправка — Payload REST `POST /api/form-submissions`; телефон — `PhoneContactInput` + `libphonenumber-js` + статический список стран.

## Technical Context

**Language/Version**: TypeScript 5.8 / Node.js 20 LTS / Next.js 15.3 App Router / React 19 / Payload CMS 3.85

**Primary Dependencies**: `react-hook-form` (уже в проекте); `libphonenumber-js` (валидация телефона); `@radix-ui/react-select` (country picker); существующие `socialIconMap`, design tokens `GPI_TOKENS`, `next-intl`

**Storage**: PostgreSQL — таблицы `forms`, `form-submissions`; `npm run db:push` + `generate:types`

**Testing**: Vitest + RTL (validateContact, countries, form components); integration (collections, access, footer query, POST submission); Playwright E2E (footer form, phone picker, submit, 3 locales)

**Target Platform**: SSG/ISR для страниц; динамический POST для заявок (не SSR страниц)

**Project Type**: CMS collections + footer UI + shared lib

**Performance Goals**: PageSpeed ≥ 90 на страницах с формой в подвале; client bundle формы минимален (без тяжёлых UI-kit); country list static import tree-shaken

**Constraints**: ru/ka/en; форма не на `/admin`; touch ≥ 44px; h2 для заголовка формы (один h1 на странице)

**Scale/Scope**: 2 коллекции, ~1 шаблон формы, 8–12 компонентов, изменение `Footer`, seed, 3 user stories

### Breakpoints (конституция IX + макет)

| Имя | Диапазон | Tailwind | Поведение формы |
|-----|----------|----------|-----------------|
| mobile | 320–767px | default | Иконки способов связи — wrap/scroll; поля full width; кнопка full width |
| tablet | 768–979px | `md:` | Иконки в ряд; форма max-w-lg centered |
| desktop | 980–1919px | `lg:` | Секция формы full width тёмный фон; контент max-w-xl center |
| wide | 1920px+ | `xl:` | container max-w как у сайта |

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **I. Русский язык**: spec, plan, contracts, research на русском
- [x] **II. Статика**: публичные страницы SSG; конфиг формы на build/ISR; POST заявки — API exception (не SSR страниц)
- [x] **III. Best practices**: Payload collections + drafts + access; Next.js server Footer + client island; переиспользование Radix/icons
- [x] **IV. Тесты**: unit (validateContact) + integration (forms, submissions, footer) + E2E (consultation-form) в tasks
- [x] **V. SEO/GEO**: форма в footer — `h2`, не ломает иерархию; без отдельных URL; privacy link корректный
- [x] **VI. PageSpeed**: лёгкий client island; libphonenumber `/min`; без лишних зависимостей
- [x] **VII. PostgreSQL**: новые коллекции; schema via db:push
- [x] **VIII. Трёхъязычность**: localized fields в forms; messages forms.*; E2E ru/ka/en
- [x] **IX. Адаптивность**: mobile-first; breakpoints выше; 44px targets на picker и кнопке

**Post-design re-check**: Client JS в подвале обоснован интерактивом (FR-006, FR-009) при SSG-конфиге формы. POST `/api/form-submissions` — стандартный паттерн Payload, не нарушает статику публичных маршрутов.

## Project Structure

### Documentation (this feature)

```text
specs/005-form-builder/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── cms-forms-collection.md
│   ├── form-ui.md
│   └── form-submission-api.md
└── tasks.md              # Phase 2 — /speckit-tasks
```

### Source Code

```text
src/
├── collections/
│   ├── Forms/
│   │   ├── index.ts
│   │   └── hooks/
│   │       ├── validateSingleFooterForm.ts
│   │       └── revalidateForms.ts
│   └── FormSubmissions/
│       ├── index.ts
│       └── hooks/
│           ├── normalizeSubmission.ts
│           └── rejectSpam.ts
├── lib/
│   └── forms/
│       ├── contactMethods.ts
│       ├── countries.ts
│       ├── validateContact.ts
│       ├── types.ts
│       └── queries.ts           # getFooterForm(locale)
├── components/
│   └── forms/
│       ├── ConsultationForm.tsx       # client
│       ├── ConsultationFormSection.tsx
│       ├── ContactMethodPicker.tsx
│       ├── PhoneContactInput.tsx
│       ├── ContactField.tsx
│       ├── FormPrivacyLink.tsx
│       └── FormStatusMessage.tsx
├── Footer/
│   └── Component.tsx                  # + form section above nav
├── lib/i18n/messages/
│   ├── ru.json                        # forms.*
│   ├── ka.json
│   └── en.json
├── endpoints/seed/
│   └── forms.ts
└── payload.config.ts                  # register Forms, FormSubmissions

tests/
├── unit/lib/forms/
│   └── validateContact.test.ts
├── integration/
│   ├── forms-collection.test.ts
│   ├── form-submissions.test.ts
│   └── globals/footer.test.ts         # extend
└── e2e/
    └── consultation-form.spec.ts
```

**Structure Decision**: Монорепозиторий Payload + Next.js. Конструктор = коллекция `forms` с шаблонами; кастомный UI рендерер per `formType`. Плагин form-builder не используется (см. research.md §1).

## Complexity Tracking

> Нарушений конституции, требующих исключения, нет.

| Topic | Decision | Simpler Alternative Rejected Because |
|-------|----------|--------------------------------------|
| Client island в footer | ConsultationForm client | Server-only не поддерживает динамический contact field |
| POST API | Payload REST | Email-only без БД нарушает FR-010 |

## Phase 0 & 1 Artifacts

| Artifact | Path | Status |
|----------|------|--------|
| Research | [research.md](./research.md) | ✅ |
| Data model | [data-model.md](./data-model.md) | ✅ |
| CMS contract | [contracts/cms-forms-collection.md](./contracts/cms-forms-collection.md) | ✅ |
| UI contract | [contracts/form-ui.md](./contracts/form-ui.md) | ✅ |
| API contract | [contracts/form-submission-api.md](./contracts/form-submission-api.md) | ✅ |
| Quickstart | [quickstart.md](./quickstart.md) | ✅ |

## Implementation Notes (для /speckit-tasks)

1. **Порядок**: коллекции + hooks → lib/forms → components → Footer integration → seed → tests
2. **Footer layout**: новая секция `<ConsultationFormSection>` **перед** `<div className="container ...">` с nav/company или внутри footer как первый блок full-width dark bg
3. **Privacy URL**: resolve `privacyPage` slug per locale через `getPageUrl(locale, slug)` pattern из CMS
4. **Admin list submissions**: default sort `-submittedAt`; filter `status: new`
5. **Иконка phone**: добавить в `src/components/ui/icons/` если отсутствует
