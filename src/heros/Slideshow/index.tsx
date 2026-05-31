'use client'

import useEmblaCarousel from 'embla-carousel-react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import React, { useCallback, useEffect, useRef, useState } from 'react'

import type { Page } from '@/payload-types'
import type { Locale } from '@/lib/i18n/config'
import { getMessages } from '@/lib/i18n/getMessages'
import { cn } from '@/utilities/ui'

import { CMSLink } from '@/components/Link'
import type { CMSLinkFields } from '@/lib/i18n/resolveLinkHref'

import { SlideshowOverlay } from './SlideshowOverlay'
import { SlideshowSlide, type SlideshowSlideData } from './SlideshowSlide'
import { SlideshowTimeline } from './SlideshowTimeline'
import { useReducedMotion } from './useReducedMotion'

const AUTOPLAY_MS = 6000
const PROGRESS_TICK_MS = 50

export const SlideshowHero: React.FC<Page['hero'] & { locale: Locale }> = ({ slides, locale }) => {
  const slideList = (slides ?? []) as SlideshowSlideData[]
  const reducedMotion = useReducedMotion()
  const t = getMessages(locale)
  const canNavigate = slideList.length >= 2

  const [selectedIndex, setSelectedIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [animationKey, setAnimationKey] = useState(0)
  const isPausedRef = useRef(false)
  const progressStartRef = useRef(Date.now())
  const selectedIndexRef = useRef(0)

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: canNavigate,
    duration: reducedMotion ? 0 : 25,
    watchDrag: canNavigate,
  })

  const scrollTo = useCallback(
    (index: number) => {
      emblaApi?.scrollTo(index)
    },
    [emblaApi],
  )

  const scrollPrev = useCallback(() => {
    emblaApi?.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext()
  }, [emblaApi])

  const resetProgress = useCallback(() => {
    progressStartRef.current = Date.now()
    setProgress(0)
  }, [])

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    const index = emblaApi.selectedScrollSnap()
    if (selectedIndexRef.current !== index) {
      selectedIndexRef.current = index
      setAnimationKey((k) => k + 1)
      resetProgress()
    }
    setSelectedIndex(index)
  }, [emblaApi, resetProgress])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)
    return () => {
      emblaApi.off('select', onSelect)
      emblaApi.off('reInit', onSelect)
    }
  }, [emblaApi, onSelect])

  useEffect(() => {
    if (!canNavigate || reducedMotion) return

    const id = window.setInterval(() => {
      if (isPausedRef.current) return
      const elapsed = Date.now() - progressStartRef.current
      const nextProgress = elapsed / AUTOPLAY_MS
      if (nextProgress >= 1) {
        emblaApi?.scrollNext()
        return
      }
      setProgress(nextProgress)
    }, PROGRESS_TICK_MS)

    return () => window.clearInterval(id)
  }, [canNavigate, reducedMotion, emblaApi, selectedIndex])

  const pause = useCallback(() => {
    isPausedRef.current = true
  }, [])

  const resume = useCallback(() => {
    isPausedRef.current = false
    progressStartRef.current = Date.now() - progress * AUTOPLAY_MS
  }, [progress])

  if (!slideList.length) return null

  const currentSlide = slideList[selectedIndex]
  const showCta = Boolean(currentSlide?.link && currentSlide?.buttonLabel)
  const navButtonClass =
    'flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-gpi-text shadow-md transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gpi-brand'

  return (
    <section
      className={cn(
        'gpi-slideshow relative w-full overflow-hidden text-white',
        !reducedMotion && 'gpi-slideshow--motion',
      )}
      aria-roledescription="carousel"
      aria-label="Промо-слайды"
      onFocusCapture={pause}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) resume()
      }}
      onMouseEnter={pause}
      onMouseLeave={resume}
    >
      {canNavigate && (
        <SlideshowTimeline
          count={slideList.length}
          locale={locale}
          onSelect={scrollTo}
          progress={reducedMotion ? 1 : progress}
          selectedIndex={selectedIndex}
        />
      )}

      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {slideList.map((slide, index) => (
            <SlideshowSlide
              key={slide.id ?? index}
              isActive={index === selectedIndex}
              isPrioritizedImage={index === 0}
              slide={slide}
            />
          ))}
        </div>
      </div>

      <SlideshowOverlay
        key={animationKey}
        reducedMotion={reducedMotion}
        subtitle={currentSlide?.subtitle}
        title={currentSlide?.title}
      />

      {(showCta || canNavigate) && (
        <div className="gpi-slideshow-controls pointer-events-none absolute inset-x-0 bottom-4 z-20 md:bottom-6">
          <div
            className={cn(
              'container pointer-events-auto flex items-center gap-4',
              canNavigate ? 'justify-between' : 'justify-start',
            )}
          >
            <div className="max-w-xl">
              {showCta && currentSlide && (
                <CMSLink
                  key={`cta-${selectedIndex}-${animationKey}`}
                  {...(currentSlide.link as CMSLinkFields)}
                  appearance="outline"
                  className="gpi-slideshow-cta"
                  label={currentSlide.buttonLabel}
                  locale={locale}
                  newTab={
                    (currentSlide.link as CMSLinkFields & { newTab?: boolean | null }).newTab ??
                    undefined
                  }
                />
              )}
            </div>
            {canNavigate && (
              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  aria-label={t.slideshowPrev}
                  className={navButtonClass}
                  onClick={() => {
                    scrollPrev()
                    resetProgress()
                  }}
                >
                  <ChevronLeft aria-hidden className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  aria-label={t.slideshowNext}
                  className={navButtonClass}
                  onClick={() => {
                    scrollNext()
                    resetProgress()
                  }}
                >
                  <ChevronRight aria-hidden className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {slideList[selectedIndex]?.title}
      </div>
    </section>
  )
}
