import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher'

vi.mock('next/navigation', () => ({
  usePathname: () => '/ru/blog',
}))

describe('LanguageSwitcher', () => {
  it('highlights active locale', () => {
    render(<LanguageSwitcher />)
    const ru = screen.getByRole('link', { name: 'RU' })
    expect(ru).toHaveAttribute('aria-current', 'page')
    expect(ru.className).toContain('text-gpi-brand')
  })

  it('renders all three locales', () => {
    render(<LanguageSwitcher />)
    expect(screen.getByRole('link', { name: 'RU' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'KA' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'EN' })).toBeInTheDocument()
  })
})
