import { cn } from '@/utilities/ui'
import React from 'react'

import { ContentMap } from '@/components/maps/ContentMap'
import { MapBlockTextColumn } from '@/components/maps/MapBlockTextColumn'
import type { Locale } from '@/lib/i18n/config'
import { DEFAULT_LOCALE } from '@/lib/i18n/config'
import { getMessages } from '@/lib/i18n/getMessages'
import { DEFAULT_ZOOM } from '@/lib/maps/constants'
import { hasValidCoordinatePair } from '@/lib/maps/validateCoordinates'
import type { MapBlock as MapBlockProps } from '@/payload-types'

type Props = MapBlockProps & {
  locale?: Locale
  disableInnerContainer?: boolean
}

export const MapBlockComponent: React.FC<Props> = (props) => {
  const {
    locale = DEFAULT_LOCALE,
    layoutVariant = 'textAndMap',
    location,
    title,
    address,
    phone,
    markerLabel,
    quickContacts,
    disableInnerContainer,
  } = props

  const t = getMessages(locale)
  const lat = location?.lat
  const lng = location?.lng
  const zoom = location?.zoom ?? DEFAULT_ZOOM
  const coordsValid = hasValidCoordinatePair(lat, lng)

  const ariaLabel =
    markerLabel?.trim() ||
    title?.trim() ||
    address?.trim() ||
    t.maps?.defaultLabel ||
    'Map'

  const textColumn = (
    <MapBlockTextColumn
      title={title}
      address={address}
      phone={phone}
      quickContacts={quickContacts}
    />
  )

  const hasTextContent = Boolean(title || address || phone || quickContacts?.length)

  return (
    <div className={cn({ container: !disableInnerContainer })}>
      {layoutVariant === 'textAndMap' && hasTextContent ? (
        <div className="grid md:grid-cols-2 gap-8 lg:gap-16 items-start">
          {textColumn}
          {coordsValid ? (
            <ContentMap lat={lat} lng={lng} zoom={zoom} ariaLabel={ariaLabel} />
          ) : (
            <p className="text-sm text-gpi-muted">{t.maps?.unavailable}</p>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {hasTextContent ? textColumn : null}
          {coordsValid ? (
            <ContentMap lat={lat} lng={lng} zoom={zoom} ariaLabel={ariaLabel} />
          ) : (
            <p className="text-sm text-gpi-muted">{t.maps?.unavailable}</p>
          )}
        </div>
      )}
    </div>
  )
}
