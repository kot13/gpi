# Research: 005-form-builder

**Date**: 2026-06-06

## 1. Конструктор форм: plugin vs кастомные коллекции

**Decision**: Две Payload-коллекции — `forms` (конфигурация и публикация) и `form-submissions` (заявки). Поле `formType` с шаблоном `consultation` в v1; рендер на фронте — типизированный React-компонент под шаблон.

**Rationale**: `@payloadcms/plugin-form-builder` даёт generic-поля (text, email, select), но не покрывает макет: ряд иконок способов связи, inline country picker в одном pill-поле, динамическая маска контакта (FR-004, FR-006). Кастомный шаблон + CMS-конфиг (локализованные тексты, ссылка на политику, placement) — баланс «конструктора» и контроля UX.

**Alternatives considered**:
- **plugin-form-builder + custom field blocks** — возможно позже; для v1 избыточная сложность расширения плагина.
- **Только global singleton** — отклонено: spec требует конструктор с возможностью нескольких форм (Assumptions).
- **Хардкод формы в коде без CMS** — отклонено: нарушает FR-001, FR-002.

---

## 2. Размещение в подвале

**Decision**: Коллекция `forms` с полями `placement: 'footer' | 'none'` и `status: draft | published`. В `Footer` server component — запрос опубликованной формы с `placement === 'footer'` (limit 1; hook `beforeChange` запрещает две активные footer-формы). Блок формы рендерится **над** существующим контейнером с навигацией и юридическим текстом.

**Rationale**: FR-003 — форма над навигацией на всех публичных страницах; данные формы подтягиваются на этапе SSG/ISR вместе с global `footer`.

**Alternatives considered**:
- Поле `footerForm` в global Footer — дублирует сущность Form; связь менее явная.
- Отдельный global только для формы — отклонено при требовании конструктора нескольких форм.

---

## 3. Отправка заявки (API)

**Decision**: Публичный `POST` через Payload REST (`/api/form-submissions`) с access `create: () => true`, `read/update/delete: authenticated`. Дополнительно: custom hook `beforeValidate` — honeypot, нормализация телефона, лимит длины полей. Опциональный rate limit на уровне middleware/route wrapper (in-memory / IP, v1).

**Rationale**: Конституция II — публичные **страницы** статичны; запись заявки — единичный динамический POST, не SSR. Payload REST — best practice проекта (принцип III).

**Alternatives considered**:
- Server Action из client form — допустимо, но менее прозрачно для integration-тестов Payload.
- Email-only без БД — отклонено: FR-010 требует список заявок в панели.

---

## 4. Поле телефона с кодом страны

**Decision**: Кастомный client-компонент `PhoneContactInput`: слева Radix `Select` (флаг emoji + dial code), справа `input` с маской; данные стран — статический `src/lib/forms/countries.ts` (~250 записей, tree-shakeable); валидация — `libphonenumber-js` (`parsePhoneNumberFromString`, import из `/min`).

**Rationale**: Clarification 2026-06-06 — единое pill-поле как на макете; Radix уже в зависимостях; default `GE` +995. WhatsApp и Viber в v1 переиспользуют тот же компонент (единый UX выбора страны).

**Alternatives considered**:
- `react-international-phone` — быстрее старт, но меньше контроля над pill-стилем макета GPI.
- `<input type="tel">` без страны — отклонено по spec.

---

## 5. Способы связи и иконки

**Decision**: Константа `CONTACT_METHODS` в `src/lib/forms/contactMethods.ts`: `phone | telegram | whatsapp | vk | viber | messenger`. Иконки — переиспользовать `socialIconMap` из `src/components/ui/icons/`; для `phone` — добавить иконку Lucide `Phone` или SVG в том же стиле.

**Rationale**: Единый визуальный язык с шапкой/блогом; FR-006, FR-012 (aria-labels из i18n).

---

## 6. Client island и PageSpeed

**Decision**: `ConsultationForm` — `'use client'` island в подвале; конфиг формы (заголовок, кнопка, privacy URL) передаётся props с сервера из SSG. Динамический `import()` не требуется — форма лёгкая; lazy footer form опционально только если bundle > budget.

**Rationale**: Принцип VI — минимальный JS; интерактив формы невозможен без client. Заголовок формы — семантически `h2` (не `h1` — h1 на странице один).

**Alternatives considered**:
- Полностью server form + full page reload — ухудшает UX и не даёт динамического поля контакта.

---

## 7. Локализация

**Decision**: Локализованные поля в `forms` (title, submitButtonLabel, successMessage, privacyLinkLabel) через Payload `localized: true`. Системные сообщения валидации — `src/lib/i18n/messages/{ru,ka,en}.json` ключи `forms.*`. Ссылка на политику — `relationship` к `pages` + resolve URL per locale через существующий `CMSLink` pattern.

**Rationale**: Принцип VIII; FR-005.

---

## 8. Revalidation

**Decision**: Hooks `afterChange` на `forms` и `form-submissions` (только forms) → `revalidateTag('footer')` / `revalidatePath` по паттерну `revalidateFooter`.

**Rationale**: Изменение текстов формы должно попадать на сайт без полного rebuild.

---

## 9. Seed

**Decision**: Seed-скрипт создаёт форму `consultation` с ru/ka/en текстами по макету, `placement: footer`, `status: published`; privacy page — relation к существующей CMS-странице политики (или создаётся stub).

**Rationale**: FR-002, quickstart для разработчиков.
