'use client'

import React, { useLayoutEffect, useState } from 'react'

import { cn } from '@/utilities/ui'

type SlideshowOverlayProps = {
  title?: string | null
  subtitle?: string | null
  reducedMotion: boolean
}

export const SlideshowOverlay: React.FC<SlideshowOverlayProps> = ({
  title,
  subtitle,
  reducedMotion,
}) => {
  const [revealed, setRevealed] = useState(false)

  useLayoutEffect(() => {
    if (reducedMotion) {
      setRevealed(true)
      return
    }

    setRevealed(false)
    let innerFrame = 0
    const outerFrame = requestAnimationFrame(() => {
      innerFrame = requestAnimationFrame(() => setRevealed(true))
    })

    return () => {
      cancelAnimationFrame(outerFrame)
      if (innerFrame) cancelAnimationFrame(innerFrame)
    }
  }, [reducedMotion])

  if (!title && !subtitle) return null

  const chipClass = (delayed: boolean) =>
    cn(
      'gpi-slideshow-overlay-item w-fit rounded-lg bg-black/70 px-4 py-2 md:px-5',
      !delayed && 'md:py-3',
      revealed && 'gpi-slideshow-overlay-item--visible',
      delayed && 'gpi-slideshow-overlay-item--delayed',
    )

  return (
    <div
      className="gpi-slideshow-slide-content pointer-events-none absolute inset-0 z-10 flex min-h-[50vh] items-center md:min-h-[70vh]"
      aria-live="off"
    >
      <div className="container py-8 md:py-16 md:pt-20">
        <div className="flex max-w-xl flex-col items-start gap-3">
          {title && (
            <div className={chipClass(false)}>
              <h1 className="font-gpi-heading text-xl font-semibold text-white md:text-3xl">{title}</h1>
            </div>
          )}
          {subtitle && (
            <div className={chipClass(true)}>
              <p className="font-gpi-body text-sm text-white md:text-lg">{subtitle}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
