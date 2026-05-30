import { describe, expect, it } from 'vitest'
import { slugify } from '@/hooks/slugify'

describe('slugify', () => {
  it('lowercases and hyphenates', () => {
    expect(slugify('About Us')).toBe('about-us')
  })

  it('removes special characters', () => {
    expect(slugify('Hello! World?')).toBe('hello-world')
  })

  it('trims leading and trailing hyphens', () => {
    expect(slugify('  test  ')).toBe('test')
  })
})
