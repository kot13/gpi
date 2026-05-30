# Data Model: 001-cms-foundation

**Date**: 2026-05-30

## Обзор

```
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐
│   Header    │     │    Footer    │     │     Media       │
│  (global)   │     │   (global)   │     │  (collection)   │
└─────────────┘     └──────────────┘     └────────┬────────┘
                                                   │
┌─────────────┐                          ┌─────────▼─────────┐
│    Pages    │                          │    BlogPosts      │
│ (collection)│                          │   (collection)    │
└─────────────┘                          └─────────┬─────────┘
                                                   │ optional
                                          ┌────────▼─────────┐
                                          │ BlogCategories   │
                                          │  (collection)    │
                                          └──────────────────┘
```

**Локализация**: все текстовые поля с суффиксом `(localized)` — ru, ka, en.

---

## Collection: `pages`

Информационные страницы сайта.

| Field | Type | Localized | Required | Notes |
|-------|------|-----------|----------|-------|
| `title` | text | yes | yes | H1, SEO fallback |
| `slug` | text | yes | yes | unique per locale; URL segment |
| `content` | richText (Lexical) | yes | yes | Основное содержимое |
| `meta` | group (SEO plugin) | yes | no | title, description, image |
| `_status` | select | no | yes | `draft` \| `published` |
| `publishedAt` | date | no | no | auto on publish |

**Validation**:
- `slug`: lowercase, `[a-z0-9-]`, unique per locale
- Publish: все localized required fields заполнены для ru, ka, en

**State transitions**:
```
draft ──publish──► published
published ──unpublish──► draft
```

**Public URL**: `/{locale}/{slug}` (home: slug `home` → `/{locale}`)

---

## Collection: `blog-categories`

Рубрики блога.

| Field | Type | Localized | Required | Notes |
|-------|------|-----------|----------|-------|
| `title` | text | yes | yes | Название рубрики |
| `slug` | text | yes | yes | unique per locale |
| `description` | textarea | yes | no | Описание рубрики |

**Public URL**: `/{locale}/blog/category/{slug}`

**On delete**: связанные `blog-posts.category` → `null` (SET NULL)

---

## Collection: `blog-posts`

Записи блога.

| Field | Type | Localized | Required | Notes |
|-------|------|-----------|----------|-------|
| `title` | text | yes | yes | Название |
| `slug` | text | yes | yes | unique per locale |
| `description` | textarea | yes | yes | Анонс + meta description |
| `featuredImage` | upload → media | no | yes* | *required for publish |
| `content` | richText (Lexical) | yes | yes | Полный текст |
| `category` | relationship → blog-categories | no | no | Опциональная рубрика |
| `meta` | group (SEO plugin) | yes | no | Override SEO fields |
| `_status` | select | no | yes | `draft` \| `published` |
| `publishedAt` | date | no | no | auto on publish |

**Validation**:
- Publish blocked if `featuredImage` is empty (FR-012)
- Publish blocked if any locale missing required fields

**Public URL**: `/{locale}/blog/{slug}`

---

## Collection: `media`

Стандартная Payload Media collection.

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `alt` | text | yes | Accessibility + SEO |
| `file` | upload | yes | Images: jpg, png, webp |

---

## Collection: `users`

Payload auth users (редакторы GPI).

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `email` | email | yes | Login |
| `password` | password | yes | Hashed |
| `name` | text | no | Display name |

**Access**: authenticated for admin; public read disabled.

---

## Global: `header`

Единые настройки шапки.

| Field | Type | Localized | Required | Notes |
|-------|------|-----------|----------|-------|
| `navItems` | array | — | no | Пункты навигации |
| `navItems.label` | text | yes | yes | Название пункта |
| `navItems.linkType` | select | no | yes | `internal` \| `external` |
| `navItems.url` | text | no | conditional | Если external |
| `navItems.page` | relationship → pages | no | conditional | Если internal |
| `navItems.order` | number | no | yes | Сортировка |
| `socialLinks` | array | — | no | Соцсети |
| `socialLinks.platform` | select | no | yes | whatsapp, telegram, vk, viber, messenger |
| `socialLinks.url` | text | no | yes | URL профиля |
| `socialLinks.order` | number | no | yes | Сортировка |

---

## Global: `footer`

Единые настройки подвала.

| Field | Type | Localized | Required | Notes |
|-------|------|-----------|----------|-------|
| `navItems` | array | — | no | Аналогично header navItems |
| `companyName` | text | yes | no | Georgia Private Investment LLC |
| `identificationNumber` | text | no | no | 445623111 |
| `address` | textarea | yes | no | Юридический адрес |
| `copyrightText` | text | yes | no | © текст |

---

## Indexes & Constraints

| Collection | Constraint |
|------------|------------|
| pages | UNIQUE (slug, locale) |
| blog-categories | UNIQUE (slug, locale) |
| blog-posts | UNIQUE (slug, locale) |
| blog-posts.category | FK → blog-categories, ON DELETE SET NULL |

---

## Seed Data (dev)

- User: admin@gpirealty.ge (dev password in `.env`)
- Header nav: Каталог*, Услуги, Ипотека, О нас, Блог, Контакты (*placeholder URL)
- Footer nav: Почему мы, Каталог, Контакты, Политика конфиденциальности
- Social: WhatsApp, Telegram, VK, Viber, Messenger (placeholder URLs)
- Pages: `home`, `about`, `contacts` (ru/ka/en drafts)
- Blog category: «Ипотека» / «იპოთეკა» / «Mortgage»

*Каталог — placeholder external URL до фичи каталога (FR-023).
