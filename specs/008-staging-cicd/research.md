# Research: 008-staging-cicd

**Date**: 2026-06-07

## 1. Где выполнять сборку Next.js + Payload

**Decision**: **Двухэтапная модель** — (A) CI на GitHub Actions выполняет `npm run build` с **ephemeral PostgreSQL service container** для gate FR-002/FR-003; (B) финальная сборка на **стейджинг-VPS** в `staging-remote.sh` с локальной БД и серверным `.env`.

**Rationale**: `next build` для GPI обращается к PostgreSQL (SSG/ISR, Payload). Открывать staging PostgreSQL для GitHub Actions IP — риск безопасности. Сборка только на runner без проверки на CI нарушает FR-003. Ephemeral PG в CI (postgres:16) + минимальные env (`DATABASE_URI`, `PAYLOAD_SECRET`, `NEXT_PUBLIC_SERVER_URL=http://localhost:3000`) достаточны для валидации сборки.

**Alternatives considered**:
- **Только build на runner + rsync `.next`** — нужен доступ runner → staging DB или build без данных (некорректный SSG).
- **Только build на сервере без CI build** — сломанный код может пройти тесты, но упасть на build на сервере поздно; отклонено как единственный gate.
- **Docker на VPS** — пользователь явно исключил Docker.

---

## 2. Стратегия доставки кода на VPS

**Decision**: **Git pull на сервере** (`git fetch origin main && git reset --hard origin/main`) в каталоге приложения; deploy-пользователь имеет read-only доступ к репозиторию (deploy key).

**Rationale**: Монорепозиторий Payload+Next требует `src/`, config-файлов, lockfile — git pull проще rsync всего дерева. Версия на сервере = SHA из GitHub (FR-001, traceability).

**Alternatives considered**:
- **rsync tarball с runner** — дублирование build; сложная синхронизация partial tree.
- **GitHub Releases artifact** — лишний шаг; overkill для staging.

**Первый деплой**: ручной `git clone` на сервер + `.env` + PM2 ecosystem; далее только workflow.

---

## 3. Процесс-менеджер и zero-downtime

**Decision**: **PM2** с `pm2 reload gpi-staging --update-env` после успешного build.

**Rationale**: README упоминает PM2/systemd; PM2 даёт graceful reload Node.js без полного downtime; `--update-env` подхватывает изменения `.env`. Spec FR-005.

**Alternatives considered**:
- **systemd restart** — краткий простой; приемлемо, но хуже UX при частых деплоях.
- **Blue-green без Docker** — out of scope v1.

**Ecosystem file**: `ecosystem.config.cjs` в репозитории (не секрет) — `name: gpi-staging`, `script: npm`, `args: run start`, `cwd: /var/www/gpi`.

---

## 4. CI jobs и триггеры

**Decision**: Два workflow:

| Workflow | Trigger | Jobs |
|----------|---------|------|
| `ci.yml` | `push` (all branches), `pull_request` | lint → test:unit → test:integration → build (service: postgres:16) |
| `deploy-staging.yml` | `push` to `main`, `workflow_dispatch` | needs: ci (reuse) или inline same checks → deploy (SSH) |

**Rationale**: FR-001 (push main), FR-006 (manual), FR-011 (`concurrency: group: staging-deploy, cancel-in-progress: false` — queue via `concurrency` with `cancel-in-progress: false` waits).

**Deploy job concurrency**:
```yaml
concurrency:
  group: staging-deploy
  cancel-in-progress: false
```

**Alternatives considered**:
- **Один workflow** — сложнее разделить PR checks и deploy secrets context.
- **Deploy без CI reuse** — дублирование; deploy job `needs: [ci]` on same workflow run.

**E2E**: не в blocking path (spec Out of Scope v1); optional nightly workflow — future.

---

## 5. Секреты и переменные окружения

**Decision**:

| Место | Содержимое |
|-------|------------|
| GitHub Secrets | `STAGING_SSH_HOST`, `STAGING_SSH_USER`, `STAGING_SSH_PRIVATE_KEY`, `STAGING_SSH_PORT` (opt), `STAGING_APP_PATH`, `CI_PAYLOAD_SECRET`, `CI_DATABASE_URI` (для build job) |
| VPS файл `.env` | `DATABASE_URI`, `PAYLOAD_SECRET`, `NEXT_PUBLIC_SERVER_URL`, `PREVIEW_SECRET`, `CRON_SECRET` — реальные staging values |
| Repo | `.env.staging.example` — документация имён без значений |

**Rationale**: FR-007, FR-008; серверный `.env` не перезаписывается деплоем (только код); `NEXT_PUBLIC_SERVER_URL` baked at build time на сервере.

**Alternatives considered**:
- **Передача всего `.env` через GitHub Secret** — сложнее ротация; риск утечки в logs при echo.
- **Heroku-style config plugin** — нет PaaS.

---

## 6. Миграции БД на стейджинге

**Decision**: `npm run db:push` в deploy script **до** `npm run build` (как README для staging).

**Rationale**: FR-009; проект использует Drizzle push для dev/staging; prod migrate — out of scope (production feature).

**Failure handling**: при ошибке `db:push` — abort deploy, PM2 не reload (edge case spec).

**Alternatives considered**:
- **`payload migrate`** — для production; staging использует push по README.
- **Skip db step** — нарушает FR-009 при schema changes.

---

## 7. SSH и безопасность деплоя

**Decision**: Dedicated deploy user `deploy` с:
- SSH key (Ed25519) только в GitHub Secret
- права на `STAGING_APP_PATH`, PM2 от имени deploy
- **без** password auth
- `StrictHostKeyChecking` через `known_hosts` в workflow (secret или fingerprint pin)

**Rationale**: Principle of least privilege; FR-007.

**Deploy command pattern** (workflow):
```yaml
- uses: appleboy/ssh-action@v1
  # or native ssh with webfactory/ssh-agent
```

Research prefers **native OpenSSH** + `ssh-agent` (меньше third-party) или `appleboy/ssh-action` (популярен, стабилен) — зафиксировать в tasks.

---

## 8. Post-deploy smoke check

**Decision**: После PM2 reload — curl из workflow (или SSH remote curl) на:
- `https://staging.example/ru` → 200
- `https://staging.example/admin` → 200 или 302 to login

**Rationale**: SC-005, FR-012; fail deploy job if smoke fails (without auto-rollback — manual redeploy per spec).

**Alternatives considered**:
- **No smoke** — violates SC-005 verifiability.
- **Full E2E Playwright against staging** — slow; v2.

---

## 9. Node.js версия и lockfile

**Decision**: CI и VPS используют **Node 20** (`actions/setup-node@v4`, `node-version: 20`, `cache: npm`); деплой — `npm ci` (не `npm install`).

**Rationale**: README requirement; reproducible builds; constitution lockfile rule.

---

## 10. nginx и SSL

**Decision**: **Out of scope** реализации в репозитории — предполагается уже настроенный reverse proxy на VPS, проксирующий на `localhost:3000` (PM2).

**Rationale**: User input «установлены все зависимости»; spec Out of Scope для системных пакетов.

Документировать в quickstart: origin `127.0.0.1:3000`, SSL termination на nginx.
