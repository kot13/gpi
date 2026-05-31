# Data Model: 002-gpi-site-design

**Date**: 2026-05-30

> Фича меняет только **presentation layer**. Схема Payload CMS из
> `001-cms-foundation` **не изменяется**. Ниже — сущности отображения и их
> связь с существующими данными CMS.

## Presentation Entities

### DesignTokens

Абстрактный набор CSS-переменных и Tailwind theme extensions.

| Field | Type | Source | Notes |
|-------|------|--------|-------|
| `brand` | color `#7E2226` | `globals.css` @theme | Акcent, active states |
| `textPrimary` | color `#414141` | CSS var | Body, nav |
| `bgPrimary` | color `#FFFFFF` | CSS var | Page, header |
| `bgSecondary` | color `#F5F5F5` | CSS var | Cards, footer |
| `fontBody` | `'Circe', sans-serif` | next/font | 16px base |
| `fontHeading` | `'Unbounded', sans-serif` | next/font | Hero, h1 blog |
| `radiusCard` | `16px` | Tailwind | Blog cards |
| `headerHeight` | `70px` | Tailwind | Sticky header |

**Validation**: unit-тест `tokens.test.ts` проверяет наличие всех variables в `globals.css`.

---

### SiteHeader (view model)

Композиция global `header` + UI chrome.

| Field | CMS Source | Presentation |
|-------|------------|--------------|
| `logo` | static `/Logo` component | Image, link to `/{locale}` |
| `navItems[]` | `header.navItems` | Desktop horizontal / mobile overlay |
| `socialLinks[]` | `header.socialLinks` | Icons 40×40, header + mobile menu |
| `locales` | static `LOCALES` | LanguageSwitcher ru/ka/en |

**Relationships**: один global `header` → все публичные страницы через `[locale]/layout.tsx`.

**State (client only)**:
- `mobileMenuOpen: boolean` — MobileNav
- `scrollOpacity: number` — optional header bg opacity on scroll (референс 0.9)

---

### SiteFooter (view model)

| Field | CMS Source | Presentation |
|-------|------------|--------------|
| `navItems[]` | `footer.navItems` | Link list |
| `companyName` | `footer.companyName` | Bold text |
| `identificationNumber` | `footer.identificationNumber` | Muted small |
| `address` | `footer.address` | Muted small |
| `copyrightText` | `footer.copyrightText` | Muted small |

---

### BlogCard (view model)

| Field | CMS Source | Presentation |
|-------|------------|--------------|
| `slug` | `posts.slug` | Card link `/{locale}/blog/{slug}` |
| `title` | `posts.title` | h3 in card |
| `description` | `posts.description` | line-clamp-3 |
| `heroImage` | `posts.heroImage` | aspect-video, object-cover |
| `category` | `posts.category` | Optional badge uppercase |

**Validation**: hero image optional at display time (placeholder block if missing).

---

### BlogPostPage (view model)

| Field | CMS Source | Presentation |
|-------|------------|--------------|
| `title` | `posts.title` | Single `h1` |
| `description` | `posts.description` | Lead paragraph |
| `heroImage` | `posts.heroImage` | Hero section |
| `content` | `posts.content` (Lexical) | `.gpi-prose` |
| `category` | `posts.category` | Meta link |
| `publishedAt` | `posts.publishedAt` | Formatted date (locale-aware) |
| `ctaLinks` | derived from `header.socialLinks` | BlogPostCTA strip |

---

### MobileNav (UI state)

| Field | Type | Rules |
|-------|------|-------|
| `isOpen` | boolean | Toggle on burger click |
| `focusTrap` | boolean | Active when open |
| `closeTriggers` | enum[] | escape, backdrop, nav link click |

**Validation**: all `navItems` reachable when open; min touch target 44×44px.

---

## Unchanged CMS Entities (reference)

См. `specs/001-cms-foundation/data-model.md`:
- `header` global
- `footer` global
- `posts` collection
- `blog-categories` collection

## State Transitions

```
MobileNav: closed --[burger click]--> open
MobileNav: open --[escape|backdrop|link]--> closed
```

Нет серверных state transitions — только client UI state.
