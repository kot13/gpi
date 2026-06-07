import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { PropertyFilters } from '@/components/properties/PropertyFilters'

const replaceMock = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: replaceMock }),
  useSearchParams: () => new URLSearchParams('city=Tbilisi'),
}))

describe('PropertyFilters basePath', () => {
  it('uses custom basePath for map route', () => {
    render(
      <PropertyFilters
        locale="ru"
        districts={[]}
        basePath="/ru/properties/map"
        presentation="sidebar"
      />,
    )

    expect(screen.getByRole('complementary', { name: /Фильтры/i })).toBeInTheDocument()
  })
})
