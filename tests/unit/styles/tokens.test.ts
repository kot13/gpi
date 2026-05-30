import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

describe('GPI design tokens', () => {
  it('defines GPI CSS custom properties in globals.css', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/app/(frontend)/globals.css'), 'utf8')
    expect(css).toContain('--color-gpi-bg')
    expect(css).toContain('--color-gpi-accent')
    expect(css).toContain('--color-gpi-text')
  })
})
