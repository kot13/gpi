# Contract: Public Routes

**Feature**: 001-cms-foundation  
**Date**: 2026-05-30

## Locales

| Code | Language |
|------|----------|
| `ru` | Русский (default) |
| `ka` | Грузинский |
| `en` | Английский |

Все публичные маршруты MUST начинаться с `/{locale}/`.

---

## Routes

| Method | Path | Description | SSG |
|--------|------|-------------|-----|
| GET | `/{locale}` | Главная (page slug: `home`) | yes |
| GET | `/{locale}/{slug}` | CMS-страница (кроме зарезервированных) | yes |
| GET | `/{locale}/blog` | Список записей блога (paginated) | yes |
| GET | `/{locale}/blog/{slug}` | Запись блога | yes |
| GET | `/{locale}/blog/category/{slug}` | Записи рубрики | yes |
| — | `/admin/**` | Payload Admin | no (dynamic) |
| — | `/api/**` | Payload REST/GraphQL | no |

### Зарезервированные slug (pages)

Следующие slug НЕ могут использоваться в коллекции `pages`:
`blog`, `admin`, `api`, `_next`

---

## Response Contract (HTML pages)

### Успешный ответ (200)

- DOCTYPE html, `lang={locale}`
- `<header>` — из global `header`
- `<main>` — контент страницы/блога
- `<footer>` — из global `footer`
- `<head>` — metadata (title, description, canonical, og:*, hreflang, json-ld)

### Страница не найдена (404)

- Кастомная 404 с Header/Footer
- `noindex` meta

### Неопубликованный контент

- Публичный доступ ONLY к `_status: published`
- Draft/preview — ONLY через Payload preview mode (authenticated)

---

## Language Switcher Contract

При переключении языка на странице `{entity}`:

1. Если существует локализованный slug для target locale → redirect на эквивалентный URL
2. Если slug отсутствует → redirect на `/{target-locale}` (home) с optional toast

---

## Pagination (blog list)

| Param | Default | Max |
|-------|---------|-----|
| `page` | 1 | — |
| `limit` | 12 | 24 |

URL: `/{locale}/blog?page=2`

---

## Revalidation Triggers

| Event | Paths revalidated |
|-------|-------------------|
| Page publish/update/delete | `/{locale}/{slug}`, `/{locale}` if home |
| Blog post publish/update/delete | `/{locale}/blog/{slug}`, `/{locale}/blog` |
| Category publish/update/delete | `/{locale}/blog/category/{slug}`, `/{locale}/blog` |
| Header/Footer update | `/{locale}` (all locales, layout-level) |
