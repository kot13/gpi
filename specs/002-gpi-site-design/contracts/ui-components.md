# Contract: UI Components

**Feature**: 002-gpi-site-design  
**Date**: 2026-05-30

## Global Layout Shell

Every public page (`/{locale}/**`) MUST render:

```html
<header class="gpi-header">...</header>
<main>...</main>
<footer class="gpi-footer">...</footer>
```

Source: `[locale]/layout.tsx` — без изменения data fetching (globals Header/Footer).

---

## SiteHeader

### Desktop (viewport ≥ 980px)

| Zone | Content | Behavior |
|------|---------|----------|
| Left | Logo → `/{locale}` | `next/image` or SVG, max-height ~40px |
| Center | Nav links from CMS | 16px Circe, `#414141`, active `#7E2226` bold |
| Right | Social icons + LanguageSwitcher | Icons 40×40; locales RU/KA/EN |

**Styles**: `position: sticky; top: 0; z-index: 50; background: white; height: 70px; border-bottom: 1px solid var(--color-gpi-border)`.

### Mobile / Tablet (viewport < 980px)

| Zone | Content |
|------|---------|
| Left | Logo |
| Right | Burger button (44×44px min) |

**Burger closed**: horizontal nav hidden.  
**Burger open**: full-viewport overlay (`MobileNav`) with:
- All nav items (vertical stack, 44px min height each)
- LanguageSwitcher
- SocialLinks
- Close on: Escape, backdrop click, nav link click

**Accessibility**:
- Burger: `aria-label="Меню"`, `aria-expanded`, `aria-controls="mobile-nav"`
- Overlay: `role="dialog"`, `aria-modal="true"`
- Focus trap while open
- Restore focus to burger on close

---

## SiteFooter

| Section | Fields | Style |
|---------|--------|-------|
| Legal | companyName, ID, address, copyright | 14px muted, stacked |
| Nav | footer.navItems | Links, hover brand color |

MUST appear identical on: `/`, `/blog`, `/blog/{slug}`, CMS pages, 404.

---

## BlogListPage

**Route**: `/{locale}/blog`

| Block | Requirement |
|-------|-------------|
| Hero | Localized title + intro (UI strings ru/ka/en) |
| Grid | 1/2/3 columns responsive |
| Card | See BlogCard |
| Empty | Branded empty state if 0 posts |
| Pagination | Existing Pagination component, styled |

---

## BlogCard

| Element | Requirement |
|---------|-------------|
| Image | aspect-video, radius top, object-cover, alt from media |
| Category | Optional uppercase badge, brand color |
| Title | h3, semibold, link to post |
| Description | 3-line clamp, muted |
| Container | border, radius 16px, hover border brand |

**Interaction**: entire card clickable (existing `useClickableCard`).

---

## BlogPostPage

**Route**: `/{locale}/blog/{slug}`

| Block | Order | SEO |
|-------|-------|-----|
| Category link | 1 | — |
| h1 title | 2 | single h1 |
| Date + category meta | 3 | `<time datetime>` |
| Hero image | 4 | alt required |
| Description | 5 | lead text |
| Prose content | 6 | h2+ inside `.gpi-prose` |
| BlogPostCTA | 7 | external links, `rel="noopener"` |

### BlogPostCTA

Styled strip at bottom (non-functional form):
- WhatsApp, Telegram links (from `header.socialLinks` matching platform)
- «Оставить заявку» — link to contacts page or `#` placeholder (styled only)

Labels localized via next-intl (ru/ka/en).

---

## LanguageSwitcher

| Rule | Value |
|------|-------|
| Locales shown | ru, ka, en |
| Active locale | brand color, font-weight 600 |
| Inactive | muted, hover brand |
| Min touch | 44×44px |
| Visible in | desktop header + mobile menu |

---

## Responsive Verification Matrix

| Page | 320px | 768px | 1920px |
|------|-------|-------|--------|
| `/ru` | burger, no h-scroll | burger | desktop nav |
| `/ru/blog` | 1-col cards | 2-col | 3-col |
| `/ru/blog/{slug}` | readable prose | — | max-width content |

E2E: `responsive.spec.ts`, `header-footer.spec.ts`.

---

## Non-Goals (this contract)

- Homepage slider / catalog blocks
- Lead form submission
- Admin UI styling
- New CMS fields
