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
}

export function BlogList({ posts, locale = 'ru', page, totalPages, className }: Props) {
  return (
    <div className={cn('container', className)}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post, index) => (
          <BlogCard key={post.slug ?? index} doc={post} locale={locale} showCategories className="h-full" />
        ))}
      </div>
      {page && totalPages && totalPages > 1 && (
        <div className="mt-10">
          <Pagination page={page} totalPages={totalPages} />
        </div>
      )}
    </div>
  )
}
