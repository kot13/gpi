# Quickstart: 004-property-catalog

## Prerequisites

- Ветка `004-property-catalog`
- PostgreSQL, `.env` настроен
- Рекомендуется влитая или доступна фича `002-gpi-site-design` (design tokens)

## Setup

```bash
git checkout 004-property-catalog
npm install
# после реализации:
# npm install leaflet react-leaflet
# npm install -D @types/leaflet
npm run db:push
npm run generate:types
```

## Dev

```bash
npm run dev
# Admin: Collections → Properties → создать объект (objectCode 1037)
# Public catalog: http://localhost:3000/ru/properties
# Detail: http://localhost:3000/ru/properties/1037
```

## Seed (после реализации)

```bash
npm run seed
# демо-объект Batumi + опционально страница pages slug "properties"
```

## Tests

```bash
npm run test:unit -- tests/unit/lib/properties
npm run test:unit -- tests/unit/hooks/validatePropertyPublish.test.ts
npm run test:integration -- tests/integration/properties-collection.test.ts
npm run test:e2e -- tests/e2e/property-catalog.spec.ts
```

## Admin checklist

1. **Properties → Create**
2. Заполнить `objectCode`, `listingStatus: active`, город, цены, площадь, комнаты
3. `title` / `description` для **ru, ka, en**
4. Загрузить фото в медиатеку и добавить в галерею объекта (с alt)
5. Указать `lat` / `lng` для карты
6. **Publish** (draft → published)

## Verify checklist

- [ ] Каталог показывает только active + published
- [ ] Фильтр по городу сужает список
- [ ] Деталь: галерея, характеристики, обе цены
- [ ] Карта с меткой при валидных координатах
- [ ] `/ru`, `/ka`, `/en` — локализованные title/description
- [ ] Дубликат objectCode — ошибка в админке
- [ ] Lighthouse mobile на detail ≥ 90 (галерея из медиатеки)
- [ ] JSON-LD валидируется (Rich Results Test)

## Key files (после implement)

| Area | Path |
|------|------|
| CMS | `src/collections/Properties/index.ts` |
| Dictionaries | `src/lib/properties/dictionaries.ts` |
| Queries | `src/lib/payload/queries/properties.ts` |
| Catalog route | `src/app/(frontend)/[locale]/properties/page.tsx` |
| Detail route | `src/app/(frontend)/[locale]/properties/[objectCode]/page.tsx` |
| Map | `src/components/properties/PropertyMap.tsx` |
| JSON-LD | `src/lib/seo/propertyJsonLd.ts` |
| Seed | `src/endpoints/seed/properties.ts` |
| E2E | `tests/e2e/property-catalog.spec.ts` |

## Next command

```text
/speckit-tasks
```
