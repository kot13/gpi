# Research: 007-properties-map

**Date**: 2026-06-07

## 1. Маршрут и URL фильтров

**Decision**: `/{locale}/properties/map` с теми же query-параметрами, что каталог (`city`, `district`, `minUsd`, `maxUsd`, `rooms`, `layout`, `condition`, `repair`, `heating`, `readiness`, `features`, `sort`).

**Rationale**: FR-007/FR-008 — синхронизация фильтров; существующие `parsePropertyFilterParams`, `searchParamsToFilterRecord`, `buildPropertyFilterQuery` уже используются в `PropertyFilters` и `page.client.tsx` каталога. Вложенный path под `properties` семантически связывает разделы.

**Alternatives considered**:
- **`/map` top-level** — теряется контекст каталога; сложнее shared params.
- **Hash `#map`** на catalog page — не полноэкранный режим без footer (FR-002); отклонено.

---

## 2. Layout без подвала

**Decision**: Условное скрытие `<Footer />` в `Footer/Component.tsx` (или thin wrapper `SiteFooter`) через `usePathname()` — не рендерить на путях, оканчивающихся на `/properties/map`.

**Rationale**: В Next.js App Router nested layout не может «убрать» Footer из родительского `[locale]/layout.tsx` без разделения route groups и переноса всех существующих страниц. Client pathname check — минимальный diff, соответствует FR-002.

**Alternatives considered**:
- **Route group `(fullscreen)`** с отдельным layout — архитектурно чище, но требует перемещения всех маршрутов под `(site)/`; отложено как refactor.
- **CSS `footer { display: none }`** на map page — ломает a11y/SEO (footer в DOM); отклонено.

**Дополнение**: `<main>` на map page — `className="flex-1 min-h-0"` и контейнер карты `h-[calc(100dvh-var(--header-height))]` для полноэкранного контента под Header.

---

## 3. Кластеризация меток

**Decision**: Пакет **`leaflet.markercluster`** (официальный plugin Leaflet) + обёртка в `PropertiesMapInner` через `react-leaflet` `useMap` / ref на layer group; CSS `leaflet.markercluster/dist/MarkerCluster.css`.

**Rationale**: FR-010/FR-011; при 50+ объектах в районе individual markers overlap (SC-004). Plugin зрелый, совместим с Leaflet 1.9; кластер показывает count; `zoomToBoundsOnClick` для раскрытия.

**Alternatives considered**:
- **Supercluster (Mapbox)** — отдельный pipeline без Leaflet layers; больше glue code.
- **Без кластеризации** — нарушает spec при масштабе каталога GPI.
- **react-leaflet-cluster** (устаревшие форки) — несовместимость с react-leaflet 5; отклонено.

**Параметры по умолчанию**: `maxClusterRadius: 60`, `spiderfyOnMaxZoom: true`, `showCoverageOnHover: false`.

---

## 4. Автоподбор масштаба (fitBounds)

**Decision**: Pure function `fitBoundsForProperties(map, properties, padding)` — `L.latLngBounds` по всем `{lat,lng}` отфильтрованного набора; вызов на initial mount и при изменении filter params; для одного объекта — `setView([lat,lng], 14)` вместо max zoom out.

**Rationale**: FR-009, SC-002; `paddingTopLeft` на desktop учитывает ширину панели (~360px), чтобы метки не прятались под overlay.

**Alternatives considered**:
- **Fixed center Georgia** — не показывает все объекты после фильтра; отклонено.
- **fitBounds на каждый moveend** — мешает ручному pan пользователя; отклонено.

---

## 5. Список объектов в viewport

**Decision**: На `moveend` и `zoomend` (debounce 200 ms) вычислять `map.getBounds()` и фильтровать уже отфильтрованные по searchParams объекты функцией `filterPropertiesInBounds(list, bounds)` — pure, unit-tested.

**Rationale**: FR-004, SC-003; не требует API; согласовано с in-memory catalog pattern (004).

**Alternatives considered**:
- **Показывать все отфильтрованные, не только viewport** — против spec («которые сейчас видны на карте»).
- **Server fetch by bbox** — SSR/API на pan; нарушает принцип II и избыточно при <500 объектов.

**Кластеры vs список**: в список попадают individual properties в bounds; объекты только внутри кластера (не раскрытого) всё равно в bounds — включаются по координатам, не по видимости pixel marker.

---

## 6. Переиспользование PropertyFilters

**Decision**: Тот же компонент `PropertyFilters` с prop `presentation: 'sidebar' | 'sheet'` — на карте открывается **Sheet/Drawer** по кнопке «Фильтры»; на catalog — без изменений sidebar. Общая логика submit → `router.replace` с тем же path prefix (`/properties` vs `/properties/map`).

**Rationale**: FR-006, SC-005; один источник полей и валидации; `PropertyFilters` уже client component с URL sync.

**Alternatives considered**:
- **Дубликат формы фильтров** — drift с каталогом; отклонено.
- **Iframe catalog filters** — absurd; отклонено.

**Изменение**: prop `basePath?: string` default `/${locale}/properties` → map page передаёт `/${locale}/properties/map`.

---

## 7. Карта: расширение MapInner vs отдельный компонент

**Decision**: Новый **`PropertiesMapInner`** (multi-marker + cluster), не расширять single-marker `MapInner`.

**Rationale**: `MapInner` — один Marker, фиксированный center (006, detail page); catalog map — dynamic markers, cluster layer, fitBounds controller, highlight state. Разделение SRP; общие только `constants.ts` (tiles, icons).

**Alternatives considered**:
- **MapInner props `markers[]`** — раздувает API контактной карты; отклонено.

---

## 8. Кнопка «Посмотреть на карте»

**Decision**: В `PropertiesCatalogClient` (или toolbar над grid) — `<Link href={\`/${locale}/properties/map?${buildPropertyFilterQuery(params)}\`}>` с i18n `properties.viewOnMap`.

**Rationale**: FR-008; `params` уже в client state из searchParams.

---

## 9. SSG и данные

**Decision**: `page.tsx` server: `getActiveProperties(locale)` — полный список как каталог; client фильтрует по URL + viewport. `export const dynamic = 'force-static'`, `revalidate = 600`.

**Rationale**: Конституция II; паттерн 004; без новых CMS полей.

---

## 10. SEO страницы карты

**Decision**: `generateMetadata` — title/description из i18n `properties.map.metaTitle/metaDescription`; один `h1` sr-only или в panel header; `robots: index, follow` (утилитарная search page, FR-014). JSON-LD `WebPage` + optional `ItemList` from filtered set — optional в tasks.

**Rationale**: Принцип V без перегруза (не каждая метка в JSON-LD).

---

## 11. Производительность

**Decision**: `dynamic(() => import('./PropertiesMapInner'), { ssr: false })`; markercluster CSS только в map chunk; `scrollWheelZoom` guard как в MapInner; panel list virtualize only if >100 items (optional, YAGNI until needed).

**Rationale**: SC-001, PageSpeed ≥ 90; Leaflet не на catalog route.
