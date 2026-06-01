import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { BlogPostCTA } from '@/components/blog/BlogPostCTA'

describe('BlogPostCTA', () => {
  it('renders messenger links and apply button', () => {
    render(
      <BlogPostCTA
        locale="ru"
        socialLinks={[
          { platform: 'whatsapp', url: 'https://wa.me/123' },
          { platform: 'telegram', url: 'https://t.me/gpi' },
        ]}
      />,
    )

    expect(screen.getByRole('link', { name: 'WhatsApp' })).toHaveAttribute('href', 'https://wa.me/123')
    expect(screen.getByRole('link', { name: 'Telegram' })).toHaveAttribute('href', 'https://t.me/gpi')
    expect(screen.getByRole('link', { name: 'Оставить заявку' })).toHaveAttribute('href', '/ru/contacts')
  })
})
