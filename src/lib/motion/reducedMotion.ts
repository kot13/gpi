export const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'

export function readReducedMotionPreference(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia(REDUCED_MOTION_QUERY).matches
}
