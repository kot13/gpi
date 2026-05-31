# Research: 002-gpi-site-design

**Date**: 2026-05-30

## 1. Шрифты референса gpi-realty.ge

**Decision**: Основной шрифт — **Circe** (nav, body, UI); заголовки hero/акценты —
**Unbounded** (как на референсе через Google Fonts). Подключение через `next/font/local`
(Circe woff2 в `public/fonts/`) + `next/font/google` (Unbounded).

**Rationale**: Анализ HTML/CSS референса показал:
- `font-family: 'Circe', Arial, sans-serif` — навигация, меню, основной текст (16px)
- Google Fonts: `Unbounded:wght@300;400;600;700` + `OpenSans` — заголовки и акценты
- Активный пункт меню: `color: #7e2226; font-weight: 700`

**Alternatives considered**:
- Оставить Geist Sans — визуально не соответствует бренду GPI
- Только Open Sans — не совпадает с фирменной типографикой Tilda-сайта
- CDN `@font-face` без next/font — хуже для PageSpeed (нет автоматического subsetting)

**Fallback**: если файлы Circe недоступны легально — **Manrope** или **Nunito Sans**
как временный web fallback с пометкой в PR; приоритет — получить woff2 от заказчика.

---

## 2. Цветовая палитра

**Decision**: Переход от текущей тёмной темы (Geist, `#0a0a0a`) к палитре референса:

| Token | HEX | Использование |
|-------|-----|---------------|
| `--color-gpi-brand` | `#7E2226` | Акцент, active nav, CTA hover |
| `--color-gpi-text` | `#414141` | Основной текст, nav links |
| `--color-gpi-bg` | `#FFFFFF` | Фон страницы, header |
| `--color-gpi-bg-secondary` | `#F5F5F5` | Карточки, footer bg |
| `--color-gpi-muted` | `#999999` | Вторичный текст |
| `--color-gpi-border` | `#E5E5E5` | Разделители |

**Rationale**: Референс использует белую sticky-шапку (`rgba(255,255,255,0.9)` при
scroll), тёмно-серый текст `#414141`, бордовый акcent `#7E2226`. Текущие gold-тokens
(`#d4a853`) заменяются на brand red.

**Alternatives considered**:
- Сохранить dark theme — противоречит визуальному паритету с gpi-realty.ge
- CSS variables только в Tailwind @theme — принято, совместимо с Tailwind 4

---

## 3. Шапка и бургер-меню

**Decision**: Sticky header высотой ~70px, белый фон, logo слева, nav по центру
(desktop ≥980px), языки + соцсети справа. На `< lg` (≤979px) — **MobileNav** Client
Component: иконка burger (3 линии → X), full-screen overlay с nav + LanguageSwitcher +
SocialLinks; закрытие по Escape, клику на backdrop, выбору ссылки; `body overflow: hidden`
при открытом меню.

**Rationale**: Tilda breakpoint `max-width: 980px` для `.tmenu-mobile`; паттерн
`t_menu__createMobileMenu` — industry standard для real estate sites.

**Alternatives considered**:
- Radix Dialog / Headless UI — допустимо, но для одного burger достаточно lightweight
  custom component (меньше bundle)
- CSS-only checkbox hack — хуже a11y (focus trap, aria)

**a11y**: `aria-expanded`, `aria-controls`, `role="dialog"`, focus trap, Escape key.

---

## 4. Подвал

**Decision**: Footer по референсу: legal block (company name, ID, address, copyright),
навигационные ссылки, опционально соцсети; светлый или контрастный фон с border-top;
типографика Circe 14px muted.

**Rationale**: Данные уже в global `footer` (001); нужны только стили и layout.

---

## 5. Блог — список

**Decision**: Hero-секция списка блога (`/blog`):
- Заголовок «Блог GPI» (Unbounded/Circe uppercase по референсу)
- Подзаголовок/intro (локализованные UI-строки через next-intl)
- Блок «Средняя скорость прочтения…» — статическая UI-строка (ru/ka/en)
- Сетка карточек: image top, category badge, title, description; border-radius 16px;
  hover border `#7E2226`; 1 col mobile, 2 col tablet, 3 col desktop

**Rationale**: [gpi-realty.ge/blog/ru](https://gpi-realty.ge/blog/ru) — hero + card grid.

**Alternatives considered**:
- Masonry layout — не используется на референсе

---

## 6. Блог — страница записи

**Decision**: Layout статьи:
1. Breadcrumb/label «Блог» (optional)
2. `h1` — title (Circe/Unbounded, крупный)
3. Meta row: дата (`publishedAt`), category link
4. Hero image full-width или contained с radius
5. Lead/description paragraph
6. `.gpi-prose` для Lexical content (h2–h4, lists, links)
7. **BlogPostCTA** — strip с кнопками WhatsApp/Telegram/«Оставить заявку»
   (ссылки из header socialLinks или hardcoded UI labels + URLs from CMS seed)

**Rationale**: [Пример записи](https://gpi-realty.ge/blog/ru/tpost/te1af6evo1-green-side-v-gonio-apartamenti-u-morya-v)
— title, content, footer CTA с мессенджерами.

**Out of scope**: форма заявки — только styled links как на референсе.

---

## 7. Типографика контента (prose)

**Decision**: `@tailwindcss/typography` с кастомным variant `.gpi-prose`:
- body: Circe 16–18px, line-height 1.5–1.6
- h2/h3: Circe 600, brand color или `#414141`
- lists: отступы по референсу
- links: `#7E2226` underline on hover

**Rationale**: Единый prose для blog и CMS pages; FR-001.

---

## 8. Производительность шрифтов

**Decision**: `next/font` с `display: 'swap'`, preload только Circe regular + semibold +
Unbounded 600; subset latin + cyrillic.

**Rationale**: PageSpeed ≥ 90 (FR-010); avoid FOUT without blocking render.

---

## 9. Тестирование

**Decision**:
- **Unit**: `tokens.test.ts` — все CSS variables; `MobileNav` — open/close/escape
- **Component**: BlogCard render, BlogPostView meta row
- **E2E Playwright**: burger visible @375px, hidden @1280px; blog card structure;
  post page h1 + CTA; 3 locales smoke

**Rationale**: Конституция IV; регрессии UI критичны для brand.

---

## 10. Консолидация Header

**Decision**: Единая точка входа — `Header/Component.tsx` (server) + `Component.client.tsx`
(mobile nav state). Удалить дублирование `components/layout/Header.tsx` или сделать re-export.

**Rationale**: В кодовой базе два Header; DRY снижает drift стилей.

---

## Resolved NEEDS CLARIFICATION

Все технические неизвестные разрешены. Блокеров для Phase 1 нет.
