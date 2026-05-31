import React from 'react'

import { BlogCard, type BlogCardData } from './BlogCard'
import { Pagination } from '@/components/Pagination'
import { cn } from '@/utilities/ui'

type Props = {
  posts: BlogCardData[]
  locale?: string
  page?: number
  totalPages?: number
  className?: string
  heroTitle?: string
  heroIntro?: string
  heroSubtitle?: string
  readingTime?: string
  emptyMessage?: string
}

export function BlogList({
  posts,
  locale = 'ru',
  page,
  totalPages,
  className,
  heroTitle,
  heroIntro,
  heroSubtitle,
  readingTime,
  emptyMessage,
}: Props) {
  return (
    <div className={cn('pb-16', className)}>
      {(heroTitle || heroIntro) && (
        <section className="container mb-12 md:mb-16">
          {heroTitle && (
            <h1 className="text-3xl md:text-5xl font-bold text-gpi-text mb-4 font-gpi-heading">
              {heroTitle}
            </h1>
          )}
          {heroIntro && <p className="text-lg text-gpi-text mb-2 max-w-2xl">{heroIntro}</p>}
          {heroSubtitle && (
            <p className="text-xl md:text-2xl font-semibold text-gpi-text uppercase tracking-wide mb-4 font-gpi-heading">
              {heroSubtitle}
            </p>
          )}
          {readingTime && <p className="text-sm text-gpi-muted">{readingTime}</p>}
        </section>
      )}

      {posts.length === 0 ? (
        <div className="container py-16 text-center text-gpi-muted">{emptyMessage}</div>
      ) : (
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {posts.map((post, index) => (
              <BlogCard
                key={post.slug ?? index}
                doc={post}
                locale={locale}
                showCategories
                className="h-full"
              />
            ))}
          </div>
        </div>
      )}

      {page && totalPages && totalPages > 1 && (
        <div className="container mt-10">
          <Pagination page={page} totalPages={totalPages} />
        </div>
      )}
    </div>
  )
}
