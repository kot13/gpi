# Implementation Plan: CI/CD на стейджинг из GitHub

**Branch**: `008-staging-cicd` | **Date**: 2026-06-07 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/008-staging-cicd/spec.md`

## Summary

Настроить **GitHub Actions** для проекта GPI: обязательные проверки (lint, unit, integration, сборка с PostgreSQL) на каждый push/PR и **автоматический деплой на стейджинг-VPS** (Ubuntu 22.04, без Docker) при push в `main` + ручной `workflow_dispatch`. Деплой по **SSH**: обновление кода на сервере, `npm ci`, синхронизация схемы БД, `npm run build` с серверным `.env`, перезапуск через **PM2**. Секреты — только в GitHub Secrets и в `.env` на сервере.

## Technical Context

**Language/Version**: TypeScript 5.8 / Node.js 20 LTS / Next.js 15.3 / Payload CMS 3.85

**Primary Dependencies**: GitHub Actions (`ubuntu-22.04` runner), OpenSSH, PM2 на VPS, PostgreSQL 16 (локально на стейджинге), nginx (reverse proxy, уже на сервере)

**Storage**: PostgreSQL на стейджинг-VPS; медиа — локально на сервере (`public/` + uploads Payload)

**Testing**: CI gate — `npm run lint`, `npm run test:unit`, `npm run test:integration`, `npm run build` (с service container PostgreSQL); E2E **не** блокирует деплой в v1 (spec Assumptions). Тесты workflow-конфигурации — unit (yaml structure) + integration (shell dry-run deploy script)

**Target Platform**: GitHub → SSH → VPS Ubuntu 22.04 LTS (без Docker); приложение GPI (Next.js + Payload, SSG/ISR)

**Project Type**: DevOps / инфраструктура репозитория — `.github/workflows/`, `scripts/deploy/`, документация

**Performance Goals**: Полный цикл «коммит → стейджинг» ≤ 15 мин (SC-002); CI build+test ≤ 10 мин

**Constraints**: Без Docker; секреты не в репозитории; один concurrent deploy (`concurrency` group); production/CDN — out of scope

**Scale/Scope**: 2 workflow-файла, 1 remote deploy script, 1 env template для стейджинга, README/deploy docs, ~8–12 задач в tasks.md

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **I. Русский язык**: spec, plan, contracts, research на русском
- [x] **II. Статика**: фича не меняет модель рендеринга; деплой сохраняет SSG/ISR (`npm run build` + `npm run start`)
- [x] **III. Best practices**: официальные паттерны GitHub Actions (concurrency, environments, secrets masking); PM2 graceful reload для Node.js
- [x] **IV. Тесты**: CI прогоняет существующие unit/integration; новые тесты для deploy-скрипта и валидации workflow; E2E вне blocking gate (документировано в Assumptions spec)
- [x] **V. SEO/GEO**: не применимо — нет новых публичных страниц; `NEXT_PUBLIC_SERVER_URL` на стейджинге MUST указывать на staging-домен (FR-008)
- [x] **VI. PageSpeed**: не применимо к CI/CD; smoke-check HTTP 200 после деплоя (SC-005)
- [x] **VII. PostgreSQL**: `db:push` / migrate в deploy; строка подключения из серверного `.env`
- [x] **VIII. Трёхъязычность**: не применимо — нет UI/контента; smoke `/ru`, `/ka`, `/en` опционально в post-deploy step
- [x] **IX. Адаптивность**: не применимо — нет UI-изменений

**Post-design re-check**: Сборка на сервере (а не только на runner) обоснована доступом Payload/Next к локальной PostgreSQL при `next build` без открытия БД в интернет (research §1). E2E вне CI gate — явное ограничение v1 в spec Out of Scope; CI покрывает unit+integration+build verification на runner с ephemeral PostgreSQL (research §4).

## Project Structure

### Documentation (this feature)

```text
specs/008-staging-cicd/
├── plan.md              # Этот файл
├── research.md          # Phase 0
├── data-model.md        # Phase 1 — сущности CI/CD
├── quickstart.md        # Phase 1 — настройка и проверка
├── contracts/
│   ├── github-workflows.md
│   ├── github-secrets.md
│   └── deploy-server.md
└── tasks.md             # Phase 2 — /speckit-tasks
```

### Source Code

```text
.github/
└── workflows/
    ├── ci.yml                    # lint + test + build (PR + push)
    └── deploy-staging.yml        # deploy on main + workflow_dispatch

scripts/
└── deploy/
    ├── staging-remote.sh         # выполняется на VPS по SSH
    └── staging-remote.sh.tpl     # шаблон с документированными переменными

docs/                             # опционально, или секция в README
└── deploy-staging.md             # runbook для команды

tests/
├── unit/deploy/
│   └── stagingRemoteScript.test.ts   # проверка обязательных шагов скрипта
└── integration/
    └── ci-workflows.test.ts          # структура yaml (jobs, triggers, concurrency)

.env.staging.example              # список переменных для серверного .env (без значений)
```

**Structure Decision**: Workflow-файлы в `.github/workflows/`; логика деплоя — в `scripts/deploy/` для тестируемости и повторного использования из `workflow_dispatch`. Серверный `.env` живёт **только на VPS** (`/var/www/gpi/.env` или путь из secret); в репозиторий — только `.env.staging.example`.

## Complexity Tracking

| Topic | Decision | Simpler Alternative Rejected Because |
|-------|----------|--------------------------------------|
| Build на VPS, не только на runner | CI проверяет build на ephemeral PG; production build на сервере с локальной БД | Сборка на runner + rsync `.next` требует открыть staging PostgreSQL в интернет или дублировать build без реальных данных |
| PM2 reload | `pm2 reload gpi-staging --update-env` | `kill` + `start` — downtime; systemd без reload — дольше простой |
| E2E вне CI gate v1 | unit+integration+build в CI | Playwright в CI + dev server — +5–10 мин, flaky; spec Out of Scope |
| Git pull на сервере | `git fetch && git reset --hard origin/main` | rsync артефактов — сложнее синхронизировать `src/`, `payload.config.ts`, lockfile |

## Phase 0 / Phase 1 Artifacts

| Artifact | Path | Status |
|----------|------|--------|
| Research | [research.md](./research.md) | ✅ |
| Data model | [data-model.md](./data-model.md) | ✅ |
| Workflow contract | [contracts/github-workflows.md](./contracts/github-workflows.md) | ✅ |
| Secrets contract | [contracts/github-secrets.md](./contracts/github-secrets.md) | ✅ |
| Server deploy contract | [contracts/deploy-server.md](./contracts/deploy-server.md) | ✅ |
| Quickstart | [quickstart.md](./quickstart.md) | ✅ |

## Next Step

`/speckit-tasks` — декомпозиция на задачи с фазой тестов для workflow и deploy-скрипта.
