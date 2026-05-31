import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { Card } from '@/components/Card'

vi.mock('@/utilities/useClickableCard', () => ({
  default: () => ({ card: { ref: vi.fn() }, link: { ref: vi.fn() } }),
}))

vi.mock('@/components/Media', () => ({
  Media: () => <div data-testid="media" />,
}))

describe('BlogCard (Card)', () => {
  it('renders title and description', () => {
    render(
      <Card
        doc={{
          slug: 'test-post',
          title: 'Test Post Title',
          description: 'Short description for the card.',
          heroImage: null,
          category: null,
          meta: null,
        }}
        locale="ru"
        showCategories
      />,
    )
    expect(screen.getByText('Test Post Title')).toBeInTheDocument()
    expect(screen.getByText('Short description for the card.')).toBeInTheDocument()
    expect(screen.getByRole('link')).toHaveAttribute('href', '/ru/blog/test-post')
  })
})
