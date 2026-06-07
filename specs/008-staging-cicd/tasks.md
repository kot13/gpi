---
description: "Task list for 008-staging-cicd — CI/CD на стейджинг из GitHub"
---

# Tasks: CI/CD на стейджинг из GitHub

**Input**: Design documents from `/specs/008-staging-cicd/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: ОБЯЗАТЕЛЬНЫ (конституция GPI, принцип IV; plan.md — unit + integration для deploy-скрипта и workflow YAML)

**Organization**: Задачи сгруппированы по user story. **Порядок выполнения**: Phase 1–2 → **US2 (CI gate)** → **US1 (деплой, MVP)** → US4 → US3 → Polish (US2 технически блокирует US1, см. Dependencies).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Можно выполнять параллельно (разные файлы, нет зависимостей)
- **[Story]**: User story из spec.md (US1–US4)

## Path Conventions

Инфраструктура репозитория — см. [plan.md](./plan.md): `.github/workflows/`, `scripts/deploy/`, `ecosystem.config.cjs`, `tests/unit/deploy/`, `tests/integration/`.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Каталоги, шаблоны окружения, PM2 config

- [X] T001 Создать каталог `scripts/deploy/` и `scripts/deploy/logs/.gitkeep` для deploy log на сервере (contracts/deploy-server.md)
- [X] T002 [P] Создать `.env.staging.example` — список переменных staging без значений (contracts/github-secrets.md)
- [X] T003 [P] Создать `ecosystem.config.cjs` — PM2 app `gpi-staging`, `npm run start`, PORT 3000 (contracts/deploy-server.md)
- [X] T004 [P] Создать каталог `.github/workflows/` если отсутствует (plan.md)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Deploy-скрипт, тестовые каркасы, документация — MUST до user stories

**⚠️ CRITICAL**: User story work не начинается до завершения этой фазы

- [X] T005 Создать каркас `scripts/deploy/staging-remote.sh` — `set -euo pipefail`, аргументы `--commit`, `--run-id`, preflight checks (contracts/deploy-server.md)
- [X] T006 [P] Создать unit-тест `tests/unit/deploy/stagingRemoteScript.test.ts` — проверка наличия обязательных шагов (git pull, npm ci, db:push, build, pm2 reload) — MUST FAIL до T013
- [X] T007 [P] Создать integration-тест `tests/integration/ci-workflows.test.ts` — парсинг YAML workflow-файлов (yaml или regex) — MUST FAIL до T021
- [X] T008 [P] Проверить `.gitignore` — `.env`, `.env.*` (кроме `.env.example`, `.env.staging.example`) не коммитятся (FR-007, SC-006)
- [X] T009 [P] Создать `docs/deploy-staging.md` — runbook-заготовка со ссылками на contracts (plan.md)
- [X] T010 Добавить `scripts/deploy/staging-remote.sh` executable bit и shebang `#!/usr/bin/env bash` в репозитории

**Checkpoint**: Foundation ready — deploy script skeleton, test scaffolds, env template

---

## Phase 3: User Story 2 — Проверки качества перед выкладкой (Priority: P2)

**Goal**: GitHub Actions CI — lint, unit, integration, build с PostgreSQL; failed gate блокирует деплой

**Independent Test**: Push PR с ломающим тестом → workflow `ci.yml` fail; push с green CI → статус success; deploy job не стартует при fail

### Tests for User Story 2 (ОБЯЗАТЕЛЬНО)

> **NOTE: Написать тесты ПЕРВЫМИ, убедиться что они FAIL до реализации**

- [X] T011 [P] [US2] Integration-тест в `tests/integration/ci-workflows.test.ts` — `ci.yml` содержит jobs: `lint`, `test-unit`, `test-integration`, `build` (contracts/github-workflows.md)
- [X] T012 [P] [US2] Integration-тест в `tests/integration/ci-workflows.test.ts` — `build` job использует service `postgres:16` и env `DATABASE_URI` (research.md §1, §4)
- [X] T013 [P] [US2] Integration-тест в `tests/integration/ci-workflows.test.ts` — triggers `push` и `pull_request` на `main` (FR-002)

