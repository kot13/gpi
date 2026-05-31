import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

describe('GPI typography', () => {
  it('defines gpi-prose with heading and link styles', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/app/(frontend)/globals.css'), 'utf8')
    expect(css).toContain('.gpi-prose')
    expect(css).toContain('text-gpi-brand')
    expect(css).toContain('--font-gpi-heading')
    expect(css).toContain('--font-gpi-body')
  })
})
