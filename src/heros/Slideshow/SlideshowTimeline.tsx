'use client'

import React from 'react'

import type { Locale } from '@/lib/i18n/config'
import { getMessages } from '@/lib/i18n/getMessages'
import { cn } from '@/utilities/ui'

type SlideshowTimelineProps = {
  count: number
  selectedIndex: number
  progress: number
  onSelect: (index: number) => void
  locale: Locale
}

export const SlideshowTimeline: React.FC<SlideshowTimelineProps> = ({
  count,
  selectedIndex,
  progress,
  onSelect,
  locale,
}) => {
  const t = getMessages(locale)

  if (count < 2) return null

  const fillPercent = `${Math.min(100, Math.max(0, progress * 100))}%`

  return (
    <div
      className="gpi-slideshow-timeline absolute top-1 left-0 right-0 z-20 flex gap-1.5 px-3 md:top-1.5 md:gap-2 md:px-4"
      role="tablist"
      aria-label="Слайды"
    >
      {Array.from({ length: count }).map((_, index) => {
        const isActive = index === selectedIndex
        const label = t.slideshowSlideN.replace('{n}', String(index + 1))

        return (
          <button
            key={index}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-label={label}
            className={cn(
              'gpi-slideshow-timeline-tab',
              'flex min-h-11 min-w-0 flex-1 items-center',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent',
            )}
            onClick={() => onSelect(index)}
          >
            <span className="gpi-slideshow-timeline-track" aria-hidden>
              <span
                className={cn(
                  'gpi-slideshow-timeline-fill',
                  isActive ? 'gpi-slideshow-timeline-fill--active' : 'opacity-0',
                )}
                style={isActive ? { width: fillPercent } : undefined}
              />
            </span>
          </button>
        )
      })}
    </div>
  )
}
