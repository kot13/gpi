import { describe, expect, it } from 'vitest'

import { formatContactDisplay, validateContact, validateName } from '@/lib/forms/validateContact'

describe('validateName', () => {
  it('requires non-empty name', () => {
    expect(validateName('').valid).toBe(false)
    expect(validateName('  ').valid).toBe(false)
  })

  it('accepts valid name', () => {
    expect(validateName('Anna').valid).toBe(true)
  })
})

describe('validateContact', () => {
  it('validates Georgian phone', () => {
    const result = validateContact('phone', '555123456', 'GE')
    expect(result.valid).toBe(true)
  })

  it('rejects invalid phone', () => {
    const result = validateContact('phone', '12', 'GE')
    expect(result.valid).toBe(false)
  })

  it('validates telegram username', () => {
    expect(validateContact('telegram', '@gpi_user', '').valid).toBe(true)
  })

  it('validates vk id', () => {
    expect(validateContact('vk', 'gpi_realty', '').valid).toBe(true)
  })
})

describe('formatContactDisplay', () => {
  it('formats phone with dial code', () => {
    const display = formatContactDisplay('phone', '555123456', 'GE', '+995')
    expect(display).toMatch(/\+995/)
  })
})
