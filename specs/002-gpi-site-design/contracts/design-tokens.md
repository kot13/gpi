# Contract: Design Tokens

**Feature**: 002-gpi-site-design  
**Date**: 2026-05-30

## Scope

CSS custom properties и Tailwind `@theme` extensions в `src/app/(frontend)/globals.css`.
Все публичные страницы MUST использовать эти tokens (не hardcoded hex в компонентах).

---

## Color Tokens

| Token | Value | Tailwind utility |
|-------|-------|------------------|
| `--color-gpi-brand` | `#7E2226` | `text-gpi-brand`, `bg-gpi-brand`, `border-gpi-brand` |
| `--color-gpi-text` | `#414141` | `text-gpi-text` |
| `--color-gpi-bg` | `#FFFFFF` | `bg-gpi-bg` |
| `--color-gpi-bg-secondary` | `#F5F5F5` | `bg-gpi-bg-secondary` |
| `--color-gpi-muted` | `#999999` | `text-gpi-muted` |
| `--color-gpi-border` | `#E5E5E5` | `border-gpi-border` |

**Migration note**: `--color-gpi-accent` (gold `#d4a853`) DEPRECATED → заменить на `--color-gpi-brand`.

---

## Typography Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--font-gpi-body` | Circe, Arial, sans-serif | body, nav, prose |
| `--font-gpi-heading` | Unbounded, sans-serif | page heroes, blog h1 |
| `--text-base` | 16px | nav links, body |
| `--text-lg` | 18px | lead paragraphs |
| `--text-h1` | clamp(28px, 5vw, 48px) | blog post title |
| `--text-h2` | 24px | section headings |
| `--leading-body` | 1.5 | prose |

---

## Spacing & Layout

| Token | Value | Usage |
|-------|-------|-------|
| `--header-height` | 70px | sticky header min-height |
| `--radius-card` | 16px | blog cards, images |
| `--container-max` | 1160px | align with Tilda artboard |

---

## Breakpoint Contract

| Name | CSS | Nav behavior |
|------|-----|--------------|
| mobile | `< 768px` | Burger menu |
| tablet | `768px – 979px` | Burger menu |
| desktop | `≥ 980px` | Horizontal nav |

Tailwind: burger when `< lg` (64rem = 1024px) — **implement using `max-lg:` or custom `max-[980px]:`** to match reference exactly.

---

## Prose Variant

Class `.gpi-prose` MUST be applied to:
- Blog post Lexical content
- CMS page rich text (`PageContent`, `RichText`)

Requirements:
- One `h1` per page (outside prose or as page title only)
- Links: `color: var(--color-gpi-brand)`
- Lists: visible bullets/numbers with spacing matching reference

---

## Verification

Unit test `tests/unit/styles/tokens.test.ts` MUST assert presence of all tokens above in `globals.css`.
