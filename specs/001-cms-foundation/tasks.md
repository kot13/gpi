---
description: "Task list for 001-cms-foundation — инициализация CMS GPI"
---

# Tasks: Инициализация CMS — страницы, блог, шапка и подвал

**Input**: Design documents from `/specs/001-cms-foundation/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: ОБЯЗАТЕЛЬНЫ (конституция GPI, принцип IV; plan.md — Vitest + Playwright)

**Organization**: Задачи сгруппированы по user story для независимой реализации и тестирования.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Можно выполнять параллельно (разные файлы, нет зависимостей)
- **[Story]**: User story из spec.md (US1–US4)

## Path Conventions

Монорепозиторий Payload CMS 3 + Next.js — см. [plan.md](./plan.md)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Инициализация проекта и инструментов

- [X] T001 Инициализировать проект из Payload CMS Website Template в корне репозитория (Next.js 15 + Payload 3 + PostgreSQL)
- [X] T002 Создать `docker-compose.yml` с сервисом PostgreSQL 16 для dev-окружения
- [X] T003 Создать `.env.example` с `DATABASE_URI`, `PAYLOAD_SECRET`, `NEXT_PUBLIC_SERVER_URL`
- [X] T004 Добавить npm-скрипты в `package.json`: `dev`, `build`, `test`, `test:unit`, `test:integration`, `test:e2e`, `test:coverage`, `seed`
- [X] T005 [P] Настроить `vitest.config.ts` и `tests/setup/vitest.setup.ts`
- [X] T006 [P] Настроить `playwright.config.ts` с проектами для локалей ru/ka/en и viewports 320/768/1920
- [X] T007 [P] Настроить Tailwind CSS 4: `tailwind.config.ts`, `postcss.config.mjs`, `src/app/globals.css`
- [X] T008 [P] Создать структуру каталогов по plan.md: `src/collections/`, `src/globals/`, `src/components/`, `src/lib/`, `tests/`
- [X] T009 [P] Добавить ассеты в `public/images/`: логотип GPI, `og-default.jpg` (1200×630)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Базовая инфраструктура — MUST завершиться до user stories

**⚠️ CRITICAL**: User story work не начинается до завершения этой фазы

- [X] T010 Настроить `src/payload.config.ts`: PostgreSQL adapter, localization (ru, ka, en), SEO plugin, Lexical editor
- [X] T011 [P] Создать `src/collections/Media.ts` с обязательным полем `alt`
- [X] T012 [P] Создать `src/collections/Users.ts` (auth для admin)
- [X] T013 Создать `src/lib/payload/getPayload.ts` — singleton Payload client
- [X] T014 [P] Создать `src/lib/i18n/config.ts` и файлы переводов UI-строк `src/lib/i18n/messages/{ru,ka,en}.json`
- [X] T015 [P] Создать `src/lib/seo/metadata.ts` — helpers для `generateMetadata` (contracts/seo-metadata.md)
- [X] T016 [P] Создать `src/lib/seo/jsonLd.ts` — WebPage, BlogPosting, BreadcrumbList, RealEstateAgent
- [X] T017 [P] Создать `src/lib/seo/hreflang.ts` — генерация alternate links
- [X] T018 [P] Создать `src/hooks/slugify.ts` — нормализация slug
- [X] T019 Создать `src/hooks/validateLocalizedPublish.ts` — блокировка publish без ru/ka/en
- [X] T020 Создать `src/hooks/revalidateFrontend.ts` — afterChange/afterDelete → revalidatePath
- [X] T021 Создать `src/middleware.ts` — locale detection, redirect `/` → `/ru`
- [X] T022 Создать минимальный `src/app/(frontend)/[locale]/layout.tsx` (placeholder, без финального дизайна)
- [X] T023 [P] Создать `tests/integration/payload/setup.test.ts` — проверка подключения Payload + PostgreSQL
- [X] T024 [P] Создать `tests/e2e/fixtures.ts` — baseURL, locale helpers для Playwright

**Checkpoint**: Foundation ready — можно начинать user stories

---

## Phase 3: User Story 1 — Управление страницами сайта (Priority: P1) 🎯 MVP

**Goal**: CRUD страниц в admin + публичное отображение на ru/ka/en через SSG

**Independent Test**: Создать страницу «О нас» на трёх языках, опубликовать, открыть `/ru/about`, `/ka/about`, `/en/about`; снять с публикации → 404

### Tests for User Story 1 (ОБЯЗАТЕЛЬНО)

> **NOTE: Написать тесты ПЕРВЫМИ, убедиться что они FAIL до реализации**

- [X] T025 [P] [US1] Unit-тест slugify в `tests/unit/hooks/slugify.test.ts`
- [X] T026 [P] [US1] Unit-тест validateLocalizedPublish в `tests/unit/hooks/validateLocalizedPublish.test.ts`
- [X] T027 [P] [US1] Integration-тест коллекции Pages в `tests/integration/collections/pages.test.ts` (draft/publish/slug unique)
- [X] T028 [US1] E2E-тест страниц в `tests/e2e/pages.spec.ts` (create in admin → verify public URLs, 404 on unpublish)

### Implementation for User Story 1

- [X] T029 [US1] Создать `src/collections/Pages.ts` — fields, drafts, hooks (slugify, validateLocalizedPublish, revalidateFrontend)
- [X] T030 [US1] Зарегистрировать Pages в `src/payload.config.ts`
- [X] T031 [P] [US1] Создать `src/components/pages/RichText.tsx` — рендер Lexical (без duplicate h1)
- [X] T032 [P] [US1] Создать `src/components/pages/PageContent.tsx` — title h1 + RichText
- [X] T033 [US1] Создать `src/lib/payload/queries/pages.ts` — getPageBySlug, getAllPageSlugs
- [X] T034 [US1] Создать `src/app/(frontend)/[locale]/page.tsx` — главная (slug: `home`)
- [X] T035 [US1] Создать `src/app/(frontend)/[locale]/[...slug]/page.tsx` — динамические CMS-страницы + generateStaticParams
- [X] T036 [US1] Добавить `generateMetadata` для страниц через `src/lib/seo/metadata.ts`
- [X] T037 [US1] Создать `src/app/(frontend)/[locale]/not-found.tsx` — кастомная 404 с noindex

**Checkpoint**: User Story 1 полностью функциональна и тестируется независимо

---

## Phase 4: User Story 2 — Блог: записи и рубрики (Priority: P2)

**Goal**: Рубрики + записи блога с optional category, featuredImage required for publish

**Independent Test**: Создать рубрику «Ипотека», опубликовать запись с картинкой без рубрики и с рубрикой; проверить `/ru/blog`, `/ru/blog/{slug}`, `/ru/blog/category/{slug}`

### Tests for User Story 2 (ОБЯЗАТЕЛЬНО)

- [X] T038 [P] [US2] Integration-тест BlogCategories в `tests/integration/collections/blog-categories.test.ts`
- [X] T039 [P] [US2] Integration-тест BlogPosts в `tests/integration/collections/blog-posts.test.ts` (featuredImage required, optional category, SET NULL on category delete)
- [X] T040 [US2] E2E-тест блога в `tests/e2e/blog.spec.ts` (list, single post, category filter, 3 locales)

### Implementation for User Story 2

- [X] T041 [US2] Создать `src/collections/BlogCategories.ts` — localized fields, slug hooks
- [X] T042 [US2] Создать `src/collections/BlogPosts.ts` — featuredImage publish validation, optional category, hooks
- [X] T043 [US2] Зарегистрировать BlogCategories и BlogPosts в `src/payload.config.ts`
- [X] T044 [P] [US2] Создать `src/components/blog/BlogCard.tsx` — превью: image, title, description
- [X] T045 [P] [US2] Создать `src/components/blog/BlogList.tsx` — grid карточек + pagination
- [X] T046 [P] [US2] Создать `src/components/blog/BlogPostView.tsx` — featured image, title, description, content, category
- [X] T047 [US2] Создать `src/lib/payload/queries/blog.ts` — getPosts, getPostBySlug, getPostsByCategory, getAllBlogSlugs
- [X] T048 [US2] Создать `src/app/(frontend)/[locale]/blog/page.tsx` — список записей
- [X] T049 [US2] Создать `src/app/(frontend)/[locale]/blog/[slug]/page.tsx` — запись + generateStaticParams
- [X] T050 [US2] Создать `src/app/(frontend)/[locale]/blog/category/[slug]/page.tsx` — записи рубрики
- [X] T051 [US2] Добавить BlogPosting JSON-LD и generateMetadata для blog routes в `src/lib/seo/jsonLd.ts`

**Checkpoint**: User Stories 1 и 2 работают независимо

---

## Phase 5: User Story 3 — Настройка шапки и подвала (Priority: P3)

**Goal**: Globals header/footer — nav items, social links с иконками; изменения на всех страницах

**Independent Test**: Изменить пункт «Контакты» и добавить Telegram в admin → проверить на любой публичной странице (3 локали)

### Tests for User Story 3 (ОБЯЗАТЕЛЬНО)

- [X] T052 [P] [US3] Integration-тест global Header в `tests/integration/globals/header.test.ts`
- [X] T053 [P] [US3] Integration-тест global Footer в `tests/integration/globals/footer.test.ts`
- [X] T054 [US3] E2E-тест header/footer в `tests/e2e/header-footer.spec.ts` (nav items, social icons, locale switcher labels)

### Implementation for User Story 3

- [X] T055 [US3] Создать `src/globals/Header.ts` — navItems array, socialLinks array (contracts/collections-schema.md)
- [X] T056 [US3] Создать `src/globals/Footer.ts` — navItems, companyName, identificationNumber, address, copyrightText
- [X] T057 [US3] Зарегистрировать Header и Footer globals в `src/payload.config.ts`
- [X] T058 [P] [US3] Создать `src/components/layout/Nav.tsx` — рендер navItems (internal/external links)
- [X] T059 [P] [US3] Создать иконки соцсетей в `src/components/ui/icons/` (WhatsApp, Telegram, VK, Viber, Messenger)
- [X] T060 [P] [US3] Создать `src/components/ui/SocialLinks.tsx` — platform → icon mapping
- [X] T061 [P] [US3] Создать `src/components/layout/LanguageSwitcher.tsx` — ru/ka/en switch с alternate slug logic
- [X] T062 [US3] Создать `src/components/layout/Header.tsx` — logo, Nav, LanguageSwitcher, SocialLinks
- [X] T063 [US3] Создать `src/components/layout/Footer.tsx` — Nav, legal block
- [X] T064 [US3] Создать `src/lib/payload/queries/globals.ts` — getHeader, getFooter
- [X] T065 [US3] Интегрировать Header/Footer в `src/app/(frontend)/[locale]/layout.tsx`
- [X] T066 [US3] Добавить revalidation paths для globals в `src/hooks/revalidateFrontend.ts`

**Checkpoint**: User Stories 1–3 работают; навигация единая на всех страницах

---

## Phase 6: User Story 4 — Визуальное соответствие gpi-realty.ge (Priority: P4)

**Goal**: Фирменный стиль GPI — цвета, типографика, layout шапки/подвала/карточек блога

**Independent Test**: Сравнить `/ru` и `/ru/blog` с https://gpi-realty.ge/ на desktop и mobile (320/768/1920)

### Tests for User Story 4 (ОБЯЗАТЕЛЬНО)

- [X] T067 [P] [US4] Unit-тест design tokens в `tests/unit/styles/tokens.test.ts`
- [X] T068 [US4] E2E responsive + visual checks в `tests/e2e/responsive.spec.ts` (320/768/1920, no horizontal scroll, touch targets ≥ 44px)

### Implementation for User Story 4

- [X] T069 [US4] Определить design tokens GPI в `src/app/globals.css` и `tailwind.config.ts` (dark bg, accent, typography — research.md §8)
- [X] T070 [US4] Стилизовать `src/components/layout/Header.tsx` по референсу gpi-realty.ge (logo left, nav, language switcher, social icons)
- [X] T071 [US4] Стилизовать `src/components/layout/Footer.tsx` по референсу gpi-realty.ge (nav, legal block, copyright)
- [X] T072 [US4] Стилизовать `src/components/blog/BlogCard.tsx` и `BlogList.tsx` — карточки по стилю GPI
- [X] T073 [US4] Стилизовать `src/components/pages/PageContent.tsx` — типографика контента, responsive containers
- [X] T074 [US4] Добавить `next/image` sizes/srcset для featured images и media в blog/page components

**Checkpoint**: Все user stories завершены с фирменным дизайном GPI

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: SEO, seed, производительность, финальная валидация

- [X] T075 [P] Добавить RealEstateAgent + WebSite JSON-LD в `src/app/(frontend)/[locale]/layout.tsx`
- [X] T076 [P] Добавить hreflang links в layout через `src/lib/seo/hreflang.ts` (все публичные routes)
- [X] T077 [P] Unit-тесты SEO helpers в `tests/unit/lib/seo/metadata.test.ts` и `tests/unit/lib/seo/jsonLd.test.ts`
- [X] T078 Создать `src/seed/index.ts` — seed user, header, footer, pages (home/about/contacts), blog category (data-model.md)
- [X] T079 [P] Локализация контента seed на ru/ka/en в `src/seed/index.ts`
- [X] T080 [P] SEO/GEO проверка: метатеги, OG, JSON-LD, иерархия h1 на pages и blog (ru, ka, en)
- [X] T081 [P] Проверка PageSpeed ≥ 90 на `/ru` и `/ru/blog` (mobile + desktop)
- [X] T082 [P] Проверка адаптивной вёрстки на mobile/tablet/desktop (playwright + manual)
- [X] T083 Запустить `pnpm test:coverage` — покрытие нового кода 100% (или задокументировать исключения)
- [X] T084 Валидация quickstart.md — пройти все сценарии из `specs/001-cms-foundation/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: без зависимостей
- **Foundational (Phase 2)**: зависит от Setup — **BLOCKS** все user stories
- **US1 (Phase 3)**: зависит от Foundational — MVP
- **US2 (Phase 4)**: зависит от Foundational; независима от US3/US4 (layout placeholder достаточен)
- **US3 (Phase 5)**: зависит от Foundational; интегрируется с US1/US2 routes (pages/blog уже exist)
- **US4 (Phase 6)**: зависит от US1–US3 components (стилизует существующие компоненты)
- **Polish (Phase 7)**: зависит от US1–US4

