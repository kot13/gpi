# Data Model: 008-staging-cicd

**Date**: 2026-06-07  
**Feature**: CI/CD на стейджинг из GitHub

Фича **не добавляет** сущностей в PayloadCMS и PostgreSQL. Ниже — логические сущности инфраструктуры CI/CD.

## Pipeline Run (Запуск пайплайна)

Единичное выполнение workflow в GitHub Actions.

| Поле | Тип | Описание |
|------|-----|----------|
| `id` | string | GitHub run id |
| `workflow` | enum | `ci` \| `deploy-staging` |
| `trigger` | enum | `push` \| `pull_request` \| `workflow_dispatch` |
| `branch` | string | Ref (например `main`) |
| `commitSha` | string | Git SHA деплоя |
| `status` | enum | `queued` \| `in_progress` \| `success` \| `failure` \| `cancelled` |
| `startedAt` | datetime | ISO 8601 |
| `finishedAt` | datetime | ISO 8601 |
| `actor` | string | GitHub user (manual) или `github-actions[bot]` |

### Этапы (jobs)

| Job | Workflow | Условие успеха |
|-----|----------|----------------|
| `lint` | ci | exit 0 eslint |
| `test-unit` | ci | vitest unit green |
| `test-integration` | ci | vitest integration green |
| `build` | ci | `next build` + postbuild sitemap |
| `deploy` | deploy-staging | SSH script exit 0 + smoke HTTP 200 |

**Переходы состояния deploy-staging**:

```text
trigger → ci checks → deploy (SSH) → smoke → success
                    ↘ failure (staging unchanged if deploy not started)
deploy → db:push fail → failure (no pm2 reload)
deploy → build fail → failure (no pm2 reload)
deploy → pm2 reload → smoke fail → failure (new version may be running — manual fix)
```

## Staging Server (Стейджинг-сервер)

| Поле | Тип | Описание |
|------|-----|----------|
| `host` | string | IP или hostname (secret) |
| `os` | string | Ubuntu 22.04 LTS |
| `appPath` | path | Корень git clone (secret `STAGING_APP_PATH`) |
| `deployUser` | string | SSH user (secret) |
| `nodeVersion` | string | 20.x |
| `processManager` | enum | `pm2` |
| `processName` | string | `gpi-staging` |
| `publicUrl` | url | Staging domain в `.env` |

**Инварианты**:
- Docker не используется
- `.env` на сервере не перезаписывается автоматическим деплоем
- `media/` и uploads сохраняются между деплоями (не в git)

## Environment Secret (Секрет окружения)

| Поле | Тип | Хранилище | Пример имени |
|------|-----|-----------|--------------|
| `name` | string | GitHub Secret / server `.env` | `DATABASE_URI` |
| `scope` | enum | `github-ci` \| `github-deploy` \| `server-runtime` | |
| `rotatable` | boolean | true | |
| `logged` | boolean | MUST be false in CI logs | |

### Inventory (см. contracts/github-secrets.md)

**GitHub Secrets** (минимум): SSH credentials, app path, CI build secrets.

**Server `.env`** (минимум): `DATABASE_URI`, `PAYLOAD_SECRET`, `NEXT_PUBLIC_SERVER_URL`.

## Deploy Artifact (Состояние деплоя на сервере)

Не файловый tarball — **git working tree** на заданном SHA.

| Поле | Тип | Описание |
|------|-----|----------|
| `commitSha` | string | Текущий `HEAD` после deploy |
| `builtAt` | datetime | Timestamp последнего успешного `npm run build` |
| `pm2Status` | enum | `online` \| `stopped` \| `errored` |
| `lastDeployRunId` | string | GitHub run id (записывается в `deploy.log` на сервере) |

### Deploy log (файл на сервере)

Путь: `$STAGING_APP_PATH/logs/deploy.log` (append-only)

```text
2026-06-07T12:00:00Z run=123456789 sha=abc1234 status=success duration=420s
```

## Concurrency Lock

| Поле | Значение |
|------|----------|
| `group` | `staging-deploy` |
| `cancelInProgress` | `false` (очередь, FR-011) |

## Validation Rules

| Правило | FR |
|---------|-----|
| Deploy только если все CI jobs success | FR-002, FR-003 |
| Deploy только из workflow `deploy-staging` на `main` (auto) | FR-001 |
| Manual deploy — любая ref через `workflow_dispatch` input | FR-006 |
| Secrets не echo в scripts | FR-007 |
| `NEXT_PUBLIC_SERVER_URL` set before server-side build | FR-008 |
| `db:push` before build on server | FR-009 |

## Relationships

```text
GitHub Repo (main)
    │ push / workflow_dispatch
    ▼
Pipeline Run (deploy-staging)
    │ SSH
    ▼
Staging Server
    ├── .env (Environment Secrets runtime)
    ├── git tree @ commitSha
    ├── PostgreSQL (schema via db:push)
    └── PM2 process → Next.js :3000 → nginx → public URL
```
