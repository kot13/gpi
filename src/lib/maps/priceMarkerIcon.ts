import L from 'leaflet'

import { formatPriceUsd } from '@/lib/properties/formatPrice'

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export function createPropertyPriceIcon(
  priceUsd: number,
  locale: string,
  highlighted: boolean,
): L.DivIcon {
  const label = escapeHtml(formatPriceUsd(priceUsd, locale))
  const activeClass = highlighted ? ' gpi-map-price-label--active' : ''

  return L.divIcon({
    className: 'gpi-map-price-marker',
    html: `<div class="gpi-map-price-label${activeClass}"><span>${label}</span></div>`,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  })
}