### Implementation for User Story 2

- [X] T014 [US2] Создать `.github/workflows/ci.yml` — job `lint`: checkout, setup-node 20, npm ci, npm run lint (contracts/github-workflows.md)
- [X] T015 [US2] Добавить jobs `test-unit` (needs lint) и `test-integration` (needs test-unit) в `.github/workflows/ci.yml`
- [X] T016 [US2] Добавить job `build` (needs test-integration) — postgres:16 service, env `CI_PAYLOAD_SECRET`, `NEXT_PUBLIC_SERVER_URL=http://localhost:3000`, `npm run build` (research.md §1)
- [X] T017 [US2] Добавить `workflow_call` trigger в `.github/workflows/ci.yml` для reuse из deploy workflow (contracts/github-workflows.md)
- [X] T018 [US2] Настроить `permissions: contents: read` и `actions/setup-node@v4` с `cache: npm` в `.github/workflows/ci.yml`

**Checkpoint**: CI workflow green на main; PR checks работают

---

## Phase 4: User Story 1 — Автоматический деплой на стейджинг (Priority: P1) 🎯 MVP

**Goal**: Push в `main` → CI pass → SSH deploy на VPS → PM2 reload → smoke HTTP 200

**Independent Test**: Merge commit в `main` → через ≤15 мин staging показывает изменение; `/ru` и `/admin` отвечают без 5xx (SC-001, SC-005)

### Tests for User Story 1 (ОБЯЗАТЕЛЬНО)

- [X] T019 [P] [US1] Unit-тест в `tests/unit/deploy/stagingRemoteScript.test.ts` — порядок шагов: db:push до build, pm2 reload после build (data-model.md state transitions)
- [X] T020 [P] [US1] Unit-тест в `tests/unit/deploy/stagingRemoteScript.test.ts` — abort без pm2 reload при `set -e` на failed db:push/build (edge cases spec)
- [X] T021 [P] [US1] Integration-тест в `tests/integration/ci-workflows.test.ts` — `deploy-staging.yml` trigger `push: branches: [main]`, concurrency `staging-deploy` (FR-001, FR-011)

### Implementation for User Story 1

- [X] T022 [US1] Реализовать полный `scripts/deploy/staging-remote.sh` — git fetch/reset, npm ci, source .env, db:push, build, pm2 reload, append `logs/deploy.log` (contracts/deploy-server.md)
- [X] T023 [US1] Создать `.github/workflows/deploy-staging.yml` — job `ci` via `workflow_call` из `ci.yml` (needs FR-003)
- [X] T024 [US1] Добавить job `deploy` (needs ci) в `.github/workflows/deploy-staging.yml` — SSH через `webfactory/ssh-agent@v0.9.0` + secrets `STAGING_SSH_*`, `STAGING_APP_PATH` (research.md §7)
- [X] T025 [US1] SSH step: выполнить `bash scripts/deploy/staging-remote.sh --commit $GITHUB_SHA --run-id $GITHUB_RUN_ID` на сервере (contracts/deploy-server.md)
- [X] T026 [US1] Добавить smoke-check step в `.github/workflows/deploy-staging.yml` — curl `-fsS` `$STAGING_PUBLIC_URL/ru` и `/admin` (expect 200 or 302) (FR-012, SC-005)
- [X] T027 [US1] Настроить `concurrency: group: staging-deploy, cancel-in-progress: false` в `.github/workflows/deploy-staging.yml` (FR-011)
- [X] T028 [P] [US1] Добавить GitHub Environment `staging` с `url: ${{ vars.STAGING_PUBLIC_URL }}` в `.github/workflows/deploy-staging.yml` (contracts/github-workflows.md)
- [X] T029 [US1] Pin SSH host key — `ssh-keyscan` или known_hosts fingerprint в deploy job (research.md §7, security)

**Checkpoint**: MVP — auto deploy на staging при green CI; smoke pass

---

## Phase 5: User Story 4 — Безопасное управление секретами (Priority: P2)

