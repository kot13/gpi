'use client'

import { useEffect, useState } from 'react'

import { REDUCED_MOTION_QUERY, readReducedMotionPreference } from '@/lib/motion/reducedMotion'

export { readReducedMotionPreference } from '@/lib/motion/reducedMotion'

export function useReducedMotion(): boolean {
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia(REDUCED_MOTION_QUERY)
    const update = () => setReducedMotion(mediaQuery.matches)
    update()
    mediaQuery.addEventListener('change', update)
    return () => mediaQuery.removeEventListener('change', update)
  }, [])

  return reducedMotion
}
