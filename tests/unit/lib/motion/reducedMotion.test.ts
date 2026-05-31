import { describe, expect, it, vi, afterEach } from 'vitest'

import { readReducedMotionPreference } from '@/lib/motion/reducedMotion'

describe('readReducedMotionPreference', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('returns true when prefers-reduced-motion matches', () => {
    vi.stubGlobal(
      'matchMedia',
      vi.fn(() => ({
        matches: true,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
    )

    expect(readReducedMotionPreference()).toBe(true)
  })

  it('returns false when prefers-reduced-motion does not match', () => {
    vi.stubGlobal(
      'matchMedia',
      vi.fn(() => ({
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
    )

    expect(readReducedMotionPreference()).toBe(false)
  })
})