**Goal**: Секреты только в GitHub Secrets и server `.env`; не в repo и logs

**Independent Test**: Audit repo history и CI logs — секреты не видны; deploy script не echo env values (SC-006)

### Tests for User Story 4 (ОБЯЗАТЕЛЬНО)

- [X] T030 [P] [US4] Unit-тест в `tests/unit/deploy/stagingRemoteScript.test.ts` — скрипт не содержит `echo`/`printenv` для `PAYLOAD_SECRET`, `DATABASE_URI` (FR-007)
- [X] T031 [P] [US4] Integration-тест в `tests/integration/ci-workflows.test.ts` — workflow использует `${{ secrets.* }}`, нет hardcoded credentials (FR-007)

### Implementation for User Story 4

- [X] T032 [P] [US4] Дополнить `.env.staging.example` — комментарии по каждой переменной и правило «не коммитить .env» (contracts/github-secrets.md)
- [X] T033 [US4] Обновить `scripts/deploy/staging-remote.sh` — `source .env` без вывода значений; fail если `.env` missing (exit 2) (contracts/deploy-server.md)
- [X] T034 [US4] Документировать inventory GitHub Secrets в `docs/deploy-staging.md` — таблица из contracts/github-secrets.md (FR-007)
- [X] T035 [P] [US4] Добавить секцию «Деплой на стейджинг» в `README.md` — secrets checklist, ссылка на docs/deploy-staging.md (quickstart.md)
- [X] T036 [US4] Убедиться `CI_PAYLOAD_SECRET` используется только в CI build job, не в deploy SSH steps (research.md §5)

**Checkpoint**: Secrets documented; audit checklist SC-006 выполним

---

## Phase 6: User Story 3 — Ручной перезапуск деплоя (Priority: P3)

**Goal**: `workflow_dispatch` из GitHub UI без нового коммита

**Independent Test**: Actions → Deploy Staging → Run workflow → staging обновлён для выбранного ref (FR-006)

### Tests for User Story 3 (ОБЯЗАТЕЛЬНО)

- [X] T037 [P] [US3] Integration-тест в `tests/integration/ci-workflows.test.ts` — `deploy-staging.yml` содержит `workflow_dispatch` input `ref` default `main` (FR-006)

### Implementation for User Story 3

- [X] T038 [US3] Добавить `workflow_dispatch` с input `ref` в `.github/workflows/deploy-staging.yml` (contracts/github-workflows.md)
- [X] T039 [US3] Checkout с `ref: ${{ inputs.ref || github.sha }}` в deploy job `.github/workflows/deploy-staging.yml`
- [X] T040 [US3] Передать resolved SHA в `staging-remote.sh --commit` при manual run (contracts/deploy-server.md)
- [X] T041 [P] [US3] Документировать manual redeploy и rollback-by-SHA в `docs/deploy-staging.md` (spec Assumptions rollback)

**Checkpoint**: Manual deploy и redeploy previous SHA работают

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Документация, валидация quickstart, финальные проверки

- [X] T042 [P] Обновить `specs/008-staging-cicd/quickstart.md` — финальные пути файлов и smoke checklist после implement
- [X] T043 [P] Отметить выполненные задачи `[X]` в `specs/008-staging-cicd/tasks.md` после `/speckit-implement`
- [X] T044 Запустить `npm run test:unit -- tests/unit/deploy/` и `npm run test:integration -- tests/integration/ci-workflows.test.ts` — все green
- [X] T045 [P] Рекомендации branch protection в `docs/deploy-staging.md` — required checks: lint, test-unit, test-integration, build (contracts/github-workflows.md)
- [ ] T046 Выполнить smoke checklist из quickstart.md на реальном staging VPS (post-merge validation, SC-001)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Setup — **BLOCKS all user stories**
- **US2 (Phase 3)**: Depends on Foundational — **BLOCKS US1 deploy gate**
- **US1 (Phase 4)**: Depends on US2 (ci.yml must exist for `workflow_call`)
- **US4 (Phase 5)**: Depends on US1 (deploy script and workflows exist)
- **US3 (Phase 6)**: Depends on US1 (extends deploy-staging.yml)
- **Polish (Phase 7)**: Depends on US1–US3 as implemented

