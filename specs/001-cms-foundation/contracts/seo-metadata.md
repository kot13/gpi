# Contract: SEO Metadata

**Feature**: 001-cms-foundation  
**Date**: 2026-05-30

## Per-Page Metadata (Next.js `generateMetadata`)

Каждая публичная страница MUST генерировать:

| Meta | Source | Required |
|------|--------|----------|
| `<title>` | `meta.title` \|\| `{page.title} \| GPI` | yes |
| `<meta name="description">` | `meta.description` \|\| `page.description` | yes |
| `<link rel="canonical">` | absolute URL текущей локали | yes |
| `<meta property="og:title">` | same as title | yes |
| `<meta property="og:description">` | same as description | yes |
| `<meta property="og:image">` | featuredImage or default GPI og image | yes |
| `<meta property="og:url">` | canonical URL | yes |
| `<meta property="og:type">` | `website` (pages) / `article` (blog) | yes |
| `<meta property="og:locale">` | `ru_RU` / `ka_GE` / `en_US` | yes |
| hreflang `<link rel="alternate">` | all locale variants + `x-default` | yes |

### og:locale mapping

| locale | og:locale |
|--------|-----------|
| ru | ru_RU |
| ka | ka_GE |
| en | en_US |

---

## JSON-LD

### All pages (layout)

```json
{
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  "name": "Georgia Private Investment",
  "url": "https://gpi-realty.ge",
  "logo": "{absoluteLogoUrl}",
  "address": { "@type": "PostalAddress", "addressLocality": "Batumi", "addressCountry": "GE" }
}
```

### CMS Page

```json
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "{title}",
  "description": "{description}",
  "url": "{canonical}",
  "inLanguage": "{locale}",
  "isPartOf": { "@type": "WebSite", "name": "GPI", "url": "https://gpi-realty.ge" }
}
```

### Blog Post

```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "{title}",
  "description": "{description}",
  "image": "{featuredImageUrl}",
  "datePublished": "{publishedAt}",
  "inLanguage": "{locale}",
  "author": { "@type": "Organization", "name": "GPI" }
}
```

### BreadcrumbList

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "{homeUrl}" },
    { "@type": "ListItem", "position": 2, "name": "{currentTitle}", "item": "{canonical}" }
  ]
}
```

---

## Heading Hierarchy Rules

| Page type | h1 | h2+ |
|-----------|----|----|
| CMS page | `page.title` (rendered once) | from richText content |
| Blog list | «Блог» (localized) | — |
| Blog post | `post.title` | from richText content |
| Category | `category.title` | — |

RichText renderer MUST NOT output duplicate h1 from content if page title is h1.

---

## Default OG Image

Fallback: `/images/og-default.jpg` (1200×630, GPI branding)

---

## robots

| Page | robots |
|------|--------|
| Published public | `index, follow` |
| 404 | `noindex` |
| Admin | `noindex, nofollow` |
