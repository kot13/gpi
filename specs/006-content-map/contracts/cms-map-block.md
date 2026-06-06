# Contract: CMS — блок MapBlock

**Feature**: 006-content-map  
**Date**: 2026-06-06

## Регистрация

| Место | Изменение |
|-------|-----------|
| `src/blocks/MapBlock/config.ts` | Block slug `mapBlock`, interfaceName `MapBlock` |
| `src/collections/Pages/index.ts` | `blocks: [..., MapBlock]` |
| `src/blocks/RenderBlocks.tsx` | `mapBlock: MapBlockComponent` |
| `src/app/(payload)/admin/importMap.js` | `MapPointPicker` field (после `generate:importmap`) |

## Block config (схема полей)

```typescript
// slug: 'mapBlock'
{
  layoutVariant: 'mapOnly' | 'textAndMap'  // default: 'textAndMap'
  location: {
    lat: number      // localized: false, required on publish
    lng: number      // localized: false
    zoom?: number    // 1-18, default 15
    mapPicker: ui    // admin only — MapPointPicker
  }
  title?: string           // localized: true
  address?: textarea       // localized: true
  phone?: string           // localized: true
  markerLabel?: string     // localized: true
  quickContacts?: Array<{
    platform: 'phone' | 'whatsapp' | 'telegram'
    url: string
  }>
}
```

## Admin: MapPointPicker

| Событие | Поведение |
|---------|-----------|
| Mount | Центр карты: `[lat, lng]` или default Batumi `41.64, 41.64`, zoom из поля или 15 |
| Click map | Обновить `lat`, `lng` в form state |
| Drag marker | Обновить `lat`, `lng` |
| Change lat/lng inputs | Переместить marker и center |
| Invalid input | Не обновлять карту; показать field error при blur |

Использует `useField` / `useFormFields` из `@payloadcms/ui` для группы `location`.

## Hooks

| Hook | Файл | Назначение |
|------|------|------------|
| `validateMapBlockOnPublish` | `src/blocks/MapBlock/hooks/validateMapBlockOnPublish.ts` | Проверка coords в layout при publish |
| (existing) `revalidatePage` | `src/collections/Pages/hooks/revalidatePage.ts` | ISR после изменения страницы с картой |

## Access

Без изменений: Pages `read: authenticatedOrPublished`, `update: authenticated`.

## TypeScript

После `generate:types`:

```typescript
export interface MapBlock {
  layoutVariant?: 'mapOnly' | 'textAndMap' | null
  location: {
    lat: number
    lng: number
    zoom?: number | null
  }
  title?: string | null
  address?: string | null
  phone?: string | null
  markerLabel?: string | null
  quickContacts?: { platform: 'phone' | 'whatsapp' | 'telegram'; url: string; id?: string }[] | null
  blockType: 'mapBlock'
  id?: string | null
  blockName?: string | null
}
```

`Page.layout` union расширяется: `(... | MapBlock)[]`.
