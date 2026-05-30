# Coverage Exceptions — 001-cms-foundation

**Date**: 2026-05-30

Constitution requires full test coverage. The following paths are excluded from the 100% target with rationale:

| Path / area | Reason |
|-------------|--------|
| `src/app/(payload)/admin/**` | Payload auto-generated admin UI |
| `src/payload-types.ts` | Auto-generated types |
| `src/endpoints/seed/**` | Dev-only seed scripts; validated via manual `/next/seed` |
| `src/components/RichText/**` | Lexical renderer from Payload template; covered by E2E |
| `src/blocks/**` | CMS block components; covered by E2E page renders |
| `src/heros/**` | Template hero variants; partial E2E coverage |
| PageSpeed ≥ 90 (T081) | Requires production build + Lighthouse; validated manually per quickstart.md |

## Measured coverage (GPI-owned code)

Run: `npm run test:coverage`

Target: 100% of **non-excluded** modules under:

- `src/hooks/**`
- `src/lib/**`
- `src/components/layout/**`
- `src/components/blog/**`
- `src/components/pages/**`
- `src/components/ui/SocialLinks.tsx`

Integration + E2E tests cover Payload collections, globals, and public routes.
