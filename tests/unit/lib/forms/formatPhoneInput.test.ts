import { describe, expect, it } from 'vitest'

import { formatPhoneInput, getPhoneInputPlaceholder } from '@/lib/forms/formatPhoneInput'

describe('formatPhoneInput', () => {
  it('formats Georgian mobile number as user types', () => {
    expect(formatPhoneInput('5', 'GE')).toBe('5')
    expect(formatPhoneInput('555', 'GE')).toBe('555')
    expect(formatPhoneInput('5551', 'GE')).toBe('555 1')
    expect(formatPhoneInput('555123456', 'GE')).toBe('555 12 34 56')
  })

  it('formats non-mobile prefixes with national template', () => {
    expect(formatPhoneInput('1111', 'GE')).toBe('111 1')
    expect(formatPhoneInput('111111111', 'GE')).toBe('111 11 11 11')
  })

  it('strips non-digits before formatting', () => {
    expect(formatPhoneInput('555-12-34-56', 'GE')).toBe('555 12 34 56')
    expect(formatPhoneInput('111-111-111', 'GE')).toBe('111 11 11 11')
  })

  it('returns empty string for empty input', () => {
    expect(formatPhoneInput('', 'GE')).toBe('')
    expect(formatPhoneInput('---', 'GE')).toBe('')
  })

  it('limits digits to national number length', () => {
    expect(formatPhoneInput('5551234567890', 'GE')).toBe('555 12 34 56')
  })

  it('uses country-specific formatting', () => {
    expect(formatPhoneInput('5551234567', 'US')).toBe('(555) 123-4567')
  })
})

describe('getPhoneInputPlaceholder', () => {
  it('returns masked example format', () => {
    expect(getPhoneInputPlaceholder('GE')).toBe('000 00 00 00')
    expect(getPhoneInputPlaceholder('US')).toBe('(000) 000-0000')
  })

  it('falls back when example is unavailable', () => {
    expect(getPhoneInputPlaceholder('ZZ', '00-000-000')).toBe('00-000-000')
  })
})
