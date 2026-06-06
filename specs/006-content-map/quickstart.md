# Quickstart: 006-content-map

## Prerequisites

- Ветка `006-content-map`
- PostgreSQL, `.env` настроен
- Фичи `001-cms-foundation`, `002-gpi-site-design` (layout, tokens, SocialLinks)
- `leaflet`, `react-leaflet` уже в зависимостях

## Setup

```bash
git checkout 006-content-map
npm install
# после реализации:
npm run db:push
npm run generate:types
npm run generate:importmap
```

## Dev

```bash
npm run dev
# Admin: Pages → Contacts (или любая страница) → Content → Add Block → Map
# Указать точку на интерактивной карте, заполнить title/address для ru, ka, en
# Public: http://localhost:3000/ru/contacts
```

## Seed (после реализации)

```bash
npm run seed
# создаёт страницу contacts с двумя mapBlock (Batumi, Tbilisi)
```

## Tests

```bash
npm run test:unit -- tests/unit/lib/maps
npm run test:unit -- tests/unit/components/maps
npm run test:integration -- tests/integration/map-block.test.ts
npm run test:e2e -- tests/e2e/contacts-map.spec.ts
```

## Admin checklist

1. **Pages →** открыть или создать страницу «Контакты»
2. Tab **Content** → **Add Block** → **Map**
3. На карте кликнуть точку офиса (или перетащить маркер)
4. `layoutVariant`: **Text and Map**
5. Заполнить **title**, **address**, **phone** для **ru, ka, en**
6. Опционально: **quickContacts** (phone, whatsapp, telegram URLs)
7. **Publish** страницу на всех локалях

## Verify checklist

- [ ] Карта с маркером на `/ru/contacts`, `/ka/contacts`, `/en/contacts`
- [ ] Компоновка «текст + карта»: 2 колонки на desktop, stack на mobile
- [ ] Два блока карты (Batumi + Tbilisi) независимы
- [ ] Ручной ввод lat/lng в админке двигает маркер
- [ ] Публикация без координат блокируется с ошибкой
- [ ] При отключённом JS виден адрес (fallback)
- [ ] PageSpeed страницы контактов ≥ 90 (mobile/desktop)
- [ ] `h1` страницы один; заголовки офисов — `h2`
