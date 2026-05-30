import React from 'react'

import type { Post } from '@/payload-types'

import RichText from '@/components/RichText'
import { Media } from '@/components/Media'
import Link from 'next/link'

type Props = {
  post: Post
  locale: string
}

export function BlogPostView({ post, locale }: Props) {
  const categoryTitle =
    post.category && typeof post.category === 'object' ? post.category.title : null

  return (
    <article className="container py-12 max-w-3xl mx-auto">
      {post.heroImage && typeof post.heroImage === 'object' && (
        <div className="relative w-full aspect-video mb-8 rounded-lg overflow-hidden">
          <Media
            resource={post.heroImage}
            fill
            priority
            imgClassName="object-cover"
            size="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 768px"
          />
        </div>
      )}

      {categoryTitle && post.category && typeof post.category === 'object' && (
        <Link
          href={`/${locale}/blog/category/${post.category.slug}`}
          className="text-sm uppercase text-gpi-accent hover:underline mb-2 inline-block"
        >
          {categoryTitle}
        </Link>
      )}

      <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">{post.title}</h1>

      {post.description && <p className="text-lg text-gpi-muted mb-8">{post.description}</p>}

      <div className="prose prose-invert max-w-none gpi-prose">
        <RichText data={post.content} enableGutter={false} />
      </div>
    </article>
  )
}
