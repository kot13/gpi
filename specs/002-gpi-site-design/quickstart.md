# Quickstart: 002-gpi-site-design

**Date**: 2026-05-30

## Prerequisites

- Завершена или доступна база `001-cms-foundation` (dev server, seed data)
- Node.js 20, PostgreSQL running
- Референс [gpi-realty.ge](https://gpi-realty.ge/) открыт для visual comparison

## Dev Setup

```bash
cd gpi
git checkout 002-gpi-site-design
npm install
npm run dev
```

**URLs для проверки**:
- http://localhost:3000/ru
- http://localhost:3000/ru/blog
- http://localhost:3000/ru/blog/{slug} — любая опубликованная запись

---

## Verify User Stories

### US1 — Типографика и визуальный стиль (P1)

1. Открыть `/ru` и `/ru/about` (или другую CMS-страницу)
2. Сравнить шрифты с gpi-realty.ge: Circe (body), Unbounded (крупные заголовки)
3. Проверить цвета: белый фон, текст `#414141`, акцент `#7E2226`
4. DevTools → 320px: текст читаем, нет horizontal scroll

**Tests**:
```bash
npm run test -- tests/unit/styles/tokens.test.ts
npm run test:e2e -- responsive.spec.ts
```

---

### US2 — Шапка и подвал (P1)

1. Открыть `/ru`, `/ru/blog`, `/ru/blog/{slug}`
2. Desktop (≥980px): logo слева, nav по центру, RU/KA/EN + соцсети справа
3. Mobile (375px): burger виден, nav скрыт
4. Нажать burger → все пункты меню + языки доступны
5. Escape или клик по ссылке → меню закрывается
6. Scroll to footer → legal block (company, ID, address, copyright)

**Tests**:
```bash
npm run test:e2e -- header-footer.spec.ts
```

---

### US3 — Блог: список (P2)

1. Убедиться что есть 3+ опубликованных записи (`GET /next/seed` если пусто)
2. Открыть `/ru/blog`
3. Hero-секция с заголовком и intro
4. Карточки: image, title, description; hover border brand
5. Переключить `/ka/blog`, `/en/blog` — layout сохраняется

**Tests**:
```bash
npm run test:e2e -- blog.spec.ts
```

---

### US4 — Блог: страница записи (P2)

1. Открыть `/ru/blog/{slug}` с длинным контентом и hero image
2. Проверить: h1, дата, рубрика, image, prose, CTA strip (WhatsApp/Telegram)
3. Mobile 320px: изображения масштабируются, burger работает

**Tests**:
```bash
npm run test:e2e -- blog.spec.ts
npm run test -- tests/unit/components/
```

---

## Visual Acceptance Checklist

Сравнить side-by-side с референсом (≥90% совпадение):

- [ ] Header layout desktop
- [ ] Burger menu mobile
- [ ] Footer legal block
- [ ] Blog list hero + cards
- [ ] Blog post title/meta/prose/CTA
- [ ] Typography scale h1–h3, body

---

## PageSpeed Check

После реализации:

```bash
npm run build
npm run start
# Lighthouse CI or manual PSI on /ru and /ru/blog
```

Target: **≥ 90** mobile and desktop.

> **Note (2026-05-30)**: After design update, run Lighthouse manually on production build (`npm run build && npm run start`) — automated PSI not run in CI for this feature.

---

## Font Assets

Положить woff2 Circe в `public/fonts/` (если предоставлены заказчиком):

```text
public/fonts/
├── Circe-Regular.woff2
├── Circe-Bold.woff2
└── ...
```

Без файлов — используется fallback из `research.md` (Manrope/Nunito) до получения лицензии.

---

## Commands Summary

| Command | Purpose |
|---------|---------|
| `npm run dev` | Dev server |
| `npm run test` | Unit tests |
| `npm run test:e2e` | Playwright E2E |
| `npm run build` | Production build + PageSpeed prep |
