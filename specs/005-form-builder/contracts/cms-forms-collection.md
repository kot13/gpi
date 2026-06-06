# Contract: CMS — коллекции forms и form-submissions

**Feature**: 005-form-builder  
**Date**: 2026-06-06

## Регистрация

```text
payload.config.ts
  collections: [..., Forms, FormSubmissions]
```

## Admin UX

### Forms

- Группа меню: **Forms** (или **Формы**)
- Список: `title`, `slug`, `formType`, `placement`, `_status`
- Форма редактирования:
  - Tab **Content**: title, submitButtonLabel, successMessage (localized tabs ru/ka/en)
  - Tab **Settings**: slug, formType (read-only `consultation` в seed), placement, privacyPage, privacyLinkLabel
  - Publish sidebar (drafts)

### Form Submissions

- Группа: **Form Submissions** / **Заявки**
- Список: `submittedAt`, `name`, `contactMethod`, `contactDisplay`, `locale`, `status`
- Фильтры: date range, status, form
- Деталь: read-only поля заявки; editable только `status`

## Hooks

| Hook | Collection | Назначение |
|------|------------|------------|
| `validateSingleFooterForm` | forms | beforeChange — max 1 published footer form |
| `revalidateForms` | forms | afterChange — revalidate footer tag |
| `normalizeSubmission` | form-submissions | beforeValidate — contactDisplay, honeypot |
| `rejectSpam` | form-submissions | beforeValidate — empty honeypot |

## Seed (`src/endpoints/seed/forms.ts`)

```json
{
  "slug": "consultation",
  "formType": "consultation",
  "placement": "footer",
  "title": { "ru": "...", "ka": "...", "en": "..." },
  "submitButtonLabel": { "ru": "Связаться с нами", ... },
  "_status": "published"
}
```

## Queries (frontend)

```typescript
// getFooterForm(locale) → Form | null
where: { placement: { equals: 'footer' }, _status: { equals: 'published' } }
limit: 1
locale
depth: 1 // privacyPage
```
