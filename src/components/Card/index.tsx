'use client'
import { cn } from '@/utilities/ui'
import useClickableCard from '@/utilities/useClickableCard'
import Link from 'next/link'
import React from 'react'

import type { Post } from '@/payload-types'

import { Media } from '@/components/Media'

export type CardPostData = Pick<Post, 'slug' | 'category' | 'description' | 'heroImage' | 'meta' | 'title'>

export const Card: React.FC<{
  alignItems?: 'center'
  className?: string
  doc?: CardPostData
  relationTo?: 'posts'
  locale?: string
  showCategories?: boolean
  title?: string
}> = (props) => {
  const { card, link } = useClickableCard({})
  const { className, doc, locale = 'ru', showCategories, title: titleFromProps } = props

  const { slug, category, description, heroImage, meta, title } = doc || {}
  const { description: metaDescription, image: metaImage } = meta || {}

  const titleToUse = titleFromProps || title
  const cardDescription = description || metaDescription
  const image = heroImage || metaImage
  const href = `/${locale}/blog/${slug}`

  const categoryTitle =
    category && typeof category === 'object' && category !== null ? category.title : null

  return (
    <article
      className={cn(
        'gpi-blog-card group border border-gpi-border rounded-[var(--radius-card)] overflow-hidden bg-gpi-bg-secondary hover:border-gpi-brand transition-colors hover:cursor-pointer shadow-sm',
        className,
      )}
      ref={card.ref}
    >
      <div className="relative w-full aspect-[16/10] bg-gpi-border">
        {image && typeof image !== 'string' ? (
          <Media
            resource={image}
            fill
            imgClassName="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            size="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
          />
        ) : (
          <div className="bg-gpi-border h-full w-full" aria-hidden />
        )}
      </div>
      <div className="p-5">
        {showCategories && categoryTitle && (
          <div className="uppercase text-xs tracking-wide mb-2 text-gpi-brand font-semibold">
            {categoryTitle}
          </div>
        )}
        {titleToUse && (
          <h3 className="text-lg font-semibold text-gpi-text mb-2 font-gpi-heading">
            <Link className="hover:text-gpi-brand transition-colors" href={href} ref={link.ref}>
              {titleToUse}
            </Link>
          </h3>
        )}
        {cardDescription && (
          <p className="text-sm text-gpi-muted line-clamp-3 leading-relaxed">
            {cardDescription.replace(/\s/g, ' ')}
          </p>
        )}
      </div>
    </article>
  )
}
