# Quickstart: 008-staging-cicd

**Feature**: CI/CD на стейджинг из GitHub  
**Branch**: `008-staging-cicd`

## Prerequisites

- Репозиторий на GitHub (`kot13/gpi` или fork)
- VPS Ubuntu 22.04 с Node 20, PostgreSQL 16, PM2, nginx
- Права admin на GitHub repo и SSH root/sudo на VPS

## 1. Подготовка VPS (один раз)

```bash
# От пользователя с sudo
adduser deploy
usermod -aG www-data deploy

# Node 20 (если не установлен)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# PM2 от пользователя deploy
sudo -u deploy npm install -g pm2

# PostgreSQL — создать БД и пользователя
sudo -u postgres createuser gpi_staging -P
sudo -u postgres createdb gpi_staging -O gpi_staging
```

### Clone репозитория

```bash
sudo mkdir -p /var/www/gpi
sudo chown deploy:deploy /var/www/gpi
sudo -u deploy git clone git@github.com:kot13/gpi.git /var/www/gpi
cd /var/www/gpi
sudo -u deploy git checkout main
```

### Серверный `.env`

```bash
sudo -u deploy cp .env.staging.example .env
sudo -u deploy nano .env
```

Обязательно задать:

```env
DATABASE_URI=postgresql://gpi_staging:PASSWORD@127.0.0.1:5432/gpi_staging
PAYLOAD_SECRET=<min-32-chars-unique-staging>
NEXT_PUBLIC_SERVER_URL=https://staging.your-domain.com
```

### PM2

```bash
cd /var/www/gpi
sudo -u deploy npm ci
sudo -u deploy npm run db:push
sudo -u deploy npm run build
sudo -u deploy pm2 start ecosystem.config.cjs
sudo -u deploy pm2 save
```

### nginx

Reverse proxy на PM2 (`127.0.0.1:3000`). Замените `staging.your-domain.com` на ваш домен — он же должен быть в `NEXT_PUBLIC_SERVER_URL`.

**Установка** (если nginx ещё не установлен):

```bash
sudo apt-get update
sudo apt-get install -y nginx
```

**Конфиг** `/etc/nginx/sites-available/gpi-staging`:

```nginx
# Редirect HTTP → HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name staging.your-domain.com;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 301 https://$host$request_uri;
    }
}

# HTTPS → Next.js + Payload (PM2 на :3000)
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name staging.your-domain.com;

    # Certbot подставит пути после certonly/certbot --nginx
    ssl_certificate     /etc/letsencrypt/live/staging.your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/staging.your-domain.com/privkey.pem;
    include             /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam         /etc/letsencrypt/ssl-dhparams.pem;

    client_max_body_size 50M;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_read_timeout 86400;
    }
}
```

**Активация и SSL**:

```bash
sudo mkdir -p /var/www/certbot
sudo ln -sf /etc/nginx/sites-available/gpi-staging /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

# Let's Encrypt (email замените на свой)
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d staging.your-domain.com
```

После выдачи сертификата certbot обновит блок `ssl_certificate` в конфиге. Проверка:

```bash
curl -I https://staging.your-domain.com/ru
curl -I https://staging.your-domain.com/admin
```

> **Важно**: `/admin` и `/api/*` проксируются на origin без CDN-кеша (см. README). На стейджинге CDN обычно не используется.

## 2. GitHub Secrets & Variables

Settings → Secrets and variables → Actions

| Secret / Variable | Значение |
|-------------------|----------|
| `STAGING_SSH_HOST` | IP VPS |
| `STAGING_SSH_USER` | `deploy` |
| `STAGING_SSH_PRIVATE_KEY` | Приватный ключ (pair для authorized_keys) |
| `STAGING_APP_PATH` | `/var/www/gpi` |
| `CI_PAYLOAD_SECRET` | Строка ≥32 символов для CI build |
| `STAGING_PUBLIC_URL` (Variable) | `https://staging.your-domain.com` |

### SSH ключ для CI

```bash
ssh-keygen -t ed25519 -C "github-actions-staging" -f staging_deploy -N ""
```

- `staging_deploy.pub` → `/home/deploy/.ssh/authorized_keys` на VPS
- `staging_deploy` (private) → GitHub Secret `STAGING_SSH_PRIVATE_KEY`

### Deploy key для git pull на VPS

```bash
ssh-keygen -t ed25519 -f ~/.ssh/id_ed25519 -N ""
cat ~/.ssh/id_ed25519.pub
```

Добавить как **Deploy key (read-only)** в GitHub repo.

## 3. Файлы в репозитории

```text
.github/workflows/ci.yml
.github/workflows/deploy-staging.yml
scripts/deploy/staging-remote.sh
ecosystem.config.cjs
.env.staging.example
docs/deploy-staging.md
tests/unit/deploy/stagingRemoteScript.test.ts
tests/integration/ci-workflows.test.ts
```

## 4. Проверка CI локально

```bash
npm ci
npm run lint
npm run test:unit
npm run test:integration

export DATABASE_URI=postgresql://gpi:gpi@127.0.0.1:5432/gpi
export PAYLOAD_SECRET=local-dev-secret-min-32-characters
export NEXT_PUBLIC_SERVER_URL=http://localhost:3000
npm run build
```

## 5. Проверка деплоя

### Автоматически

```bash
git push origin main
# GitHub Actions → Deploy Staging workflow
```

### Вручную

GitHub → Actions → **Deploy Staging** → Run workflow → input `ref`: `main` или commit SHA

### Smoke checklist

- [ ] `curl -I $STAGING_PUBLIC_URL/ru` → 200
- [ ] `curl -I $STAGING_PUBLIC_URL/admin` → 200 или 302
- [ ] `pm2 status gpi-staging` → online
- [ ] `tail /var/www/gpi/logs/deploy.log` — последняя запись success

## 6. Тесты фичи

```bash
npm run test:unit -- tests/unit/deploy/
npm run test:integration -- tests/integration/ci-workflows.test.ts
```

## 7. Troubleshooting

| Симптом | Действие |
|---------|----------|
| CI build fail — DB | Проверить `CI_PAYLOAD_SECRET` и postgres service в workflow |
| SSH fail | `known_hosts`, firewall port 22, ключ в Secrets |
| build fail on VPS | `pm2 logs`, проверить `.env`, `DATABASE_URI` |
| 502 после deploy | `pm2 status`, nginx proxy_pass :3000 |
| Старый контент | ISR cache — подождать revalidate или restart |

## 8. Документация

- [plan.md](./plan.md)
- [docs/deploy-staging.md](../../docs/deploy-staging.md)
- [contracts/github-workflows.md](./contracts/github-workflows.md)
- [contracts/github-secrets.md](./contracts/github-secrets.md)
- [contracts/deploy-server.md](./contracts/deploy-server.md)
- [README — Деплой на стейджинг](../../README.md#деплой-на-стейджинг)

## Post-merge validation (T046)

После merge в `main` и настройки Secrets выполнить smoke checklist §5 на реальном staging VPS.
