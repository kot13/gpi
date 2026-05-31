import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { MobileNav } from '@/components/layout/MobileNav'

vi.mock('@/components/layout/Nav', () => ({
  Nav: () => <nav data-testid="mobile-nav-links">Nav</nav>,
}))

vi.mock('@/components/layout/LanguageSwitcher', () => ({
  LanguageSwitcher: () => <div data-testid="lang-switcher">Lang</div>,
}))

vi.mock('@/components/ui/SocialLinks', () => ({
  SocialLinks: () => <div data-testid="social-links">Social</div>,
}))

describe('MobileNav', () => {
  it('renders nothing when closed', () => {
    const { container } = render(
      <MobileNav isOpen={false} onClose={() => {}} navItems={[]} socialLinks={[]} />,
    )
    expect(container.firstChild).toBeNull()
  })

  it('renders dialog when open', () => {
    render(<MobileNav isOpen={true} onClose={() => {}} navItems={[]} socialLinks={[]} />)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByTestId('mobile-nav-links')).toBeInTheDocument()
  })

  it('calls onClose when backdrop clicked', () => {
    const onClose = vi.fn()
    render(<MobileNav isOpen={true} onClose={onClose} navItems={[]} socialLinks={[]} />)
    fireEvent.click(screen.getByLabelText('Закрыть меню'))
    expect(onClose).toHaveBeenCalled()
  })

  it('calls onClose on Escape', () => {
    const onClose = vi.fn()
    render(<MobileNav isOpen={true} onClose={onClose} navItems={[]} socialLinks={[]} />)
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onClose).toHaveBeenCalled()
  })
})
