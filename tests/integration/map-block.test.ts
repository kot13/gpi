import { Pages } from '@/collections/Pages'
import { getPayload } from '@/lib/payload/getPayload'
import type { Payload } from 'payload'

import { describe, it, beforeAll, expect } from 'vitest'

let payload: Payload

function getLayoutBlocksField() {
  const tabs = Pages.fields.find((f) => f.type === 'tabs')
  if (!tabs || tabs.type !== 'tabs') throw new Error('tabs not found')
  const contentTab = tabs.tabs.find((t) => t.label === 'Content')
  if (!contentTab) throw new Error('Content tab not found')
  const layoutField = contentTab.fields.find(
    (f) => 'name' in f && f.name === 'layout',
  )
  if (!layoutField || layoutField.type !== 'blocks') {
    throw new Error('layout blocks field not found')
  }
  return layoutField
}

describe('MapBlock in Pages', () => {
  beforeAll(async () => {
    payload = await getPayload()
  }, 60000)

  it('registers mapBlock in Pages layout blocks', () => {
    const layoutField = getLayoutBlocksField()
    const slugs = layoutField.blocks?.map((b) => b.slug) ?? []
    expect(slugs).toContain('mapBlock')
  })

  it('mapBlock config includes location group with lat and lng', () => {
    const layoutField = getLayoutBlocksField()
    const mapBlock = layoutField.blocks?.find((b) => b.slug === 'mapBlock')
    expect(mapBlock).toBeDefined()

    const locationGroup = mapBlock?.fields.find(
      (f) => 'name' in f && f.name === 'location',
    )
    expect(locationGroup?.type).toBe('group')

    if (locationGroup?.type !== 'group') return

    const names = locationGroup.fields.map((f) => ('name' in f ? f.name : null))
    expect(names).toContain('lat')
    expect(names).toContain('lng')
    expect(names).toContain('mapPicker')
  })

  it('persists mapBlock coordinates on page create', async () => {
    const slug = `map-test-${Date.now()}`
    const doc = await payload.create({
      collection: 'pages',
      overrideAccess: true,
      context: { disableRevalidate: true },
      data: {
        title: 'Map test',
        slug,
        _status: 'draft',
        hero: { type: 'none' },
        layout: [
          {
            blockType: 'mapBlock',
            layoutVariant: 'textAndMap',
            location: { lat: 41.646, lng: 41.64, zoom: 15 },
            title: 'Батуми',
            address: 'Test address',
          },
        ],
      },
    })

    const layout = doc.layout?.[0]
    expect(layout?.blockType).toBe('mapBlock')
    if (layout?.blockType === 'mapBlock') {
      expect(layout.location?.lat).toBe(41.646)
      expect(layout.location?.lng).toBe(41.64)
    }
  })

  it('publishes page when locale PATCH omits non-localized map coordinates but draft has them', async () => {
    const slug = `map-merge-${Date.now()}`
    const draft = await payload.create({
      collection: 'pages',
      overrideAccess: true,
      context: { disableRevalidate: true },
      data: {
        title: 'Map merge test',
        slug,
        _status: 'draft',
        hero: { type: 'none' },
        layout: [
          {
            blockType: 'mapBlock',
            layoutVariant: 'textAndMap',
            location: { lat: 41.646, lng: 41.64, zoom: 15 },
            title: 'Батуми',
          },
        ],
      },
    })

    const published = await payload.update({
      collection: 'pages',
      id: draft.id,
      overrideAccess: true,
      context: { disableRevalidate: true },
      data: {
        _status: 'published',
        layout: [
          {
            blockType: 'mapBlock',
            layoutVariant: 'textAndMap',
            location: { zoom: 15 },
            title: 'Батуми',
          },
        ],
      },
    })

    const block = published.layout?.[0]
    expect(block?.blockType).toBe('mapBlock')
    if (block?.blockType === 'mapBlock') {
      expect(block.location?.lat).toBe(41.646)
      expect(block.location?.lng).toBe(41.64)
    }
  })

  it('rejects publishing page with mapBlock missing coordinates', async () => {
    const slug = `map-invalid-${Date.now()}`
    await expect(
      payload.create({
        collection: 'pages',
        overrideAccess: true,
        data: {
          title: 'Invalid map',
          slug,
          _status: 'published',
          hero: { type: 'none' },
          layout: [
            {
              blockType: 'mapBlock',
              layoutVariant: 'textAndMap',
              location: {},
              title: 'Empty map',
            },
          ],
        },
      }),
    ).rejects.toThrow(/блок карты/i)
  })
})
