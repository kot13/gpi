import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { PropertiesMapPanel } from '@/components/maps/PropertiesMapPanel'
import type { MapPropertyPoint } from '@/lib/maps/mapPropertyPoint'

vi.mock('@/components/properties/PropertyFilters', () => ({
  PropertyFilters: () => <div data-testid="property-filters" />,
}))

const samplePoint: MapPropertyPoint = {
  objectCode: '1037',
  lat: 41.646,
  lng: 41.64,
  title: 'Batumi apt',
  cityLabel: 'Batumi',
  district: 'Center',
  priceUsd: 100000,
  priceGel: 270000,
  photo: null,
  detailHref: '/ru/properties/1037',
}

describe('PropertiesMapPanel', () => {
  it('shows result count in header', () => {
    render(
      <PropertiesMapPanel
        locale="ru"
        districts={[]}
        visiblePoints={[samplePoint]}
        selectedObjectCode={null}
        filterParams={{}}
        onHover={() => undefined}
        onSelect={() => undefined}
      />,
    )

    expect(screen.getByText(/В области: 1/i)).toBeInTheDocument()
  })

  it('shows empty viewport message', () => {
    render(
      <PropertiesMapPanel
        locale="ru"
        districts={[]}
        visiblePoints={[]}
        selectedObjectCode={null}
        filterParams={{}}
        onHover={() => undefined}
        onSelect={() => undefined}
      />,
    )

    expect(screen.getByText(/В этой области карты объектов нет/i)).toBeInTheDocument()
  })
})
