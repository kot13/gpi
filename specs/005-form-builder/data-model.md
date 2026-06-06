# Data Model: 005-form-builder

**Date**: 2026-06-06

## Обзор

| Сущность | Тип | Slug |
|----------|-----|------|
| Форма | Collection | `forms` |
| Заявка | Collection | `form-submissions` |

Связи: `form-submissions.form` → `forms` (required). `forms.privacyPage` → `pages` (optional, localized resolve).

---

## Collection: `forms`

Конфигурация публичных форм и «конструктор» для менеджеров.

| Поле | Тип | Локализация | Обязательность | Описание |
|------|-----|-------------|----------------|----------|
| `title` | text | да | да | Заголовок над формой (капс на фронте через CSS) |
| `slug` | text | нет | да | Уникальный идентификатор (`consultation`) |
| `formType` | select | нет | да | `consultation` (v1); расширяемо |
| `submitButtonLabel` | text | да | да | Текст кнопки («Связаться с нами») |
| `successMessage` | text | да | да | Сообщение после успешной отправки |
| `privacyPage` | relationship → pages | нет | нет | Страница политики; URL строится per locale |
| `privacyLinkLabel` | text | да | нет | Подпись ссылки (default: «Политика конфиденциальности») |
| `placement` | select | нет | да | `footer` \| `none` |
| `_status` | drafts | нет | — | `draft` \| `published` |

### Правила

- Одновременно только **одна** опубликованная форма с `placement: footer` (hook `beforeChange`).
- Публично отображается: `_status === published` && `placement === footer`.
- Поля формы (имя, способ связи, контакт) **не** хранятся в CMS как blocks в v1 — заданы шаблоном `formType: consultation` (см. contracts).

### Состояния

```text
draft → published → draft (снятие)
published + placement footer → видна в подвале
published + placement none → скрыта с сайта
```

---

## Collection: `form-submissions`

Заявки посетителей.

| Поле | Тип | Обязательность | Описание |
|------|-----|----------------|----------|
| `form` | relationship → forms | да | Источник формы |
| `name` | text | да | Имя (max 120) |
| `contactMethod` | select | да | `phone` \| `telegram` \| `whatsapp` \| `vk` \| `viber` \| `messenger` |
| `countryCode` | text | условно | ISO 3166-1 alpha-2; для phone/whatsapp/viber |
| `dialCode` | text | условно | E.164 prefix, напр. `+995` |
| `contactValue` | text | да | Номер без кода / username / URL / id |
| `contactDisplay` | text | нет | Нормализованное отображение для админки (E.164 или @user) |
| `locale` | select | да | `ru` \| `ka` \| `en` |
| `status` | select | да | `new` \| `processed` (default: `new`) |
| `submittedAt` | date | да | auto on create |
| `honeypot` | text | нет | hidden; must be empty |

### Валидация (hooks / beforeValidate)

| contactMethod | countryCode + dialCode | contactValue |
|---------------|------------------------|--------------|
| phone | required | valid E.164 после concat |
| whatsapp | required | valid phone |
| viber | required | valid phone |
| telegram | — | `@username` (5–32) или phone |
| vk | — | URL vk.com / short id |
| messenger | — | facebook.com / m.me URL или id |

`name`: trim, length 1–120.

### Индексы

- `form`, `submittedAt` (desc) — список в админке
- `status` — фильтр новых

---

## Дополнительные артефакты (не БД)

| Файл | Назначение |
|------|------------|
| `src/lib/forms/countries.ts` | Список стран: code, dialCode, flag emoji, mask hint |
| `src/lib/forms/contactMethods.ts` | Метаданные способов связи + i18n keys |
| `src/lib/forms/validateContact.ts` | Pure functions для unit-тестов |

---

## Access control

| Collection | create | read | update | delete |
|------------|--------|------|--------|--------|
| `forms` | authenticated | public (published only) | authenticated | authenticated |
| `form-submissions` | public | authenticated | authenticated | authenticated |

Публичное чтение `forms` — только опубликованные записи (filter access).
