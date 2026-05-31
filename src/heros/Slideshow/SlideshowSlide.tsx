'use client'

import React from 'react'

import { Media } from '@/components/Media'
import type { Media as MediaType } from '@/payload-types'

import type { SlideshowSlideFields } from '@/hooks/validateSlideshowHero'

export type SlideshowSlideData = SlideshowSlideFields & {
  id?: string | null
  image: number | MediaType
}

type SlideshowSlideProps = {
  slide: SlideshowSlideData
  isActive: boolean
  isPrioritizedImage: boolean
}

export const SlideshowSlide: React.FC<SlideshowSlideProps> = ({
  slide,
  isActive,
  isPrioritizedImage,
}) => {
  const { image, title } = slide
  const mediaResource = typeof image === 'object' ? image : null

  return (
    <div
      className="relative min-h-[50vh] md:min-h-[70vh] flex-[0_0_100%] min-w-0"
      aria-hidden={!isActive}
    >
      <div className="absolute inset-0 select-none">
        {mediaResource && (
          <Media
            fill
            imgClassName="object-cover"
            loading={isPrioritizedImage ? undefined : 'lazy'}
            priority={isPrioritizedImage}
            resource={mediaResource}
            alt={title ?? ''}
          />
        )}
      </div>
    </div>
  )
}
