# Contract: GitHub Workflows

**Feature**: 008-staging-cicd  
**Date**: 2026-06-07

## Files

| File | Purpose |
|------|---------|
| `.github/workflows/ci.yml` | Quality gate на PR и push |
| `.github/workflows/deploy-staging.yml` | Деплой на стейджинг-VPS |

---

## `ci.yml`

### Triggers

```yaml
on:
  push:
    branches: ['**']
  pull_request:
    branches: [main]
```

### Permissions

```yaml
permissions:
  contents: read
```

### Jobs (sequential chain)

| Job ID | Steps (summary) | Timeout |
|--------|-----------------|---------|
| `lint` | checkout → setup-node 20 → npm ci → npm run lint | 10 min |
| `test-unit` | needs: lint → npm run test:unit | 10 min |
| `test-integration` | needs: test-unit → npm run test:integration | 15 min |
| `build` | needs: test-integration → service postgres:16 → npm run build | 20 min |

### Build job — service container

```yaml
services:
  postgres:
    image: postgres:16
    env:
      POSTGRES_USER: gpi
      POSTGRES_PASSWORD: gpi
      POSTGRES_DB: gpi
    ports:
      - 5432:5432
    options: >-
      --health-cmd "pg_isready -U gpi"
      --health-interval 10s
      --health-timeout 5s
      --health-retries 5
```

### Build job — env (CI only, not staging secrets)

| Variable | Value |
|----------|-------|
| `DATABASE_URI` | `postgresql://gpi:gpi@localhost:5432/gpi` |
| `PAYLOAD_SECRET` | `${{ secrets.CI_PAYLOAD_SECRET }}` (min 32 chars) |
| `NEXT_PUBLIC_SERVER_URL` | `http://localhost:3000` |
| `NODE_ENV` | `production` |

### Outputs

Job `build` success = код готов к деплою (FR-002).

---

## `deploy-staging.yml`

### Triggers

```yaml
on:
  push:
    branches: [main]
  workflow_dispatch:
    inputs:
      ref:
        description: 'Git ref to deploy (branch, tag, or SHA)'
        required: false
        default: 'main'
```

### Concurrency

```yaml
concurrency:
  group: staging-deploy
  cancel-in-progress: false
```

### Environment (optional GitHub Environment)

```yaml
environment:
  name: staging
  url: ${{ vars.STAGING_PUBLIC_URL }}
```

`STAGING_PUBLIC_URL` — repository variable (не secret), для ссылки в UI GitHub.

### Jobs

| Job ID | needs | Description |
|--------|-------|-------------|
| `ci` | — | Reuse: same steps as ci.yml **или** `workflow_call` / duplicate minimal gate |
| `deploy` | `ci` | SSH deploy + smoke |

**MVP approach**: deploy workflow includes inline `ci` job (duplicate) OR uses `workflow_run` — **recommended: single workflow with reusable workflow** `ci.yml` callable:

```yaml
# deploy-staging.yml
jobs:
  ci:
    uses: ./.github/workflows/ci.yml
  deploy:
    needs: ci
    if: github.ref == 'refs/heads/main' || github.event_name == 'workflow_dispatch'
```

If reusable workflow complexity is high for MVP — duplicate ci jobs in deploy workflow (document in tasks).

### Deploy job steps

1. `actions/checkout@v4` with `ref: ${{ inputs.ref || github.sha }}`
2. Setup SSH agent with `STAGING_SSH_PRIVATE_KEY`
3. Add host to `known_hosts` (pin fingerprint)
4. SCP `scripts/deploy/staging-remote.sh` to server (or script already in repo on server after git pull — **script runs after pull on server**)
5. SSH execute:
   ```bash
   cd "$STAGING_APP_PATH" && bash scripts/deploy/staging-remote.sh \
     --commit "${{ github.sha }}" \
     --run-id "${{ github.run_id }}"
   ```
6. Smoke check from runner:
   ```bash
   curl -fsS -o /dev/null -w "%{http_code}" "$STAGING_PUBLIC_URL/ru"
   curl -fsS -o /dev/null -w "%{http_code}" "$STAGING_PUBLIC_URL/admin"
   ```
   Expect 200 or 302 for admin.

### Failure behavior

| Step failed | Staging state |
|-------------|---------------|
| ci jobs | No deploy started (FR-003) |
| git pull | Previous version running |
| npm ci / db:push / build | Script exits before pm2 reload |
| pm2 reload | Script fails; may need manual pm2 status |
| smoke | Job fails; team notified via GitHub |

### Status visibility (FR-010)

Each job name MUST be descriptive: `lint`, `test-unit`, `test-integration`, `build`, `deploy-staging`, `smoke-check`.

---

## Reusable workflow (optional enhancement)

`ci.yml` exports:

```yaml
on:
  workflow_call:
```

Called from `deploy-staging.yml` to avoid duplication — target for tasks phase.

---

## Branch protection (manual GitHub settings)

Recommended (document in quickstart, not enforced by repo file):

- `main` requires status checks: `lint`, `test-unit`, `test-integration`, `build`
- Require PR before merge (team policy)

---

## Version pins

| Action | Version |
|--------|---------|
| `actions/checkout` | v4 |
| `actions/setup-node` | v4 |
| SSH | native `webfactory/ssh-agent@v0.9.0` OR `appleboy/ssh-action@v1.2.0` |

Exact pins fixed in implementation tasks.
