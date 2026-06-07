# Contract: GitHub Secrets & Variables

**Feature**: 008-staging-cicd  
**Date**: 2026-06-07

## GitHub Repository Secrets

MUST be configured in **Settings → Secrets and variables → Actions** before first deploy.

| Secret | Required | Used in | Description |
|--------|----------|---------|-------------|
| `STAGING_SSH_HOST` | ✅ | deploy | IP или hostname VPS |
| `STAGING_SSH_USER` | ✅ | deploy | SSH user (например `deploy`) |
| `STAGING_SSH_PRIVATE_KEY` | ✅ | deploy | Private key Ed25519 (PEM), **без passphrase** для CI |
| `STAGING_SSH_PORT` | ❌ | deploy | Default `22` если не задан |
| `STAGING_APP_PATH` | ✅ | deploy | Абсолютный путь clone (например `/var/www/gpi`) |
| `STAGING_PUBLIC_URL` | ✅ | deploy smoke | `https://staging.gpi-realty.ge` без trailing slash |
| `CI_PAYLOAD_SECRET` | ✅ | ci build | Min 32 chars; только для ephemeral CI DB |

### Security rules (FR-007)

- MUST NOT commit secret values to git
- MUST NOT `echo`, `printenv`, or log secret values in workflow steps
- GitHub Actions automatically masks secrets in logs when referenced as `${{ secrets.* }}`
- Rotate `CI_PAYLOAD_SECRET` independently from staging `PAYLOAD_SECRET`

## GitHub Repository Variables (non-secret)

| Variable | Example | Purpose |
|----------|---------|---------|
| `STAGING_PUBLIC_URL` | `https://staging.example.com` | Link in deployment environment UI (can duplicate secret as var if preferred for URL only) |

**Note**: If URL is not sensitive, prefer **variable** over secret for smoke curl readability in logs.

## Server-side `.env` (NOT in GitHub)

File: `$STAGING_APP_PATH/.env` — created manually once on VPS.

Documented in `.env.staging.example`:

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URI` | ✅ | PostgreSQL connection string (localhost on VPS) |
| `PAYLOAD_SECRET` | ✅ | Min 32 chars; unique staging value |
| `NEXT_PUBLIC_SERVER_URL` | ✅ | Public staging URL (no trailing slash) |
| `PREVIEW_SECRET` | ❌ | Preview drafts |
| `CRON_SECRET` | ❌ | Cron endpoints |

### Rules

- Deploy script MUST NOT overwrite `.env`
- `NEXT_PUBLIC_SERVER_URL` MUST match nginx public URL
- After changing `.env`, run manual `workflow_dispatch` deploy (FR-006)

## SSH Deploy Key (GitHub repo access from VPS)

Separate from SSH deploy secret:

| Item | Location |
|------|----------|
| Deploy key (read-only) | GitHub repo → Settings → Deploy keys |
| Public key | `/home/deploy/.ssh/id_ed25519.pub` on VPS |

Allows `git fetch` on server without personal PAT.

## Initial setup checklist

- [ ] All secrets in table above set in GitHub
- [ ] `.env` on VPS with staging values
- [ ] Deploy user SSH key authorized in `/home/deploy/.ssh/authorized_keys` (public part of `STAGING_SSH_PRIVATE_KEY` pair — **server has public key, GitHub has private**)
- [ ] Deploy key on repo for git pull
- [ ] PM2 process `gpi-staging` configured once

## Audit (SC-006)

After setup:

```bash
# No secrets in repo
git log -p | grep -i 'PAYLOAD_SECRET'  # should be empty

# Workflow logs — values masked
# Manual review of latest deploy run in GitHub Actions UI
```
