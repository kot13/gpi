import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { GPI_CSS_VARS } from '@/lib/design/tokens'

describe('GPI design tokens', () => {
  const css = readFileSync(resolve(process.cwd(), 'src/app/(frontend)/globals.css'), 'utf8')

  it.each(GPI_CSS_VARS)('defines %s in globals.css', (token) => {
    expect(css).toContain(token)
  })

  it('defines gpi-prose component styles', () => {
    expect(css).toContain('.gpi-prose')
  })
})
