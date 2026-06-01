# Data Model: 004-property-catalog

**Date**: 2026-06-01

## Обзор

```
┌──────────────────┐
│    properties    │◄─── публичный каталог + детальные страницы
│  (collection)    │
└────────┬─────────┘
         │ optional hero/SEO
         ▼
┌──────────────────┐
│  pages (slug:    │
│   "properties")  │
└──────────────────┘
```

**Локализация**: `title`, `description`, группа `meta` (SEO plugin) — `ru`, `ka`, `en`.  
Остальные поля — общие для всех локалей (адрес, координаты, цены, код объекта).

---

## Collection: `properties`

Slug: `properties`. Admin group: «Недвижимость». `useAsTitle`: `title` (localized, fallback `objectCode`).

### Идентификация и статусы

| Field | Type | Localized | Required | Notes |
|-------|------|-----------|----------|-------|
| `objectCode` | text | no | yes | Unique; `[a-zA-Z0-9_-]+`; URL segment |
| `listingStatus` | select | no | yes | `draft` \| `active` \| `inactive` |
| `_status` | drafts | no | yes | Payload: `draft` \| `published` |
| `publishedAt` | date | no | no | auto on publish |

**Публичная видимость**: `_status === published` AND `listingStatus === active`.

### Локация

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `city` | select | yes | `Tbilisi` \| `Batumi` |
| `district` | text | no | Район |
| `street` | text | no | Полный адрес строкой |
| `lat` | number | no | -90…90; soft validate Georgia |
| `lng` | number | no | -180…180 |

### Коммерция и площадь

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `priceUsd` | number | yes | > 0 для publish |
| `priceGel` | number | yes | > 0 для publish |
| `area` | number | yes | м² |
| `rooms` | number | yes | целое ≥ 0 |
| `floor` | number | no | |
| `totalFloors` | number | no | |

### Справочники

| Field | Type | Required | Options |
|-------|------|----------|---------|
| `condition` | select | no | `renovated`, `new`, `good`, `premium` |
| `repair` | select | no | `renovated`, `white_frame`, `black_frame`, `unknown` |
| `layout` | select | no | `studio`, `1+1`, `2+1`, `3+1`, `4plus` |
| `heating` | select | no | `gas`, `electric`, `unknown` |
| `readiness` | select | no | `ready`, `building`, `unknown` |
| `buildingType` | text | no | Свободный текст (ЖК и т.д.) |
| `features` | select hasMany | no | см. spec FR-004 |

### Контент

| Field | Type | Localized | Required | Notes |
|-------|------|-----------|----------|-------|
| `title` | text | yes | yes* | *required all locales on publish |
| `description` | textarea | yes | yes* | |
| `photos` | array | no | no | `{ image: upload → media }`, order = gallery order; alt в Media |
| `updatedAt` | date | no | no | Display date; default `now` on save |

### Ссылки

| Field | Type | Notes |
|-------|------|-------|
| `crmUrl` | text | optional URL |
| `telegramUrl` | text | optional URL |
| `driveFolderUrl` | text | optional URL |

### SEO

| Field | Type | Localized | Notes |
|-------|------|-----------|-------|
| `meta` | group (SEO plugin) | yes | title, description, image override |

---

## Array: `photos`

| Subfield | Type | Required |
|----------|------|----------|
| `image` | upload → `media` | yes |

**Validation**: связанная запись Media с заполненным `alt`; max 30 rows recommended. Внешние URL для фото не используются.

---

## State transitions

```
listingStatus: draft ──► active ──► inactive
_status:       draft ──publish──► published
```

Публичный каталог читает только: `published` + `active`.

---

## Validation rules (publish)

1. `objectCode` unique.
2. `priceUsd`, `priceGel`, `area`, `rooms` > 0.
3. `city` set.
4. `title` + `description` заполнены для `ru`, `ka`, `en`.
5. `lat`/`lng`: оба заданы или оба пусты; если заданы — в пределах Грузии (41–43.5, 39.5–46.5).
6. `photos` — опционально (заглушка на UI).

---

## Public URLs

| Resource | URL |
|----------|-----|
| Каталог | `/{locale}/properties` |
| Объект | `/{locale}/properties/{objectCode}` |

`objectCode` не локализуется в path.

---

## Dictionaries (not stored in DB)

Коды → ключи i18n в `src/lib/properties/dictionaries.ts`:

- `cityLabels`, `conditionLabel`, `featureLabel`, `layoutLabel`, `repairLabel`, `heatingLabel`, `readinessLabel` — как в spec/user input; переводы ka/en в `messages/*.json`.

---

## Queries (lib)

| Function | Returns |
|----------|---------|
| `getActiveProperties(locale)` | all published+active, sorted by `-updatedAt` |
| `getPropertyByCode(objectCode, locale)` | single or null |
| `getPropertyStaticParams()` | `{ objectCode }[]` for generateStaticParams |

---

## Seed

Минимум 1 объект (код `1037`, Batumi) по образцу из spec; опционально 2–3 для фильтров в dev.

---

## Access control

| Operation | Rule |
|-----------|------|
| read | `authenticatedOrPublished` (published only for anon) |
| create/update/delete | `authenticated` |

---

## Revalidation targets

- `/{locale}/properties`
- `/{locale}/properties/{objectCode}`
- `properties-sitemap.xml`
