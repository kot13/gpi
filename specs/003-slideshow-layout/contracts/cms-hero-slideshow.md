# Contract: CMS Hero — Slideshow

**Feature**: 003-slideshow-layout  
**Date**: 2026-05-31

## Payload field contract (`src/heros/config.ts`)

### Select `hero.type`

| Value | Label (admin) |
|-------|----------------|
| `none` | None |
| `highImpact` | High Impact |
| `mediumImpact` | Medium Impact |
| `lowImpact` | Low Impact |
| `slideshow` | **Slideshow** |

### Conditional visibility

| Field | Visible when |
|-------|----------------|
| `richText`, `links`, `media` | `type` ∈ `highImpact`, `mediumImpact`, `lowImpact` |
| `slides` | `type === 'slideshow'` |

### Array `slides`

```yaml
name: slides
type: array
minRows: 1
maxRows: 10
admin:
  initCollapsed: false
fields:
  - name: image
    type: upload
    relationTo: media
    required: true
  - name: title
    type: text
    required: true
    localized: true
  - name: subtitle
    type: text
    required: true
    localized: true
  - name: link
    # link({ appearances: false }) — single CTA target
  - name: buttonLabel
    type: text
    required: true
    localized: true
```

## TypeScript shape (after `generate:types`)

```typescript
hero: {
  type: 'none' | 'highImpact' | 'mediumImpact' | 'lowImpact' | 'slideshow'
  slides?: Array<{
    image: Media | number
    title: string
    subtitle: string
    link: LinkFields
    buttonLabel: string
    id?: string
  }> | null
  // ... existing fields when other types
}
```

## Publish validation

When `hero.type === 'slideshow'` for locale `L`:

- `slides` MUST exist and `length >= 1`
- Each slide MUST have: `image`, `title`, `subtitle`, `link` (valid reference or url), `buttonLabel` for locale `L`

Error message (admin): локализованное сообщение на русском в UI Payload.

## Admin UX

- Drag-and-drop reorder `slides`
- Preview: стандартный Payload preview страницы (live preview если включён)
