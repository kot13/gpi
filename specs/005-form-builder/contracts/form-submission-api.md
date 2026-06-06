# Contract: Form Submission API

**Feature**: 005-form-builder  
**Date**: 2026-06-06

## Endpoint

**POST** `/api/form-submissions`  
(Payload REST — `src/app/(payload)/api/[...slug]/route.ts`)

## Request body (JSON)

```typescript
{
  form: string              // forms.id
  name: string
  contactMethod: 'phone' | 'telegram' | 'whatsapp' | 'vk' | 'viber' | 'messenger'
  countryCode?: string      // ISO2, required for phone/whatsapp/viber
  dialCode?: string         // e.g. '+995'
  contactValue: string
  locale: 'ru' | 'ka' | 'en'
  honeypot?: string         // must be absent or ''
}
```

## Response

| Status | Body |
|--------|------|
| 201 | `{ doc: { id, ... } }` |
| 400 | `{ errors: [{ field, message }] }` localized keys resolved client-side |
| 403 | honeypot filled / rate limited |
| 404 | form not found or not published |

## Client flow (`ConsultationForm`)

1. Client-side validate (mirror server rules)
2. `fetch('/api/form-submissions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body })`
3. On 201: show success, reset form
4. On 4xx: map errors to fields

## Security (v1)

- Honeypot field `honeypot` hidden via CSS, excluded from tab order
- Server rejects non-empty honeypot
- Optional: rate limit 5 req/min per IP (document in env `FORM_RATE_LIMIT`)

## Integration test

```text
tests/integration/form-submissions.test.ts
  - create submission as anonymous
  - reject invalid phone
  - reject honeypot
  - authenticated read list
```
