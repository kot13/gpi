# Research: 001-cms-foundation

**Date**: 2026-05-30

## 1. Стартовый шаблон проекта

**Decision**: Использовать официальный шаблон [Payload CMS Website Template](https://github.com/payloadcms/payload/tree/main/templates/website) (Payload 3 + Next.js + PostgreSQL) как базу, адаптировав коллекции под GPI.

**Rationale**: Шаблон уже содержит интеграцию Next.js App Router, PostgreSQL adapter, Lexical rich text, SEO plugin, примеры SSG и on-demand revalidation — соответствует конституции (принципы II, III, VII).

**Alternatives considered**:
- Blank template — больше ручной настройки без выигрыша
- Отдельный headless Payload + standalone Next.js — лишняя сложность деплоя

---

## 2. Локализация контента (ru / ka / en)

**Decision**: Встроенная локализация Payload CMS (`localization.locales: ['ru', 'ka', 'en']`) для коллекций Pages, BlogPosts, BlogCategories и полей globals Header/Footer.

**Rationale**: Нативная поддержка localized fields, fallback, admin UI для переводов; соответствует принципу VIII.

**Alternatives considered**:
- Отдельные записи на язык — дублирование связей, сложнее синхронизация slug
- Только next-intl для контента — не подходит для CMS-контента редакторов

**URL-структура**:
- `/ru/...`, `/ka/...`, `/en/...` — prefix через Next.js dynamic segment `[locale]`
- Default locale: `ru` (основной рынок GPI)

---

## 3. UI-строки (навигация системная, переключатель языка)

**Decision**: `next-intl` для статических UI-строк (кнопки, labels переключателя); контент меню — из Payload globals (localized labels).

**Rationale**: Разделение CMS-контента (редактируемого) и системных строк (версионируемых в коде).

---

## 4. Глобальные настройки шапки и подвала

**Decision**: Payload **Globals** — `header` и `footer` (singleton), с array fields для nav items и social links.

**Rationale**: Официальный паттерн Payload для site-wide settings; изменения автоматически доступны через `getGlobal()` на всех страницах.

**Nav item structure**: `{ label (localized), linkType: 'internal'|'external', url, page (relationship), order }`

**Social link structure**: `{ platform: enum, url, order }` — иконка определяется по platform в frontend.

---

## 5. Rich text для страниц и блога

**Decision**: Lexical editor (`@payloadcms/richtext-lexical`) с базовым набором: headings, lists, links, inline images.

**Rationale**: Default в Payload 3; достаточно для v1 (spec Assumptions).

**Alternatives considered**: Blocks field — out of scope для v1, можно добавить позже для главной со слайдером.

---

## 6. Статическая генерация и revalidation

**Decision**: SSG через `generateStaticParams` для всех опубликованных pages/posts/categories × locales; ISR через `export const revalidate = false` + on-demand `revalidatePath` в Payload `afterChange`/`afterDelete` hooks.

**Rationale**: Соответствует принципу II; контент обновляется после публикации без full rebuild.

**Alternatives considered**:
- Pure SSG без revalidation — редактор ждёт full deploy
- SSR — запрещено конституцией для публичных страниц

---

## 7. SEO и метаданные

**Decision**: `@payloadcms/plugin-seo` для title/description/OG в admin + Next.js `generateMetadata` + custom JSON-LD helpers в `src/lib/seo/`.

**Rationale**: Plugin интегрирован с Payload; Next.js Metadata API — best practice для App Router.

**JSON-LD types для фичи**:
- `WebSite` + `Organization` (layout)
- `WebPage` (CMS pages)
- `BlogPosting` (blog posts)
- `BreadcrumbList` (pages, blog)

**hreflang**: генерируется в `[locale]/layout.tsx` на основе alternate slugs локалей.

---

## 8. Дизайн-система (gpi-realty.ge)

**Decision**: Tailwind CSS 4 с design tokens, извлечёнными из текущего сайта:

| Token | Значение (approx) | Использование |
|-------|-------------------|---------------|
| `--color-bg-primary` | `#0a0a0a` / dark | Фон |
| `--color-text-primary` | `#ffffff` | Текст |
| `--color-accent` | gold/amber accent | CTA, highlights |
| `--font-heading` | sans-serif bold | Заголовки GPI |
| `--font-body` | sans-serif | Основной текст |

Компоненты Header/Footer/BlogCard — по референсу gpi-realty.ge (логотип GPI слева, nav по центру/справа, EN/RU/KA switcher, социконки).

**Rationale**: FR-017; Tailwind — стандарт экосистемы Next.js, mobile-first utilities.

**Alternatives considered**: CSS Modules — менее согласовано с Payload template; styled-components — лишний runtime.

---

## 9. Изображения

**Decision**: Payload Media collection + `next/image` с автоматическими sizes; WebP/AVIF через Next.js Image Optimization; обязательный `featuredImage` для blog posts (validation hook блокирует publish).

**Rationale**: FR-012, PageSpeed ≥ 90.

---

## 10. Тестирование

**Decision**:
- **Vitest** — unit: seo helpers, slug validation, component render
- **Vitest + Payload test utils** — integration: collection hooks, publish validation
- **Playwright** — E2E: CRUD flows (admin), public pages (3 locales), responsive viewports (320, 768, 1920)

**Rationale**: Конституция IV; Playwright покрывает локали и breakpoints (VIII, IX).

---

## 11. Slug uniqueness

**Decision**: Unique index на `slug` per collection per locale; Payload `beforeValidate` hook для slugify; admin error message на дубликат.

**Rationale**: Edge case из spec — FR-004, FR-006.

---

## 12. Публикация без полного перевода

**Decision**: Custom `beforeChange` hook — `_status: 'published'` разрешён только если все обязательные localized fields заполнены для ru, ka, en.

**Rationale**: Edge case spec — блокировка частичной публикации.

---

## Resolved NEEDS CLARIFICATION

Все технические неизвестные из Technical Context разрешены. Дополнительных блокеров для Phase 1 нет.
