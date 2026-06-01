# Contract: CMS Collection — properties

**Feature**: 004-property-catalog  
**Date**: 2026-06-01

## Collection config

```typescript
{
  slug: 'properties',
  versions: { drafts: true },
  admin: {
    group: 'Недвижимость',
    useAsTitle: 'title',
    defaultColumns: ['objectCode', 'title', 'city', 'listingStatus', 'updatedAt'],
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
}
```

## Fields (contract)

### Core

```yaml
objectCode:
  type: text
  required: true
  unique: true
  index: true
  admin:
    description: Уникальный код объекта (URL)

listingStatus:
  type: select
  required: true
  defaultValue: draft
  options:
    - { label: Черновик, value: draft }
    - { label: Активен, value: active }
    - { label: Неактивен, value: inactive }

title:
  type: text
  localized: true
  required: true

description:
  type: textarea
  localized: true
  required: true
```

### Location & geo

```yaml
city:
  type: select
  required: true
  options: [Tbilisi, Batumi]

district:
  type: text

street:
  type: text

lat:
  type: number

lng:
  type: number
```

### Pricing & specs

```yaml
priceUsd: { type: number, required: true, min: 0 }
priceGel: { type: number, required: true, min: 0 }
area: { type: number, required: true, min: 0 }
rooms: { type: number, required: true, min: 0 }
floor: { type: number }
totalFloors: { type: number }
condition: { type: select, options: [renovated, new, good, premium] }
repair: { type: select, options: [renovated, white_frame, black_frame, unknown] }
layout: { type: select, options: [studio, "1+1", "2+1", "3+1", 4plus] }
heating: { type: select, options: [gas, electric, unknown] }
readiness: { type: select, options: [ready, building, unknown] }
buildingType: { type: text }
features:
  type: select
  hasMany: true
  options: [balcony, elevator, parking, sea_view, mountain_view, city_view, new_building, renovated, furnished, near_metro, terrace, old_town, central_heating, boulevard]
```

### Media & links

```yaml
photos:
  type: array
  fields:
    - name: image
      type: upload
      relationTo: media
      required: true

crmUrl: { type: text }
telegramUrl: { type: text }
driveFolderUrl: { type: text }

updatedAt:
  type: date
  admin:
    date: { pickerAppearance: dayOnly }
```

### SEO plugin fields

```yaml
meta:
  # MetaTitleField, MetaDescriptionField, MetaImageField, OverviewField, PreviewField
  # localized: true
```

## Hooks

| Hook | Responsibility |
|------|----------------|
| `beforeChange` | `validatePropertyPublish` — publish rules, unique objectCode |
| `afterChange` | `revalidateProperty` — paths + sitemap |
| `afterDelete` | `revalidateProperty` |

## TypeScript shape (after `generate:types`)

```typescript
export interface Property {
  id: string
  objectCode: string
  listingStatus: 'draft' | 'active' | 'inactive'
  title: string
  description: string
  city: 'Tbilisi' | 'Batumi'
  district?: string | null
  street?: string | null
  lat?: number | null
  lng?: number | null
  priceUsd: number
  priceGel: number
  area: number
  rooms: number
  floor?: number | null
  totalFloors?: number | null
  condition?: 'renovated' | 'new' | 'good' | 'premium' | null
  repair?: 'renovated' | 'white_frame' | 'black_frame' | 'unknown' | null
  layout?: 'studio' | '1+1' | '2+1' | '3+1' | '4plus' | null
  heating?: 'gas' | 'electric' | 'unknown' | null
  readiness?: 'ready' | 'building' | 'unknown' | null
  buildingType?: string | null
  features?: string[] | null
  photos?: { image: string | Media; id?: string }[] | null
  crmUrl?: string | null
  telegramUrl?: string | null
  driveFolderUrl?: string | null
  updatedAt?: string | null
  meta?: { ... }
  _status?: 'draft' | 'published'
}
```

## Admin UX

- Tab «Основное»: code, status, title, description, dates
- Tab «Локация»: city, district, street, lat, lng
- Tab «Характеристики»: prices, area, rooms, floors, enums
- Tab «Медиа и ссылки»: photos, telegram, crm, drive
- Tab «SEO»: meta group

## Integration tests MUST verify

- Duplicate `objectCode` → error
- Publish without ka title → error
- `listingStatus: inactive` + published → not in `getActiveProperties`
- Photo order preserved in API response
