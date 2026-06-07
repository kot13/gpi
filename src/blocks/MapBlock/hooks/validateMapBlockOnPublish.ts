import type { CollectionBeforeChangeHook } from 'payload'

import type { MapBlock } from '@/payload-types'
import { hasValidCoordinatePair, validateCoordinates } from '@/lib/maps/validateCoordinates'

function isMapBlock(block: unknown): block is MapBlock {
  return (
    typeof block === 'object' &&
    block !== null &&
    (block as { blockType?: string }).blockType === 'mapBlock'
  )
}

function findMatchingMapBlock(blocks: unknown[], block: MapBlock, index: number): MapBlock | undefined {
  if (!Array.isArray(blocks)) return undefined

  if (block.id) {
    const byId = blocks.find((item) => isMapBlock(item) && item.id === block.id)
    if (byId && isMapBlock(byId)) return byId
  }

  const byIndex = blocks[index]
  return isMapBlock(byIndex) ? byIndex : undefined
}

/** Non-localized lat/lng may be omitted from locale PATCH — merge from stored layout. */
export function mergeMapBlockLocations(incoming: unknown, stored: unknown): unknown {
  if (!Array.isArray(incoming)) return stored ?? incoming
  if (!Array.isArray(stored)) return incoming

  return incoming.map((block, index) => {
    if (!isMapBlock(block)) return block

    const storedBlock = findMatchingMapBlock(stored, block, index)
    if (!storedBlock) return block

    const incomingValid = validateCoordinates(block.location?.lat, block.location?.lng).ok
    const storedValid = validateCoordinates(
      storedBlock.location?.lat,
      storedBlock.location?.lng,
    ).ok

    if (incomingValid || !storedValid) return block

    return {
      ...block,
      location: {
        ...storedBlock.location,
        ...block.location,
        lat: storedBlock.location?.lat,
        lng: storedBlock.location?.lng,
      },
    }
  })
}

function layoutHasMapBlockMissingCoords(layout: unknown): boolean {
  if (!Array.isArray(layout)) return false

  return layout.some((block) => {
    if (!isMapBlock(block)) return false
    return !hasValidCoordinatePair(block.location?.lat, block.location?.lng)
  })
}

function validateLayoutMapBlocks(layout: unknown, locale: string): void {
  if (!Array.isArray(layout)) return

  for (let i = 0; i < layout.length; i++) {
    const block = layout[i]
    if (!isMapBlock(block)) continue

    const lat = block.location?.lat
    const lng = block.location?.lng
    const result = validateCoordinates(lat, lng)

    if (!result.ok) {
      const blockLabel = block.title ? `"${block.title}"` : `#${i + 1}`
      throw new Error(
        `Блок карты ${blockLabel}: укажите точку на карте (корректные lat/lng) для локали "${locale}".`,
      )
    }
  }
}

export const validateMapBlockOnPublish: CollectionBeforeChangeHook = async ({
  data,
  req,
  originalDoc,
  operation,
}) => {
  const doc = data as { _status?: string; layout?: unknown; id?: string | number }
  const locale = req.locale || 'ru'
  let layout = doc.layout

  if (operation === 'update') {
    layout = mergeMapBlockLocations(layout, (originalDoc as { layout?: unknown })?.layout)

    const pageId = doc.id ?? (originalDoc as { id?: string | number })?.id
    if (pageId && layoutHasMapBlockMissingCoords(layout)) {
      const stored = await req.payload.findByID({
        collection: 'pages',
        id: pageId,
        locale,
        draft: true,
        depth: 0,
        req,
      })
      layout = mergeMapBlockLocations(layout, stored.layout)
    }

    if (layout !== doc.layout) {
      doc.layout = layout
    }
  }

  if (doc._status !== 'published') return data

  validateLayoutMapBlocks(layout, locale)

  return data
}
