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
        'gpi-blog-card border border-gpi-border rounded-lg overflow-hidden bg-gpi-bg-secondary hover:border-gpi-accent transition-colors hover:cursor-pointer',
        className,
      )}
      ref={card.ref}
    >
      <div className="relative w-full aspect-video">
        {image && typeof image !== 'string' ? (
          <Media
            resource={image}
            fill
            imgClassName="object-cover"
            size="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
          />
        ) : (
          <div className="bg-gpi-border h-full w-full" />
        )}
      </div>
      <div className="p-4">
        {showCategories && categoryTitle && (
          <div className="uppercase text-sm mb-2 text-gpi-accent">{categoryTitle}</div>
        )}
        {titleToUse && (
          <h3 className="text-lg font-semibold text-white mb-2">
            <Link className="hover:text-gpi-accent" href={href} ref={link.ref}>
              {titleToUse}
            </Link>
          </h3>
        )}
        {cardDescription && (
          <p className="text-sm text-gpi-muted line-clamp-3">{cardDescription.replace(/\s/g, ' ')}</p>
        )}
      </div>
    </article>
  )
}
