# Contract: Map UI — публичный сайт и админка

**Feature**: 006-content-map  
**Date**: 2026-06-06

## Component tree (публичный сайт)

```text
RenderBlocks
└── MapBlockComponent (server)
    ├── MapBlockTextColumn          # if layoutVariant === 'textAndMap'
    │   ├── h2.title
    │   ├── p.phone (tel: link if starts with +)
    │   ├── p.address
    │   └── SocialLinks (quickContacts)
    └── ContentMap (client wrapper)
        └── ContentMapInner (dynamic, ssr: false)
            ├── MapContainer
            ├── TileLayer (OSM)
            ├── Marker
            └── ScrollWheelControl
```

Fallback (нет coords / tile error / no JS): только `MapBlockTextColumn` + сообщение `maps.unavailable` из i18n.

## Component tree (админка)

```text
MapBlock fields
└── location (group)
    ├── lat (number)
    ├── lng (number)
    ├── zoom (number)
    └── mapPicker (ui) → MapPointPicker (client)
        ├── MapContainer
        ├── TileLayer
        ├── DraggableMarker
        └── sync ↔ lat/lng fields
```

## Визуальные токены (макет контактов + GPI)

| Элемент | Стиль |
|---------|--------|
| Секция блока | `container my-16` (как другие blocks) |
| Grid textAndMap | `grid md:grid-cols-2 gap-8 lg:gap-16 items-start` |
| Заголовок города | `h2`, `text-2xl lg:text-3xl font-bold` |
| Адрес / телефон | `text-gpi-text`, `text-base` |
| Карта | `h-60 md:h-80 lg:h-96 rounded-lg overflow-hidden border border-gpi-border` |
| Маркер | Стандартный Leaflet blue pin (self-hosted assets) |

## MapInner (shared)

Путь: `src/components/maps/MapInner.tsx`

| Prop | Тип | Default |
|------|-----|---------|
| `lat` | number | — |
| `lng` | number | — |
| `zoom` | number | `15` |
| `markerLabel` | string? | — |
| `interactive` | boolean | `true` (false в admin preview read-only mode — не требуется v1) |
| `scrollWheelZoom` | boolean | `false` + enable on focus |

TileLayer URL: `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`

## Поведение

| Сценарий | Поведение |
|----------|-----------|
| `layoutVariant: mapOnly` | Карта на всю ширину container |
| `layoutVariant: textAndMap` | 2 col desktop; mobile stack (text first) |
| Несколько mapBlock на странице | Независимые `MapContainer` с уникальным `key={block.id}` |
| `phone` задан | Отображать как текст; `tel:` link если похож на номер |
| `quickContacts` пуст | Секция иконок скрыта |
| Координаты invalid | Не рендерить MapContainer; показать fallback |

## SEO / a11y

- Заголовок блока — `<h2>` только если `title` задан (не дублировать `h1` страницы).
- `aria-label` на контейнере карты: `markerLabel` || `title` || `address` || i18n `maps.defaultLabel`.
- Текстовый fallback виден в DOM до гидратации (SSR-friendly).
- Адрес в plain text — индексируемый контент для GEO.

## Responsive

| Breakpoint | Поведение |
|------------|-----------|
| mobile 320–767 | Одна колонка; карта full width; touch targets иконок ≥ 44px |
| tablet 768–979 | `textAndMap` → 2 колонки |
| desktop 980+ | 2 колонки; карта min-height 384px (`lg:h-96`) |
| wide 1920+ | container max-w как у сайта |

## i18n keys (новые)

`src/lib/i18n/messages/{ru,ka,en}.json`:

| Key | ru (пример) |
|-----|-------------|
| `maps.defaultLabel` | Карта |
| `maps.unavailable` | Карта временно недоступна. Адрес указан выше. |

Переиспользовать `properties.mapUnavailable` или унифицировать в `maps.unavailable` (tasks).
