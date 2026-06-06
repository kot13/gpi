import type { MapBlock } from '@/payload-types'
import type { Locale } from '@/lib/i18n/config'

const GPI_PHONE = '+995-596-279-000'

const BATUMI_COORDS = { lat: 41.646, lng: 41.64 } as const
const TBILISI_COORDS = { lat: 41.71, lng: 44.75 } as const

const quickContacts = [
  { platform: 'phone' as const, url: 'tel:+995596279000' },
  { platform: 'whatsapp' as const, url: 'https://wa.me/995596279000' },
  { platform: 'telegram' as const, url: 'https://t.me/gpi' },
]

export function buildMapBlock(
  data: Pick<MapBlock, 'title' | 'address'> & {
    lat: number
    lng: number
    zoom?: number
    phone?: string
  },
): MapBlock {
  return {
    blockType: 'mapBlock',
    layoutVariant: 'textAndMap',
    location: {
      lat: data.lat,
      lng: data.lng,
      zoom: data.zoom ?? 15,
    },
    title: data.title,
    address: data.address,
    phone: data.phone ?? GPI_PHONE,
    quickContacts,
  }
}

const officeCopy: Record<
  Locale,
  {
    batumi: { title: string; address: string }
    tbilisi: { title: string; address: string }
  }
> = {
  ru: {
    batumi: { title: 'Батуми', address: 'ул. Селима Химшиашвили, 17' },
    tbilisi: { title: 'Тбилиси', address: 'Проспект Ильи Чавчавадзе, 47' },
  },
  ka: {
    batumi: { title: 'ბათუმი', address: 'სელიმ ხიმშიაშვილის ქ. 17' },
    tbilisi: { title: 'თბილისი', address: 'ილია ჭავჭავაძის გამზ. 47' },
  },
  en: {
    batumi: { title: 'Batumi', address: '17 Selim Khimshiashvili St.' },
    tbilisi: { title: 'Tbilisi', address: '47 Ilya Chavchavadze Ave.' },
  },
}

export function contactsLayoutForLocale(locale: Locale): MapBlock[] {
  const copy = officeCopy[locale]
  return [
    buildMapBlock({ ...copy.batumi, ...BATUMI_COORDS }),
    buildMapBlock({ ...copy.tbilisi, ...TBILISI_COORDS }),
  ]
}

export { officeCopy as contactsOfficeCopy }
