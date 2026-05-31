import React from 'react'

import type { Post } from '@/payload-types'
import type { Header } from '@/payload-types'

import RichText from '@/components/RichText'
import { Media } from '@/components/Media'
import { BlogPostCTA } from '@/components/blog/BlogPostCTA'
import { formatPostDate } from '@/lib/i18n/formatDate'
import type { Locale } from '@/lib/i18n/config'
import Link from 'next/link'

type Props = {
  post: Post
  locale: Locale
  socialLinks?: Header['socialLinks']
}

export function BlogPostView({ post, locale, socialLinks }: Props) {
  const categoryTitle =
    post.category && typeof post.category === 'object' ? post.category.title : null

  const publishedLabel = formatPostDate(post.publishedAt, locale)

  return (
    <article>
      {categoryTitle && post.category && typeof post.category === 'object' && (
        <Link
          href={`/${locale}/blog/category/${post.category.slug}`}
          className="text-xs uppercase tracking-wide text-gpi-brand hover:underline mb-3 inline-block font-semibold"
        >
          {categoryTitle}
        </Link>
      )}

      <h1 className="text-3xl md:text-5xl font-bold text-gpi-text mb-4 font-gpi-heading leading-tight">
        {post.title}
      </h1>

      {publishedLabel && (
        <time
          dateTime={post.publishedAt ?? undefined}
          className="block text-sm text-gpi-muted mb-6"
        >
          {publishedLabel}
        </time>
      )}

      {post.description && (
        <p className="text-lg text-gpi-text mb-8 leading-relaxed">{post.description}</p>
      )}

      {post.heroImage && typeof post.heroImage === 'object' ? (
        <div className="relative w-full aspect-[16/9] mb-10 rounded-[var(--radius-card)] overflow-hidden bg-gpi-bg-secondary">
          <Media
            resource={post.heroImage}
            fill
            priority
            imgClassName="object-cover"
            size="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 768px"
          />
        </div>
      ) : (
        <div
          className="w-full aspect-[16/9] mb-10 rounded-[var(--radius-card)] bg-gpi-bg-secondary border border-gpi-border"
          aria-hidden
        />
      )}

      <div className="gpi-prose">
        <RichText data={post.content} enableGutter={false} enableProse={false} />
      </div>

      <BlogPostCTA locale={locale} socialLinks={socialLinks} />
    </article>
  )
}
