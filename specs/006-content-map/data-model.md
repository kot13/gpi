# Data Model: 006-content-map

**Date**: 2026-06-06

## Обзор

| Сущность | Тип | Slug / interface |
|----------|-----|------------------|
| Блок «Карта» | Payload Block (в `pages.layout`) | `mapBlock` / `MapBlock` |

Новых коллекций нет. Данные хранятся в JSONB layout локализованной страницы (`pages` → tab Content → `layout`).

---

## Block: `mapBlock`

Регистрация: `src/blocks/MapBlock/config.ts` → `Pages` blocks array + `RenderBlocks`.

### Поля

| Поле | Тип | Локализация | Обязательность | Описание |
|------|-----|-------------|----------------|----------|
| `layoutVariant` | select | нет | да | `mapOnly` \| `textAndMap` (default: `textAndMap`) |
| `location.lat` | number | **нет** | да* | Широта, -90…90 |
| `location.lng` | number | **нет** | да* | Долгота, -180…180 |
| `location.zoom` | number | **нет** | нет | 1…18, default `15` |
| `location.mapPicker` | ui | — | — | Только админка; не персистится |
| `title` | text | да | нет | Заголовок блока (`h2`), напр. «Батуми» |
| `address` | textarea | да | нет | Адрес офиса |
| `phone` | text | да | нет | Телефон для отображения |
| `markerLabel` | text | да | нет | `aria-label` маркера / подпись для a11y |
| `quickContacts` | array | нет | нет | Быстрые ссылки (иконки), см. ниже |
| `blockName` | text | нет | нет | Внутреннее имя в админке (Payload default) |

\* Обязательны при публикации страницы, если блок присутствует в layout данной локали.

### `quickContacts[]` (опционально, для макета контактов)

| Subfield | Тип | Обязательность | Описание |
|----------|-----|----------------|----------|
| `platform` | select | да | `phone` \| `whatsapp` \| `telegram` |
| `url` | text | да | `tel:+995...`, `https://wa.me/...`, `https://t.me/...` |

Рендер: компонент `SocialLinks` (существующий).

---

## Валидация

### `validateCoordinates(lat, lng)`

| Правило | Условие |
|---------|---------|
| Диапазон lat | `-90 ≤ lat ≤ 90` |
| Диапазон lng | `-180 ≤ lng ≤ 180` |
| Парность | оба заданы или оба пусты (в черновике) |
| Zoom | `1 ≤ zoom ≤ 18` если задан |

### Публикация страницы (`beforeChange`)

Для каждой локали в `layout`:

- Если есть `blockType === 'mapBlock'` → `location.lat` и `location.lng` required и valid.
- Ошибка: `Map block: укажите точку на карте (lat/lng)` на языке локали или общее сообщение Payload.

Черновик без координат: блок может существовать; публикация блокируется `validateLocalizedPublish` / custom hook.

---

## Состояния

```text
Страница draft + mapBlock без coords → сохраняется, карта не на сайте
Страница published + valid coords     → карта на публичном сайте
Страница published + invalid coords   → beforeChange error
```

Публичный fallback (без client JS / ошибка тайлов): рендер `title`, `address`, `phone` если заданы.

---

## Связи

```text
Page (collection)
└── layout[] (localized blocks)
    └── MapBlock
        ├── location { lat, lng, zoom }
        ├── title, address, phone, markerLabel (per locale)
        └── quickContacts[] (shared across locales)
```

---

## Пример: страница «Контакты» (seed)

Две записи `mapBlock` в `layout` (одинаковый порядок на ru/ka/en):

| # | title (ru) | address (ru) | lat (approx) | lng (approx) |
|---|------------|--------------|--------------|--------------|
| 1 | Батуми | ул. Селима Химшиашвили, 17 | 41.646 | 41.640 |
| 2 | Тбилиси | Проспект Ильи Чавчавадзе, 47 | 41.710 | 44.750 |

`layoutVariant: textAndMap`, `phone: +995-596-279-000`, quickContacts для phone/whatsapp/telegram.

---

## Миграция схемы

```bash
npm run db:push      # новые block tables в pages layout JSON
npm run generate:types
```

Отдельных таблиц для map block нет — Payload blocks schema в `pages` layout.