### User Story Dependencies

| Story | Зависимости | Независимый тест |
|-------|-------------|------------------|
| US1 (P1) | Foundational | ✅ CRUD pages, public URLs |
| US2 (P2) | Foundational | ✅ Blog без новых pages |
| US3 (P3) | Foundational, US1 routes exist | ✅ Header/footer на любой странице |
| US4 (P4) | US1–US3 components | ✅ Visual compare gpi-realty.ge |

### Within Each User Story

- Тесты MUST быть написаны и FAIL до реализации
- Collections/globals → queries → components → routes
- Story complete → checkpoint validation

### Parallel Opportunities

- **Phase 1**: T005, T006, T007, T008, T009 — параллельно после T001
- **Phase 2**: T011–T012, T014–T017, T023–T024 — параллельно после T010
- **US1**: T025–T027 параллельно; T031–T032 параллельно после T029
- **US2**: T038–T039 параллельно; T044–T046 параллельно после T042
- **US3**: T052–T053 параллельно; T058–T061 параллельно после T055
- **US4**: T067 параллельно с T069; T070–T074 частично параллельно (разные файлы)
- **Polish**: T075–T077, T079–T082 — параллельно

---

## Parallel Example: User Story 1

```bash
# Tests first (parallel):
T025: tests/unit/hooks/slugify.test.ts
T026: tests/unit/hooks/validateLocalizedPublish.test.ts
T027: tests/integration/collections/pages.test.ts

# Components (parallel after collection):
T031: src/components/pages/RichText.tsx
T032: src/components/pages/PageContent.tsx
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (**CRITICAL**)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: quickstart US1 scenarios + `tests/e2e/pages.spec.ts`
5. Demo MVP — CMS pages на 3 языках

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. US1 → Pages → Deploy/Demo (**MVP**)
3. US2 → Blog → Deploy/Demo
4. US3 → Header/Footer → Deploy/Demo
5. US4 → GPI Design → Deploy/Demo
6. Polish → SEO, PageSpeed, seed, coverage

### Parallel Team Strategy

1. Вся команда: Setup + Foundational
2. После Foundational:
   - Dev A: US1 (Pages)
   - Dev B: US2 (Blog) — параллельно с A
3. После US1+US2 routes:
   - Dev C: US3 (Header/Footer)
4. Dev D: US4 (Design) — после US3 components exist

---

## Notes

- Зарезервированные slug для pages: `blog`, `admin`, `api`, `_next` (contracts/public-routes.md)
- Каталог недвижимости — placeholder external URL в seed (FR-023)
- Все задачи содержат конкретные пути к файлам
- Commit после каждой задачи или логической группы
- Остановка на checkpoint для независимой валидации story
