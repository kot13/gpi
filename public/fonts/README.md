# GPI Fonts

Production site [gpi-realty.ge](https://gpi-realty.ge/) uses **Circe** (body/UI) and **Unbounded** (headings).

Until licensed Circe woff2 files are provided, the app uses **Manrope** (Google Fonts) as a body substitute via `next/font` in `src/app/(frontend)/layout.tsx`.

To switch to Circe:

1. Add `Circe-Regular.woff2`, `Circe-Bold.woff2` to this directory
2. Replace `Manrope` with `localFont` in `layout.tsx` pointing to these files