### User Story Dependencies

| Story | Priority | Depends on | Delivers |
|-------|----------|------------|----------|
| US2 | P2 | Foundational | CI gate (lint, test, build) |
| US1 | P1 | US2 | Auto deploy + smoke |
| US4 | P2 | US1 | Secrets hardening + docs |
| US3 | P3 | US1 | Manual workflow_dispatch |

### Within Each User Story

- Tests MUST be written first and FAIL before implementation
- US2 before US1 (technical); MVP checkpoint after Phase 4

### Parallel Opportunities

- Phase 1: T002, T003, T004 parallel
- Phase 2: T006, T007, T008, T009 parallel after T005
- US2 tests T011–T013 parallel
- US1 tests T019–T021 parallel
- US4 tests T030–T031 parallel
- US4 impl T032, T035 parallel
- US3 test T037 parallel with US3 impl start after US1

---

## Parallel Example: User Story 2

```bash
# Tests together:
Task T011: ci.yml jobs structure in tests/integration/ci-workflows.test.ts
Task T012: postgres service in tests/integration/ci-workflows.test.ts
Task T013: triggers in tests/integration/ci-workflows.test.ts

# After T014–T016 sequential, T017–T018 can overlap review
```

---

## Parallel Example: User Story 1

```bash
# Tests together:
Task T019: step order in tests/unit/deploy/stagingRemoteScript.test.ts
Task T020: abort behavior in tests/unit/deploy/stagingRemoteScript.test.ts
Task T021: deploy-staging triggers in tests/integration/ci-workflows.test.ts

# After T022:
Task T028: GitHub environment config (parallel to T029 SSH host key)
```

---

## Implementation Strategy

### MVP First (US1 + US2)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: US2 — CI gate
4. Complete Phase 4: US1 — auto deploy + smoke
5. **STOP and VALIDATE**: push to main → staging updated (SC-001)

### Incremental Delivery

1. Setup + Foundational → infrastructure ready
2. US2 → CI on every PR/push
3. US1 → auto deploy (MVP!)
4. US4 → secrets audit + README
5. US3 → manual redeploy
6. Polish → quickstart validation on VPS

### Parallel Team Strategy

1. Team completes Setup + Foundational together
2. Developer A: US2 (ci.yml)
3. After US2: Developer A: US1 deploy; Developer B: US4 docs + secret tests
4. Developer B: US3 workflow_dispatch after US1 merge

---

## Notes

- E2E Playwright **не** входит в CI gate v1 (spec Out of Scope)
- Production deploy и CDN — отдельная фича
- SEO/PageSpeed/локализация UI — N/A для инфраструктурной фичи
- Первый деплой на VPS — ручная настройка по quickstart.md до первого green workflow
- `[P]` tasks = different files, no incomplete dependencies
- Commit after each phase checkpoint

---

## Task Summary

| Phase | Story | Task IDs | Count |
|-------|-------|----------|-------|
| 1 Setup | — | T001–T004 | 4 |
| 2 Foundational | — | T005–T010 | 6 |
| 3 US2 CI | US2 | T011–T018 | 8 |
| 4 US1 Deploy | US1 | T019–T029 | 11 |
| 5 US4 Secrets | US4 | T030–T036 | 7 |
| 6 US3 Manual | US3 | T037–T041 | 5 |
| 7 Polish | — | T042–T046 | 5 |
| **Total** | | **T001–T046** | **46** |

**MVP scope**: Phase 1–4 (T001–T029) — CI + auto deploy на staging.

**Independent test criteria**:

| Story | Verify |
|-------|--------|
| US1 | Push main → staging shows commit; /ru + /admin OK |
| US2 | Broken test blocks deploy; CI status visible in GitHub |
| US4 | No secrets in repo/logs; docs complete |
| US3 | workflow_dispatch redeploys chosen ref |
