# Data Model: 007-properties-map

**Date**: 2026-06-07  
**Feature**: Карта каталога недвижимости

Новых сущностей в PayloadCMS **нет**. Фича использует существующую коллекцию `properties` (004) и клиентские представления.

## Источник данных

| Сущность CMS | Использование на карте |
|--------------|------------------------|
| `properties` | Активные опубликованные объекты через `getActiveProperties(locale)` |

### Поля объекта, нужные карте

| Поле | Тип | Правило на карте |
|------|-----|------------------|
| `objectCode` | string | Ключ маркера, highlight, URL детальной |
| `status` | enum | Только `active` (отбор на сервере) |
| `lat`, `lng` | number | Обязательны для показа; валидация `validateCoordinates` |
| `title` | localized string | Подпись в панели и popup |
| `city`, `district` | string / enum | Подпись в панели |
| `priceUsd`, `priceGel` | number | Подпись в панели |
| `photos` | media[] | Первое фото — превью в панели |
| `_url` / slug | derived | Ссылка на `/{locale}/properties/{objectCode}` |

Объекты без валидных координат **исключаются** на клиенте после загрузки (`isValidCoordinate` из `lib/maps/validateCoordinates`).

## Клиентские модели (не персистентные)

### MapPropertyPoint

Проекция `PropertyListItem` для карты:

```typescript
type MapPropertyPoint = {
  objectCode: string
  lat: number
  lng: number
  title: string
  cityLabel: string
  district?: string
  priceUsd: number
  priceGel?: number
  thumbnailUrl?: string
  detailHref: string
}
```

Создаётся в `page.client.tsx` из server props; не хранится в БД.

### PropertyFilterParams (существующий)

Из `src/lib/properties/types.ts` — общий для каталога и карты. Сериализация в URL через `buildPropertyFilterQuery` / парсинг через `parsePropertyFilterParams`.

### MapViewportState (UI state)

| Поле | Тип | Описание |
|------|-----|----------|
| `bounds` | `LatLngBounds` | Текущая видимая область |
| `zoom` | number | Текущий zoom |
| `selectedObjectCode` | string \| null | Highlight marker + panel item |
| `filtersOpen` | boolean | Sheet фильтров на map page |
| `panelCollapsed` | boolean | Mobile: свёрнута ли панель |

### MarkerCluster (runtime)

Не сущность БД — слой Leaflet `MarkerClusterGroup`; агрегирует `MapPropertyPoint` по zoom/pixel distance.

## Фильтрация: два уровня

```text
getActiveProperties(locale)
        │
        ▼
filterProperties(all, searchParams)     ← URL filters (same as catalog)
        │
        ▼
filterPropertiesInBounds(filtered, bounds)   ← viewport (panel list + visible markers)
```

Сортировка: `sortProperties` применяется **до** viewport filter — порядок в панели = sort param (FR-006, spec assumption).

## Валидация

| Правило | Где |
|---------|-----|
| lat ∈ [-90, 90], lng ∈ [-180, 180] | `validateCoordinates` |
| lat/lng not null | client filter before render |
| active + published only | server query `getActiveProperties` |

## Связи с другими фичами

```text
004-property-catalog ──► properties collection, filters.ts, PropertyFilters
006-content-map        ──► lib/maps/constants, validateCoordinates, OSM tiles
007-properties-map     ──► map route, PropertiesMap*, bounds, markercluster
```

## Seed / тестовые данные

Для dev/E2E достаточно существующих seed objects (004) с координатами; для cluster tests — добавить в seed или test fixture **≥30 объектов** с близкими координатами в Tbilisi/Batumi (optional script `endpoints/seed/properties-map-density.ts`).
