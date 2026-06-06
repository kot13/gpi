'use client'

import dynamic from 'next/dynamic'
import React, { useEffect, useRef, useState } from 'react'

const MapInner = dynamic(() => import('./MapInner'), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-gpi-border animate-pulse" aria-hidden />,
})

type Props = {
  lat: number
  lng: number
  zoom?: number
  ariaLabel: string
  /** Defer map init until visible (multiple maps on one page). */
  lazy?: boolean
}

export function ContentMap({ lat, lng, zoom, ariaLabel, lazy = true }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(!lazy)

  useEffect(() => {
    if (!lazy || visible) return

    const node = containerRef.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: '100px' },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [lazy, visible])

  return (
    <div
      ref={containerRef}
      className="h-60 md:h-80 lg:h-96 rounded-lg overflow-hidden border border-gpi-border"
      aria-label={ariaLabel}
      role="region"
    >
      {visible ? (
        <MapInner lat={lat} lng={lng} zoom={zoom} />
      ) : (
        <div className="h-full w-full bg-gpi-border animate-pulse" aria-hidden />
      )}
    </div>
  )
}
