import { describe, expect, it } from 'vitest'

import { GPI_CSS_VARS, GPI_TOKENS } from '@/lib/design/tokens'

describe('GPI_TOKENS', () => {
  it('exports brand color matching reference', () => {
    expect(GPI_TOKENS.colors.brand).toBe('#7E2226')
  })

  it('exports CSS var names for globals.css', () => {
    expect(GPI_CSS_VARS).toContain('--color-gpi-brand')
    expect(GPI_CSS_VARS.length).toBeGreaterThanOrEqual(8)
  })

  it('uses 980px burger breakpoint', () => {
    expect(GPI_TOKENS.breakpoints.burgerMax).toBe(980)
  })
})
