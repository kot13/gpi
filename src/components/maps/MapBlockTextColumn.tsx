import React from 'react'

import { SocialLinks } from '@/components/ui/SocialLinks'
import type { MapBlock } from '@/payload-types'

type Props = {
  title?: string | null
  address?: string | null
  phone?: string | null
  quickContacts?: MapBlock['quickContacts']
}

function phoneHref(phone: string): string {
  const digits = phone.replace(/[^\d+]/g, '')
  return digits.startsWith('+') ? `tel:${digits}` : `tel:${digits}`
}

export function MapBlockTextColumn({ title, address, phone, quickContacts }: Props) {
  return (
    <div className="flex flex-col gap-4">
      {title ? <h2 className="text-2xl lg:text-3xl font-bold text-gpi-text">{title}</h2> : null}
      {phone ? (
        <p className="text-base text-gpi-text">
          <a href={phoneHref(phone)} className="hover:text-gpi-brand transition-colors">
            {phone}
          </a>
        </p>
      ) : null}
      {address ? <p className="text-base text-gpi-text whitespace-pre-line">{address}</p> : null}
      {quickContacts?.length ? <SocialLinks links={quickContacts} /> : null}
    </div>
  )
}
