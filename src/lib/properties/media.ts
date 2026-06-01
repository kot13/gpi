import type { Media } from '@/payload-types'

import type { PropertyPhoto } from './types'

export function resolvePropertyImage(image: PropertyPhoto['image']): Media | null {
  if (image && typeof image === 'object' && 'url' in image) {
    return image as Media
  }
  return null
}

export function getFirstPropertyImage(photos?: PropertyPhoto[] | null): Media | null {
  if (!photos?.length) return null
  return resolvePropertyImage(photos[0]?.image)
}
