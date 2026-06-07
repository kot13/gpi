# Деплой на стейджинг (GPI)

Runbook для CI/CD фичи **008-staging-cicd**. Контракты: [github-workflows.md](../specs/008-staging-cicd/contracts/github-workflows.md), [github-secrets.md](../specs/008-staging-cicd/contracts/github-secrets.md), [deploy-server.md](../specs/008-staging-cicd/contracts/deploy-server.md).

## Обзор

| Workflow | Файл | Триггер |
|----------|------|---------|
| CI | `.github/workflows/ci.yml` | push (все ветки), PR → `main` |
| Deploy Staging | `.github/workflows/deploy-staging.yml` | push → `main`, `workflow_dispatch` |

Цепочка деплоя: **CI green** → SSH на VPS → `scripts/deploy/staging-remote.sh` → PM2 reload → smoke `/ru`, `/admin`.

## GitHub Secrets (обязательные)

| Secret | Описание |
|--------|----------|
| `STAGING_SSH_HOST` | IP или hostname VPS |
| `STAGING_SSH_USER` | SSH user (например `deploy`) |
| `STAGING_SSH_PRIVATE_KEY` | Приватный ключ Ed25519 (PEM) |
| `STAGING_SSH_PORT` | Опционально, default `22` |
| `STAGING_APP_PATH` | Путь clone, напр. `/var/www/gpi` |
| `CI_PAYLOAD_SECRET` | Min 32 chars — только для CI build job |

## GitHub Variables

| Variable | Описание |
|----------|----------|
| `STAGING_PUBLIC_URL` | `https://staging.example.com` — smoke + Environment URL |

## Серверный `.env`

Создаётся **один раз** на VPS из `.env.staging.example`. Деплой **не перезаписывает** `.env`.

## Branch protection (рекомендации)

Для ветки `main` в GitHub Settings → Branches:

- [ ] Require status checks: `lint`, `test-unit`, `test-integration`, `build`
- [ ] Require pull request before merge (политика команды)

## Ручной деплой

1. GitHub → **Actions** → **Deploy Staging** → **Run workflow**
2. Input `ref`: `main` (default) или commit SHA для rollback
3. Дождаться green `smoke-check`

## Rollback (v1)

1. Найти предыдущий успешный commit SHA в GitHub
2. **Run workflow** с `ref` = этот SHA
3. Альтернатива по SSH:
   ```bash
   cd /var/www/gpi
   bash scripts/deploy/staging-remote.sh --commit <SHA> --run-id manual
   ```

## Smoke после деплоя

```bash
curl -I https://staging.example.com/ru
curl -I https://staging.example.com/admin
tail -f /var/www/gpi/logs/deploy.log
pm2 logs gpi-staging --lines 50
```

## Audit секретов (SC-006)

- Секреты не коммитятся: `.env` в `.gitignore`
- CI logs: GitHub маскирует `${{ secrets.* }}`
- Deploy script не выводит `PAYLOAD_SECRET` / `DATABASE_URI`

## Troubleshooting

| Симптом | Действие |
|---------|----------|
| CI build fail | Проверить `CI_PAYLOAD_SECRET` в Secrets |
| SSH fail | `known_hosts`, firewall :22, ключ в Secrets |
| Missing .env | Создать `.env` на VPS из `.env.staging.example` |
| 502 после deploy | `pm2 status`, nginx → `127.0.0.1:3000` |

Подробная первичная настройка VPS: [quickstart.md](../specs/008-staging-cicd/quickstart.md).
