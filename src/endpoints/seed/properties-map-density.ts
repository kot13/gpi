import type { Payload } from 'payload'

/**
 * Optional dev/E2E seed: dense Batumi cluster (~30 objects).
 * Enable via SEED_MAP_DENSITY=1 when running seed.
 */
export async function seedPropertiesMapDensity(payload: Payload): Promise<void> {
  const baseLat = 41.646
  const baseLng = 41.64

  for (let i = 0; i < 30; i += 1) {
    const objectCode = `map-density-${String(i + 1).padStart(2, '0')}`
    const existing = await payload.find({
      collection: 'properties',
      where: { objectCode: { equals: objectCode } },
      limit: 1,
    })
    if (existing.docs.length) continue

    await payload.create({
      collection: 'properties',
      data: {
        objectCode,
        listingStatus: 'active',
        _status: 'published',
        city: 'Batumi',
        district: 'Cluster test',
        street: `Density st ${i + 1}`,
        lat: baseLat + (i % 10) * 0.001,
        lng: baseLng + Math.floor(i / 10) * 0.001,
        priceUsd: 80000 + i * 1000,
        priceGel: 220000 + i * 2000,
        area: 45 + (i % 5),
        rooms: 1 + (i % 3),
        layout: '1+1',
        title: `Map density ${objectCode}`,
        description: 'E2E cluster seed object',
      },
    })
  }
}
