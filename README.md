# GPI — Georgia Private Investment

Сайт агентства недвижимости **Georgia Private Investment** ([gpi-realty.ge](https://gpi-realty.ge/)).

Монорепозиторий на **Payload CMS 3 + Next.js 15**: публичный сайт (SSG/ISR) и панель управления контентом в одном приложении. Три языка: **ru**, **ka**, **en**.

## Возможности

- **Страницы** — CRUD, черновики, публикация, локализация ru/ka/en
- **Блог** — записи с заглавным изображением, описанием, контентом; рубрики опциональны
- **Шапка и подвал** — навигация, соцсети, юридический блок (настраиваются в admin)
- **SEO/GEO** — meta, Open Graph, JSON-LD, hreflang, sitemap
- **Дизайн** — тёмная тема и фирменные токены GPI

Публичные URL:

| Маршрут | Описание |
|---------|----------|
| `/` | редирект на `/ru` |
| `/{locale}` | главная (`home`) |
| `/{locale}/{slug}` | CMS-страницы |
| `/{locale}/blog` | список записей |
| `/{locale}/blog/{slug}` | запись блога |
| `/{locale}/blog/category/{slug}` | рубрика |
| `/admin` | панель Payload CMS |

---

## Требования

### Окружение разработки

| Компонент | Версия |
|-----------|--------|
| Node.js | **20 LTS** или новее |
| npm | 9+ |
| PostgreSQL | **16** |
| Docker | опционально (для локальной БД) |

### Production

| Комponent | Назначение |
|-----------|------------|
| Node.js 20+ | запуск Next.js + Payload (`npm run start`) |
| PostgreSQL 16 | хранение контента CMS |
| CDN | кеш статики и HTML (см. [Публикация на CDN](#публикация-на-cdn)) |
| Object storage | рекомендуется для медиафайлов при высокой нагрузке (S3, R2 и т.п.) |

### Переменные окружения

Скопируйте `.env.example` в `.env`:

```bash
cp .env.example .env
```

| Переменная | Обязательна | Описание |
|------------|-------------|----------|
| `DATABASE_URI` | да | PostgreSQL, напр. `postgresql://gpi:pass@host:5432/gpi` |
| `PAYLOAD_SECRET` | да | Секрет JWT, минимум 32 символа |
| `NEXT_PUBLIC_SERVER_URL` | да | Публичный URL без `/` на конце, напр. `https://gpi-realty.ge` |
| `PREVIEW_SECRET` | нет | Preview-режим черновиков |
| `CRON_SECRET` | нет | Cron-задачи (отложенная публикация) |

---

## Локальная разработка

### 1. PostgreSQL

**Через Docker:**

```bash
docker compose up -d postgres
```

**Или** локальный PostgreSQL с пользователем/БД из `DATABASE_URI`.

### 2. Установка и схема БД

```bash
npm install
npm run db:push    # подтвердите предупреждения Drizzle, если появятся
```

> `db:push` запускайте **без** работающего `npm run dev` — иначе возможен deadlock в PostgreSQL.

### 3. Dev-сервер и seed

```bash
npm run dev
```

- Публичный сайт: http://localhost:3000/ru  
- Admin: http://localhost:3000/admin  
- Seed (один раз): http://localhost:3000/next/seed  

Демо-пользователь после seed: `demo-author@example.com` / `password`

### 4. Тесты

```bash
npm run test:unit
npm run test:integration
npm run test:e2e
npm run test:coverage
```

---

## Сборка

```bash
npm run build
```

| Что | Куда |
|-----|------|
| Production-бандл Next.js | `.next/` |
| Sitemap, robots.txt | `public/sitemap.xml`, `public/robots.txt` (postbuild) |
| Загруженные медиа CMS | `public/media/` (runtime) |

Запуск production-сервера:

```bash
npm run start
# слушает PORT (по умолчанию 3000)
```

Проверка PageSpeed (цель ≥ 90):

```bash
npm run build && npm run start
# Lighthouse / PageSpeed Insights на /ru и /ru/blog
```

---

## Публикация на CDN

Проект использует **SSG/ISR** (статическая генерация + инвалидация при публикации в CMS). Это **не** чистый статический экспорт в HTML-файлы: нужен Node.js-сервер для admin, API Payload и on-demand revalidation.

Типовая production-схема:

```text
Посетитель → CDN (кеш) → Node.js (Next.js + Payload) → PostgreSQL
                              ↓
                         /admin, /api  (не кешировать)
```

### Шаг 1. Сборка на CI или сервере

```bash
npm ci
cp .env.production .env   # или секреты из CI
npm run db:push           # dev/staging; в prod — payload migrate
npm run build
```

Убедитесь, что `NEXT_PUBLIC_SERVER_URL` указывает на **боевой домен** (важно для SEO, OG, sitemap).

### Шаг 2. Деплой приложения

Запустите Node.js-процесс с артеfact `.next/`:

```bash
NODE_ENV=production npm run start
```

Варианты хостинга origin:

- VPS + systemd / PM2
- Docker-контейнер
- PaaS (Railway, Render, Fly.io и т.д.)

Минимальный Dockerfile (пример):

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
EXPOSE 3000
CMD ["npm", "run", "start"]
```

### Шаг 3. Настройка CDN

CDN ставится **перед** origin-сервером и кеширует ответы. Примеры: **Cloudflare**, **AWS CloudFront**, **Fastly**, **Bunny CDN**.

#### Правила кеширования

| Путь | Cache-Control | Примечание |
|------|---------------|------------|
| `/_next/static/*` | `public, max-age=31536000, immutable` | JS/CSS/chunks — долгий кеш |
| `/images/*`, `/favicon.*` | `public, max-age=86400` | статика из `public/` |
| `/api/media/file/*` | `public, max-age=604800` | изображения CMS |
| `/ru`, `/ka`, `/en`, `/ru/blog`, … | `public, s-maxage=600, stale-while-revalidate=86400` | HTML SSG/ISR |
| `/admin`, `/admin/*` | **Bypass cache** | только origin |
| `/api/*` | **Bypass cache** | Payload REST/GraphQL |

#### Cloudflare (пример)

1. Добавьте домен, origin — IP/hostname сервера с `npm run start`
2. SSL: Full (strict)
3. **Cache Rules**:
   - `_next/static` → Cache Everything, Edge TTL 1 year
   - `/admin`, `/api` → Bypass
4. **Page Rules** / Transform Rules для заголовков `Cache-Control` на HTML

#### AWS CloudFront (пример)

1. Origin: ALB или EC2 с Node.js
2. Behavior `/_next/static/*` — TTL 365 дней
3. Default behavior — TTL 10 мин, forward cookies только для `/admin`
4. Опционально: S3 bucket для `public/` и `_next/static` как second origin (сложнее с ISR)

### Шаг 4. Обновление контента (ISR)

При публикации в CMS хуки вызывают `revalidatePath` — CDN получает свежий HTML при следующем запросе (или после истечения `s-maxage`).

После деплоя новой версии кода:

```bash
npm run build && npm run start
# при необходимости — purge CDN для изменённых URL
```

### Медиафайлы на CDN

По умолчанию медиа хранятся локально в `public/media/`. Для production рекомендуется вынести uploads в object storage (S3, Cloudflare R2) через плагин Payload storage — тогда URL файлов сразу отдаются с CDN storage.

---

## Структура проекта

```text
src/
├── app/(frontend)/[locale]/   # публичный сайт
├── app/(payload)/             # admin + API
├── collections/               # Pages, Posts, BlogCategories, Media, Users
├── Header/, Footer/           # globals CMS
├── components/                # UI, layout, blog
├── lib/seo/, lib/i18n/        # SEO, локали
└── payload.config.ts

specs/001-cms-foundation/      # спецификация и plan
tests/                         # unit, integration, e2e
```

---

## Troubleshooting

| Проблема | Решение |
|----------|---------|
| `db:push` не завершается | `Ctrl+C`, запустить без `npm run dev`; скрипт завершается через `process.exit(0)` |
| Deadlock при seed | остановите dev, выполните seed снова |
| `role "gpi" does not exist` | создайте пользователя/БД PostgreSQL или `docker compose up -d postgres` |
| Устаревший контент после publish | проверьте логи revalidate; purge CDN |
| PageSpeed < 90 | оптимизируйте изображения, проверьте CDN-кеш `_next/static` |

---

## Документация

- [Спецификация](specs/001-cms-foundation/spec.md)
- [План реализации](specs/001-cms-foundation/plan.md)
- [Quickstart](specs/001-cms-foundation/quickstart.md)
- [Payload CMS](https://payloadcms.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/app/building-your-application/deploying)
