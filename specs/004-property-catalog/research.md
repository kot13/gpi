# Research: 004-property-catalog

**Date**: 2026-06-01

## 1. Коллекция vs глобал vs JSON-импорт

**Decision**: Отдельная Payload-коллекция `properties` с `versions.drafts` и полем `listingStatus`.

**Rationale**: Spec требует CRUD всех полей в админке (FR-001, FR-017); отдельная сущность масштабируется, поддерживает hooks revalidate, SEO plugin и уникальный `objectCode`. Глобал подходит для singleton-настроек, не для сотен объектов.

**Alternatives considered**:
- Block в `pages` — отклонено: нет независимых URL и фильтрации по множеству записей.
- Внешний JSON без CMS — отклонено: нарушает FR-001 и workflow менеджера.

---

## 2. Публикация: `_status` + `listingStatus`

**Decision**: Payload drafts (`_status`: draft | published) + бизнес-поле `listingStatus`: `draft` | `active` | `inactive`. Публично: `_status === published` **и** `listingStatus === active`.

**Rationale**: Разделяет «готовность контента к переводам» и «показывать в каталоге» (снятие с витрины без удаления). Соответствует FR-003 и сценарию снятия с показа.

**Alternatives considered**:
- Только `_status` — не различает «опубликован, но скрыт с витрины».
- Только `listingStatus` без drafts — хуже для мультиязычного workflow GPI.

---

## 3. Уникальность `objectCode`

**Decision**: Поле `objectCode` типа `text`, `unique: true`, индекс в БД; дополнительная проверка в `beforeChange` hook с понятным сообщением на русском.

**Rationale**: FR-002; URL стабилен и не зависит от локали.

**Alternatives considered**:
- Slug per locale — отклонено: код объекта общий для CRM/коммуникаций.

---

## 4. Фотографии: URL vs Media collection

**Decision**: Array `photos[]` с полем `image` — `upload`, `relationTo: media`, `required: true`; порядок элементов массива = порядок галереи. Alt — в записи Media (как в блоге).

**Rationale**: Уточнение `/speckit-clarify` (2026-06-01): фото загружаются в админке GPI, не с Google Drive. Соответствует FR-007, конституции VI (оптимизация через `next/image` + локальные `/api/media/file/`), единообразию с `posts.featuredImage`.

**Alternatives considered**:
- Внешние URL (Google Drive) — отклонено по решению заказчика.
- Hybrid URL + upload — отклонено: усложняет валидацию и SEO без выгоды.

**Follow-up**: переиспользовать `ImageMedia` / `getMediaUrl`; `priority` на первое фото детальной страницы; lazy на остальные.

---

## 5. Справочники (enums)

**Decision**: Значения как `select` / `hasMany` в схеме Payload с фиксированным `options` списком; человекочитаемые подписи — `src/lib/properties/dictionaries.ts` + ключи в `src/lib/i18n/messages/{ru,ka,en}.json`.

**Rationale**: FR-004, FR-005; v1 без отдельной коллекции справочников (spec Key Entities). Админ видит русские labels в option labels; сайт — через i18n.

**Alternatives considered**:
- Коллекция `property-taxonomies` — избыточно для фиксированных списков v1.
- Хардкод только в TS без messages — нарушает принцип VIII для ka/en.

---

## 6. Маршруты и SSG

**Decision**:
- Каталог: `src/app/(frontend)/[locale]/properties/page.tsx`
- Деталь: `src/app/(frontend)/[locale]/properties/[objectCode]/page.tsx`
- `export const dynamic = 'force-static'`, `revalidate = 600`
- `generateStaticParams` для `[objectCode]` × все активные коды (на каждой локали тот же param)

**Rationale**: FR-016, конституция II; согласовано с `blog` и `[slug]` pages.

**Alternatives considered**:
- SSR с `searchParams` для фильтров — отклонено (принцип II).
- Отдельный API route для списка — лишний round-trip при уже статических данных.

---

## 7. Фильтрация и сортировка каталога

**Decision**: Server Component загружает **все** активные properties (`getActiveProperties(locale)`); Client Component `PropertyCatalog` фильтрует/сортирует в памяти; состояние фильтров синхронизируется с URL (`useSearchParams` + `router.replace`) для шаринга ссылок.

**Rationale**: FR-010, FR-011, SC-003 при ≤ нескольких сотнях объектов; нулевой latency фильтра после гидратации; SSG сохраняется.

**Alternatives considered**:
- Серверная фильтрация по query — требует dynamic rendering.
- Предгенерация всех комбинаций фильтров — комбинаторный взрыв.

**Pagination**: при `length > 24` — клиентская пагинация или статические `/properties/page/[n]` (предпочтение v1: client slice + «Показать ещё» для простоты; статические page routes — в tasks при росте каталога).

---

## 8. Leaflet на детальной странице

**Decision**: `leaflet` + `react-leaflet@4` (совместимость React 19 — проверить peer deps при install); компонент `PropertyMap.tsx` с `'use client'`, `dynamic(() => import(...), { ssr: false })`, CSS `leaflet/dist/leaflet.css` в client bundle; тайлы OpenStreetMap (стандартная лицензия attribution в UI).

**Rationale**: Явное требование пользователя; FR-013. Карта только на detail — минимальный JS на каталоге.

**Alternatives considered**:
- Static map image API — хуже UX (нет zoom).
- Google Maps — лицензия/ключ; OSM достаточно для GPI.

**A11y**: `aria-label` на контейнере; `scrollWheelZoom: false` по умолчанию или после focus; координаты дублируются текстом адреса.

**Validation**: `lat` 41.0–43.5, `lng` 39.5–46.5 (мягкая Грузия); иначе карта скрыта, адрес остаётся (edge case spec).

---

## 9. SEO / JSON-LD

**Decision**: `@payloadcms/plugin-seo` group `meta` на `properties` (localized override); fallback meta из `title`/`description` + первое фото. JSON-LD: `@type: Product` с `Offer` (price USD/GEL), `geo` при наличии координат; каталог — `CollectionPage` + `ItemList` (или `WebPage` + breadcrumbs). `hreflang` через существующий `generateMeta`.

**Rationale**: Конституция V; FR-014.

**Alternatives considered**:
- Только `RealEstateListing` schema.org — менее универсален в валидаторах; `Product`/`Offer` уже упомянуты в конституции.

---

## 10. Revalidation

**Decision**: Hooks `afterChange` / `afterDelete` на `properties` — `revalidatePath` для `/[locale]/properties` и `/[locale]/properties/[objectCode]` для ru, ka, en (паттерн `revalidatePost`).

**Rationale**: ISR 600s + мгновенное обновление после публикации в админке.

---

## 11. Валидация публикации

**Decision**: Hook `validatePropertyPublish` (beforeChange): при `_status === published` и `listingStatus === active` проверять objectCode, city, prices > 0, area, rooms, title/description для текущей локали; `validateAllLocalesBeforePublish` для title/description всех трёх локалей (расширение паттерна `validateLocalizedPublish`).

**Rationale**: FR-008; принцип VIII.

---

## 12. Зависимости npm

**Decision**: Добавить `leaflet`, `react-leaflet`, `@types/leaflet` (dev).

**Rationale**: Прямое требование; tree-shaking + dynamic import ограничивают bundle.

---

## Resolved NEEDS CLARIFICATION

Все технические неизвестности из Technical Context закрыты; открытых блокеров для Phase 1 нет.
