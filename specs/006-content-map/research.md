# Research: 006-content-map

**Date**: 2026-06-06

## 1. Библиотека карт

**Decision**: Leaflet 1.9 + react-leaflet 5 (уже в `package.json` проекта).

**Rationale**: Явное требование заказчика; в кодовой базе уже реализован `PropertyMapInner` с OSM-тайлами, scroll-wheel guard и фиксом иконок маркера. Переиспользование снижает риск и bundle.

**Alternatives considered**:
- **Yandex Maps** (на референс-макете) — API-ключ, лицензия, отдельный SDK; отклонено в пользу OSM + Leaflet.
- **Google Maps** — платный API, избыточен для одного маркера.
- **Mapbox** — токен и биллинг; отклонено для v1.

---

## 2. Провайдер тайлов

**Decision**: OpenStreetMap `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png` с атрибуцией OSM.

**Rationale**: Бесплатно, без API-ключа, уже используется в `PropertyMapInner`; достаточно для офисов GPI в Грузии (SC-002). Соответствует FR-005 (стандартные zoom/pan).

**Alternatives considered**:
- **Carto / Stadia** — потенциально «чище» визуально; отложено, можно сменить URL в одном месте.
- **Self-hosted tiles** — избыточная ops-нагрузка для v1.

---

## 3. Архитектура: блок layout vs отдельная коллекция

**Decision**: Payload Block `mapBlock` в поле `pages.layout` наравне с `content`, `mediaBlock`, `cta`, `archive`.

**Rationale**: FR-001 — карта в контенте любой страницы; существующий паттерн `RenderBlocks` + `blocks/*/config.ts` + `Component.tsx`. Отдельная коллекция «офисов» избыточна (spec P3 — несколько блоков на одной странице).

**Alternatives considered**:
- **Global «офисы»** — дублирование при вставке на разные страницы; отклонено.
- **Rich text embed** — нет интерактивного picker в админке; отклонено.

---

## 4. Поле выбора точки в админке

**Decision**: Группа `location` с полями `lat`, `lng`, `zoom` (`localized: false`) + UI-поле `mapPicker` — client-компонент `MapPointPicker` на react-leaflet: клик по карте и draggable marker; двусторонняя синхронизация с number fields (FR-003, FR-004).

**Rationale**: Payload 3 поддерживает custom `admin.components.Field` для `type: 'ui'`; числовые поля дают ручной ввод и валидацию hooks; карта — UX для менеджеров без знания координат.

**Alternatives considered**:
- **Только number fields** — нарушает FR-003 (интерактивная карта в админке).
- **@payloadcms/ui без Leaflet** — нет готового point picker в экосистеме проекта.
- **Geocoding по адресу** — вне scope v1 (Assumptions).

---

## 5. Локализация координат vs текстов

**Decision**: `lat`, `lng`, `zoom` — `localized: false` (одна точка на блок для всех языков); `title`, `address`, `phone`, `markerLabel` — `localized: true`. Поле `layout` страницы остаётся `localized: true`; структура блоков на каждой локали должна совпадать (существующий `validateLocalizedPublish`).

**Rationale**: Координаты офиса не зависят от языка; тексты — по принципу VIII. Менеджер не дублирует клик по карте трижды.

**Alternatives considered**:
- **Все поля localized** — риск расхождения координат между ru/ka/en; отклонено.

---

## 6. Публичный рендер и SSG

**Decision**: Server Component `MapBlock` (обёртка) + `dynamic(() => import('./ContentMapInner'), { ssr: false })` — паттерн из `PropertyMap.tsx`. SSR HTML содержит fallback: заголовок, адрес, телефон (FR-013); интерактивная карта — client island после гидратации.

**Rationale**: Конституция II — страницы SSG; Leaflet требует `window`. Fallback обеспечивает SC-004 и доступность без JS.

**Alternatives considered**:
- **SSR карты** — невозможно с Leaflet без hydration mismatch.
- **Static image snapshot** — нет интерактивности (FR-005); отклонено.

---

## 7. Переиспользование PropertyMap

**Decision**: Вынести общий `src/components/maps/MapInner.tsx` (тайлы, маркер, scroll-wheel) из `PropertyMapInner`; `PropertyMap` и `ContentMap` используют общий модуль. Иконки маркера — self-hosted из `/public/leaflet/` (убрать unpkg CDN из production).

**Rationale**: DRY; единый стиль карты на сайте (объекты + контакты); SC-005 — меньше дублирования кода и CSS.

**Alternatives considered**:
- **Два независимых MapInner** — дублирование; отклонено.
- **Оставить unpkg** — лишний DNS/TLS на критическом пути; отклонено.

---

## 8. Валидация координат

**Decision**: `src/lib/maps/validateCoordinates.ts` — `lat ∈ [-90, 90]`, `lng ∈ [-180, 180]`, оба required для публикации; hook `validateMapBlockCoordinates` в `beforeChange` страницы (в связке с `validateLocalizedPublish`). Опционально предупреждение, если точка вне Грузии (не блокирует — spec не ограничивает географию).

**Rationale**: FR-010, edge cases spec. Отдельно от `isGeorgiaCoordinates` (Properties) — карта на странице может указывать любую точку в мире.

**Alternatives considered**:
- **Только Georgia bounds** — слишком строго для «любой страницы»; отклонено для блока (оставить для Properties).

---

## 9. Компоновка и макет контактов

**Decision**: Select `layoutVariant`: `mapOnly` | `textAndMap`. При `textAndMap` — grid `md:grid-cols-2`: слева `h2` title, адрес, телефон, опционально `SocialLinks` (phone/whatsapp/telegram из полей блока); справа карта. Mobile: stack, текст сверху (FR-008, макет).

**Rationale**: Покрывает P3 без отдельного шаблона страницы. `SocialLinks` уже есть в проекте.

**Alternatives considered**:
- **Два отдельных блока (Content + Map)** — менеджер вручную синхронизирует колонки; хуже UX.
- **Hardcoded Contacts template** — не масштабируется на другие страницы; отклонено.

---

## 10. Производительность (PageSpeed)

**Decision**: `dynamic` import Leaflet; CSS `leaflet/dist/leaflet.css` только в client chunk; `scrollWheelZoom` off by default + enable on focus (как PropertyMap); min-height skeleton при loading; не более одного `MapContainer` на видимый viewport без ленивой инициализации — для страницы контактов (2 карты) допустимо при общем budget (SC-005: ≤5 пунктов).

**Rationale**: Принцип VI; SC-005 из spec.

**Alternatives considered**:
- **Intersection Observer lazy init** — усложнение; добавить в tasks если PageSpeed не пройдёт.
- **Single map multi-marker** — нарушает FR-014 (независимые блоки с разным текстом).

---

## 11. Seed страницы «Контакты»

**Decision**: `src/endpoints/seed/pages/contacts.ts` — страница с hero title, два `mapBlock` (Batumi, Tbilisi), координаты приближённые к адресам из макета, `layoutVariant: textAndMap`, телефон `+995-596-279-000`, quick contact links.

**Rationale**: P3 independent test; демо для менеджеров.

---

## 12. Тестирование

**Decision**: Unit — `validateCoordinates`; RTL — `MapBlock` fallback без coords; integration — schema Map block, publish validation; E2E — contacts page maps visible, marker, 3 locales.

**Rationale**: Конституция IV.
