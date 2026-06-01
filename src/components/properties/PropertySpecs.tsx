import React from 'react'

import type { Locale } from '@/lib/i18n/config'
import { getMessages } from '@/lib/i18n/getMessages'
import {
  cityLabel,
  conditionLabel,
  heatingLabel,
  layoutLabel,
  readinessLabel,
  repairLabel,
} from '@/lib/properties/labels'
import { formatPriceGel, formatPriceUsd } from '@/lib/properties/formatPrice'
import type { PropertyListItem } from '@/lib/properties/types'

type Props = {
  property: PropertyListItem
  locale: Locale
}

export function PropertySpecs({ property, locale }: Props) {
  const p = getMessages(locale).properties

  const rows: Array<{ label: string; value: string }> = [
    { label: p?.filterCity ?? 'City', value: cityLabel(locale, property.city) },
    ...(property.district ? [{ label: p?.filterDistrict ?? 'District', value: property.district }] : []),
    ...(property.street ? [{ label: p?.specAddress ?? 'Address', value: property.street }] : []),
    { label: 'USD', value: formatPriceUsd(property.priceUsd, locale) },
    { label: 'GEL', value: formatPriceGel(property.priceGel, locale) },
    { label: p?.specArea ?? 'Area', value: `${property.area} m²` },
    { label: p?.specRooms ?? 'Rooms', value: String(property.rooms) },
  ]

  if (property.floor != null) {
    rows.push({
      label: p?.specFloor ?? 'Floor',
      value:
        property.totalFloors != null
          ? `${property.floor} / ${property.totalFloors}`
          : String(property.floor),
    })
  }

  if (property.layout) {
    rows.push({ label: p?.filterLayout ?? 'Layout', value: layoutLabel(locale, property.layout) })
  }
  if (property.condition) {
    rows.push({
      label: p?.filterCondition ?? 'Condition',
      value: conditionLabel(locale, property.condition),
    })
  }
  if (property.repair) {
    rows.push({ label: p?.filterRepair ?? 'Repair', value: repairLabel(locale, property.repair) })
  }
  if (property.heating) {
    rows.push({ label: p?.filterHeating ?? 'Heating', value: heatingLabel(locale, property.heating) })
  }
  if (property.readiness) {
    rows.push({
      label: p?.filterReadiness ?? 'Readiness',
      value: readinessLabel(locale, property.readiness),
    })
  }
  if (property.buildingType) {
    rows.push({ label: p?.specBuildingType ?? 'Building', value: property.buildingType })
  }

  return (
    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
      {rows.map((row) => (
        <div key={row.label}>
          <dt className="text-gpi-muted">{row.label}</dt>
          <dd className="text-gpi-text font-medium">{row.value}</dd>
        </div>
      ))}
    </dl>
  )
}
