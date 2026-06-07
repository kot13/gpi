#!/usr/bin/env bash
# Deploy GPI to staging VPS — run on server via SSH from GitHub Actions.
set -euo pipefail

COMMIT_SHA=""
RUN_ID=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --commit)
      COMMIT_SHA="$2"
      shift 2
      ;;
    --run-id)
      RUN_ID="$2"
      shift 2
      ;;
    *)
      echo "Unknown argument: $1" >&2
      exit 1
      ;;
  esac
done

if [[ -z "$COMMIT_SHA" || -z "$RUN_ID" ]]; then
  echo "Usage: staging-remote.sh --commit SHA --run-id ID" >&2
  exit 2
fi

STAGING_APP_PATH="${STAGING_APP_PATH:-$(pwd)}"

for cmd in node npm pm2 git; do
  if ! command -v "$cmd" >/dev/null 2>&1; then
    echo "Missing required command: $cmd" >&2
    exit 2
  fi
done

cd "$STAGING_APP_PATH"

git fetch origin main
git reset --hard "$COMMIT_SHA"

npm ci

if [[ ! -f .env ]]; then
  echo "Missing .env in ${STAGING_APP_PATH}" >&2
  exit 2
fi

set -a
# shellcheck disable=SC1091
source .env
set +a

npm run db:push
npm run build

if pm2 describe gpi-staging >/dev/null 2>&1; then
  pm2 reload gpi-staging --update-env
else
  pm2 start ecosystem.config.cjs
fi

mkdir -p logs
echo "$(date -u +%Y-%m-%dT%H:%M:%SZ) run=${RUN_ID} sha=${COMMIT_SHA} status=success" >> logs/deploy.log
