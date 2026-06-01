'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import React, { useCallback, useState } from 'react'

import { Media } from '@/components/Media'
import type { Locale } from '@/lib/i18n/config'
import { getMessages } from '@/lib/i18n/getMessages'
import { resolvePropertyImage } from '@/lib/properties/media'
import type { PropertyPhoto } from '@/lib/properties/types'
import { cn } from '@/utilities/ui'

type Props = {
  photos?: PropertyPhoto[] | null
  title: string
  locale: Locale
}

const navButtonClass =
  'inline-flex items-center justify-center min-h-11 min-w-11 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gpi-brand'

export function PropertyGallery({ photos, title, locale }: Props) {
  const t = getMessages(locale)
  const p = t.properties
  const resolved = (photos ?? [])
    .map((ph) => resolvePropertyImage(ph.image))
    .filter((img): img is NonNullable<typeof img> => Boolean(img))

  const [active, setActive] = useState(0)
  const current = resolved[active]
  const canNavigate = resolved.length > 1

  const goPrev = useCallback(() => {
    setActive((i) => (i === 0 ? resolved.length - 1 : i - 1))
  }, [resolved.length])

  const goNext = useCallback(() => {
    setActive((i) => (i === resolved.length - 1 ? 0 : i + 1))
  }, [resolved.length])

  if (!resolved.length) {
    return (
      <div className="aspect-[16/10] rounded-lg bg-gpi-border flex items-center justify-center text-gpi-muted">
        {p?.noPhoto}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="relative aspect-[16/10] rounded-lg overflow-hidden bg-gpi-border group">
        {current && (
          <Media
            resource={current}
            fill
            priority={active === 0}
            imgClassName="object-cover"
            size="(max-width: 1024px) 100vw, 900px"
          />
        )}
        {canNavigate && (
          <>
            <button
              type="button"
              className={cn(navButtonClass, 'absolute left-3 top-1/2 -translate-y-1/2 z-10')}
              onClick={goPrev}
              aria-label={p?.galleryPrev ?? 'Previous'}
            >
              <ChevronLeft aria-hidden className="h-5 w-5" />
            </button>
            <button
              type="button"
              className={cn(navButtonClass, 'absolute right-3 top-1/2 -translate-y-1/2 z-10')}
              onClick={goNext}
              aria-label={p?.galleryNext ?? 'Next'}
            >
              <ChevronRight aria-hidden className="h-5 w-5" />
            </button>
          </>
        )}
      </div>
      {canNavigate && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {resolved.map((img, index) => (
            <button
              key={`${img.id ?? 'photo'}-${index}`}
              type="button"
              className={cn(
                'relative shrink-0 w-20 h-14 rounded border-2 overflow-hidden min-w-[44px] min-h-[44px]',
                index === active ? 'border-gpi-brand' : 'border-transparent',
              )}
              onClick={() => setActive(index)}
              aria-label={`${title} ${index + 1}`}
              aria-current={index === active ? 'true' : undefined}
            >
              <Media resource={img} fill imgClassName="object-cover" size="80px" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
