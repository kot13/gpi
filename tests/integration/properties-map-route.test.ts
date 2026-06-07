import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { describe, expect, it } from 'vitest'

const pagePath = resolve(
  process.cwd(),
  'src/app/(frontend)/[locale]/properties/map/page.tsx',
)

describe('properties map route', () => {
  it('exports force-static and revalidate in page module', () => {
    const source = readFileSync(pagePath, 'utf8')
    expect(source).toContain("export const dynamic = 'force-static'")
    expect(source).toContain('export const revalidate = 600')
    expect(source).toContain('generateMetadata')
    expect(source).toContain('generatePropertyMapMeta')
  })
})
