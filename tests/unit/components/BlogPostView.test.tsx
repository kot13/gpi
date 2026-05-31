import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { BlogPostView } from '@/components/blog/BlogPostView'

vi.mock('@/components/RichText', () => ({
  default: () => <div data-testid="richtext">Content</div>,
}))

vi.mock('@/components/Media', () => ({
  Media: () => <div data-testid="hero-media" />,
}))

vi.mock('@/components/blog/BlogPostCTA', () => ({
  BlogPostCTA: () => <div data-testid="blog-cta">CTA</div>,
}))

describe('BlogPostView', () => {
  it('renders title, date and category', () => {
    render(
      <BlogPostView
        locale="ru"
        post={{
          id: 1,
          title: 'Green Side in Gonio',
          description: 'Lead paragraph',
          slug: 'green-side',
          publishedAt: '2026-04-28T19:15:00.000Z',
          heroImage: { id: 1, url: '/media.jpg', alt: 'Hero' },
          category: { id: 1, title: 'Проекты', slug: 'projects' },
          content: {},
          createdAt: '',
          updatedAt: '',
        }}
        socialLinks={[]}
      />,
    )

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Green Side in Gonio')
    expect(screen.getByText('Проекты')).toBeInTheDocument()
    expect(screen.getByText('Lead paragraph')).toBeInTheDocument()
    expect(screen.getByTestId('blog-cta')).toBeInTheDocument()
  })
})
