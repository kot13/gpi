# Quickstart: 001-cms-foundation

**Date**: 2026-05-30

## Prerequisites

- Node.js 20 LTS
- Docker (PostgreSQL)
- pnpm 9+

## Initial Setup

```bash
# Clone / enter project root
cd gpi

# Environment
cp .env.example .env
# Set: DATABASE_URI, PAYLOAD_SECRET, NEXT_PUBLIC_SERVER_URL

# PostgreSQL
docker compose up -d postgres

# Install & schema push (accept warnings when prompted)
npm install
npm run db:push

# Seed dev data
# Via admin while dev server runs: GET http://localhost:3000/next/seed
npm run dev
```

**URLs**:
- Public: http://localhost:3000/ru
- Admin: http://localhost:3000/admin

---

## Verify User Stories

### US1 — Pages (P1)

1. Login to `/admin`
2. Create page «О нас» with slug `about`, fill ru/ka/en content
3. Publish
4. Visit `/ru/about`, `/ka/about`, `/en/about`
5. Unpublish → verify 404

**Tests**: `pnpm test:integration -- pages`, `pnpm test:e2e -- pages.spec.ts`

### US2 — Blog (P2)

1. Create category «Ипотека» (ru/ka/en)
2. Create blog post with featured image, without category → publish
3. Create post with category → publish
4. Visit `/ru/blog`, `/ru/blog/{slug}`, `/ru/blog/category/ipoteka`

**Tests**: `pnpm test:e2e -- blog.spec.ts`

### US3 — Header/Footer (P3)

1. Admin → Globals → Header: add nav item + Telegram social link
2. Admin → Globals → Footer: update nav
3. Verify changes on any public page (all locales)

**Tests**: `pnpm test:e2e -- header-footer.spec.ts`

### US4 — Design (P4)

1. Compare `/ru` with https://gpi-realty.ge/ (logo, colors, header layout)
2. Check blog cards styling
3. Responsive: DevTools 320px, 768px, 1920px

**Tests**: `pnpm test:e2e -- responsive.spec.ts`

---

## Test Commands

```bash
pnpm test              # all Vitest
pnpm test:unit         # unit only
pnpm test:integration  # Payload collections
pnpm test:e2e          # Playwright (3 locales × 3 viewports)
pnpm test:coverage     # coverage report (target: 100% new code)
```

---

## PageSpeed Check

```bash
pnpm build
pnpm start
# Run Lighthouse CI or manual PSI on:
# - http://localhost:3000/ru
# - http://localhost:3000/ru/blog
# Target: ≥ 90 mobile & desktop
```

---

## Key Files (after implement)

| Path | Purpose |
|------|---------|
| `src/payload.config.ts` | CMS config, localization |
| `src/collections/Pages.ts` | Pages collection |
| `src/collections/BlogPosts.ts` | Blog posts |
| `src/globals/Header.ts` | Header settings |
| `src/components/layout/Header.tsx` | Public header |
| `src/lib/seo/metadata.ts` | generateMetadata helpers |
| `src/hooks/revalidateFrontend.ts` | ISR revalidation |

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| DB connection refused | `docker compose up -d postgres` |
| Slug duplicate error | Change slug or locale |
| Publish blocked | Fill all ru/ka/en fields + featuredImage for blog |
| Stale content after publish | Check revalidateFrontend hook logs |
