import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { MapBlockComponent } from '@/blocks/MapBlock/Component'

vi.mock('@/components/maps/ContentMap', () => ({
  ContentMap: () => <div data-testid="content-map">map</div>,
}))

describe('MapBlockComponent', () => {
  it('shows fallback without map when coordinates are missing', () => {
    render(
      <MapBlockComponent
        blockType="mapBlock"
        layoutVariant="textAndMap"
        location={{ lat: null as unknown as number, lng: null as unknown as number }}
        title="Батуми"
        address="ул. Селима Химшиашвили, 17"
        locale="ru"
      />,
    )

    expect(screen.getByRole('heading', { level: 2, name: 'Батуми' })).toBeInTheDocument()
    expect(screen.getByText('ул. Селима Химшиашвили, 17')).toBeInTheDocument()
    expect(screen.getByText(/карта временно недоступна/i)).toBeInTheDocument()
    expect(screen.queryByTestId('content-map')).not.toBeInTheDocument()
  })

  it('renders textAndMap grid with map when coordinates are valid', () => {
    render(
      <MapBlockComponent
        blockType="mapBlock"
        layoutVariant="textAndMap"
        location={{ lat: 41.646, lng: 41.64, zoom: 15 }}
        title="Батуми"
        address="ул. Селима Химшиашвили, 17"
        locale="ru"
      />,
    )

    expect(screen.getByTestId('content-map')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: 'Батуми' })).toBeInTheDocument()
  })
})
