# Contract: Collections Schema

**Feature**: 001-cms-foundation  
**Date**: 2026-05-30

Контракт полей Payload CMS для реализации и integration-тестов.

## Localization Config

```typescript
localization: {
  locales: ['ru', 'ka', 'en'],
  defaultLocale: 'ru',
  fallback: true,
}
```

---

## `pages`

```typescript
{
  slug: 'pages',
  versions: { drafts: true },
  access: {
    read: ({ req }) => req.user || { _status: { equals: 'published' } },
  },
  fields: [
    { name: 'title', type: 'text', localized: true, required: true },
    { name: 'slug', type: 'text', localized: true, required: true, unique: true },
    { name: 'content', type: 'richText', localized: true, required: true },
    // SEO plugin fields → meta group
  ],
}
```

**Hooks**:
- `beforeValidate`: slugify slug
- `beforeChange`: validate all locales on publish
- `afterChange` / `afterDelete`: revalidateFrontend

---

## `blog-categories`

```typescript
{
  slug: 'blog-categories',
  fields: [
    { name: 'title', type: 'text', localized: true, required: true },
    { name: 'slug', type: 'text', localized: true, required: true, unique: true },
    { name: 'description', type: 'textarea', localized: true },
  ],
}
```

**Hooks**:
- `beforeDelete`: setNull on blog-posts.category

---

## `blog-posts`

```typescript
{
  slug: 'blog-posts',
  versions: { drafts: true },
  fields: [
    { name: 'title', type: 'text', localized: true, required: true },
    { name: 'slug', type: 'text', localized: true, required: true, unique: true },
    { name: 'description', type: 'textarea', localized: true, required: true },
    { name: 'featuredImage', type: 'upload', relationTo: 'media', required: false },
    { name: 'content', type: 'richText', localized: true, required: true },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'blog-categories',
      required: false,
    },
  ],
}
```

**Publish validation** (beforeChange):
```typescript
if (data._status === 'published' && !data.featuredImage) {
  throw new Error('featuredImage required for publish')
}
```

---

## Global: `header`

```typescript
{
  slug: 'header',
  fields: [
    {
      name: 'navItems',
      type: 'array',
      fields: [
        { name: 'label', type: 'text', localized: true, required: true },
        { name: 'linkType', type: 'select', options: ['internal', 'external'], required: true },
        { name: 'url', type: 'text', admin: { condition: (_, s) => s.linkType === 'external' } },
        { name: 'page', type: 'relationship', relationTo: 'pages', admin: { condition: (_, s) => s.linkType === 'internal' } },
        { name: 'order', type: 'number', required: true },
      ],
    },
    {
      name: 'socialLinks',
      type: 'array',
      fields: [
        { name: 'platform', type: 'select', options: ['whatsapp','telegram','vk','viber','messenger'], required: true },
        { name: 'url', type: 'text', required: true },
        { name: 'order', type: 'number', required: true },
      ],
    },
  ],
}
```

---

## Global: `footer`

```typescript
{
  slug: 'footer',
  fields: [
    { name: 'navItems', type: 'array', /* same as header navItems */ },
    { name: 'companyName', type: 'text', localized: true },
    { name: 'identificationNumber', type: 'text' },
    { name: 'address', type: 'textarea', localized: true },
    { name: 'copyrightText', type: 'text', localized: true },
  ],
}
```

---

## Platform → Icon Mapping

| platform | Icon component |
|----------|----------------|
| whatsapp | `IconWhatsApp` |
| telegram | `IconTelegram` |
| vk | `IconVK` |
| viber | `IconViber` |
| messenger | `IconMessenger` |

Frontend MUST render icon by platform enum; custom upload icons — out of scope v1.
