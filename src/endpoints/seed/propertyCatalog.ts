import type {
  PropertyCity,
  PropertyCondition,
  PropertyFeature,
  PropertyHeating,
  PropertyLayout,
  PropertyListingStatus,
  PropertyReadiness,
  PropertyRepair,
} from '@/lib/properties/types'
import { PROPERTY_FEATURES } from '@/lib/properties/dictionaries'

export type PropertyCatalogSeed = {
  objectCode: string
  listingStatus: PropertyListingStatus
  city: PropertyCity
  district: string
  street: string
  lat: number
  lng: number
  priceUsd: number
  priceGel: number
  area: number
  rooms: number
  floor: number
  totalFloors: number
  condition: PropertyCondition
  repair: PropertyRepair
  layout: PropertyLayout
  heating: PropertyHeating
  readiness: PropertyReadiness
  buildingType: string
  features: PropertyFeature[]
  title: string
  description: string
  crmUrl?: string
  telegramUrl: string
  driveFolderUrl: string
  photoUrls: string[]
  listingDate: string
}

const featureSet = new Set<string>(PROPERTY_FEATURES)

export function parseFeaturesCsv(raw: string): PropertyFeature[] {
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter((s): s is PropertyFeature => featureSet.has(s))
}

/** `DD.MM.YYYY` → ISO date for `listingDate` */
export function parseListingDateDdMmYyyy(raw: string): string {
  const [day, month, year] = raw.split('.')
  if (!day || !month || !year) return new Date().toISOString()
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T12:00:00.000Z`
}

export const PROPERTY_CATALOG_SEEDS: PropertyCatalogSeed[] = [
  {
    objectCode: '1037',
    listingStatus: 'active',
    city: 'Batumi',
    district: 'Новый бульвар',
    street: 'Georgia, Batumi, Новый бульвар, ул. Реджеба Нижарадзе, 20',
    lat: 41.646098,
    lng: 41.64049,
    priceUsd: 73000,
    priceGel: 197100,
    area: 41,
    rooms: 1,
    floor: 2,
    totalFloors: 14,
    condition: 'renovated',
    repair: 'renovated',
    layout: 'studio',
    heating: 'unknown',
    readiness: 'ready',
    buildingType: 'Sunset',
    features: parseFeaturesCsv('central_heating,renovated'),
    title: 'Sunset · Новый бульвар',
    description:
      'Просторная квартира с дизайнерским ремонтом, в которой легко почувствовать себя дома с первого взгляда. Продуманная планировка, много света и ощущение свободы в каждом метре. Отличный вариант для тех, кто ценит комфорт и стиль без лишних хлопот',
    telegramUrl: 'https://t.me/BatumiRealEstateSell',
    driveFolderUrl: 'https://drive.google.com/drive/folders/1GhrKlk5O8l_jlw9u62KKnkQEcT5bkC8t',
    photoUrls: [
      'https://drive.google.com/thumbnail?id=1sRZAKh1GRl2pyKeChDLIKxAdRQ2-XpBW&sz=w900',
      'https://drive.google.com/thumbnail?id=1m-liSxducRyd9sw-nPH5E66cTk27tFPN&sz=w900',
      'https://drive.google.com/thumbnail?id=14FTaD8-FCaK0gZfwkRYbrNVXnTAtPC_k&sz=w900',
      'https://drive.google.com/thumbnail?id=1750NLZXG2OyGI6KoLzjnDcw7tij1HW2q&sz=w900',
      'https://drive.google.com/thumbnail?id=1Tyq-oI7duczpa4dQa-WWKxMh_nhal0dC&sz=w900',
      'https://drive.google.com/thumbnail?id=1ZdduScR5M0Sh_Q1R-T_Vs6XX415pqmgA&sz=w900',
    ],
    listingDate: parseListingDateDdMmYyyy('30.04.2026'),
  },
  {
    objectCode: '1039',
    listingStatus: 'active',
    city: 'Batumi',
    district: 'Новый бульвар',
    street: 'Georgia, Batumi, Новый бульвар, ул. Давида Мамуладзе, 19',
    lat: 41.638175,
    lng: 41.613818,
    priceUsd: 61000,
    priceGel: 164700,
    area: 27,
    rooms: 1,
    floor: 4,
    totalFloors: 20,
    condition: 'renovated',
    repair: 'renovated',
    layout: 'studio',
    heating: 'unknown',
    readiness: 'ready',
    buildingType: 'Next Apartments',
    features: parseFeaturesCsv('pool,central_heating,renovated'),
    title: 'Next Apartments · Новый бульвар',
    description:
      'Укомплектованная под ключ студия с отоплением в Next Apartments. С балкона открывается вид на город в сторону моря. Комплекс расположен в 200 м от набережной. Приобретая данный апартамент, вы получаете готовую для личного проживания или сдачи в аренду квартиру, с высоким уровнем безопасности в комплексе, личным бассейном на крыше, подземным паркингом и развитой инфраструктурой в окружении.',
    telegramUrl: 'https://t.me/BatumiRealEstateSell',
    driveFolderUrl: 'https://drive.google.com/drive/folders/1qxTdWnDChKTC299JJe_jCwTVi_eQydig',
    photoUrls: [
      'https://drive.google.com/thumbnail?id=1PxZ-vcVoCzrdais46leIoKLL_XgugS5m&sz=w900',
      'https://drive.google.com/thumbnail?id=14sW5cBfxLnMrO588vqdLieyShSxdkev2&sz=w900',
      'https://drive.google.com/thumbnail?id=1kJbzf9DI9cIV9NycFEsj03iLq4JYkRj0&sz=w900',
      'https://drive.google.com/thumbnail?id=1-rJFcXm0dLRtITZuzuXLZZJzS070RXth&sz=w900',
      'https://drive.google.com/thumbnail?id=1_CvmxyPeeHBGez0cpgrHG6CzH2zsOwTi&sz=w900',
      'https://drive.google.com/thumbnail?id=1NraQyqHULej7FSPYYl4pJI2ZjOQIVwWi&sz=w900',
    ],
    listingDate: parseListingDateDdMmYyyy('30.04.2026'),
  },
  {
    objectCode: '994',
    listingStatus: 'active',
    city: 'Batumi',
    district: 'Дом в Гонио',
    street: 'Georgia, Batumi, ул. Святой Нино , 21',
    lat: 41.646098,
    lng: 41.64049,
    priceUsd: 280000,
    priceGel: 756000,
    area: 264.5,
    rooms: 3,
    floor: 1,
    totalFloors: 2,
    condition: 'renovated',
    repair: 'renovated',
    layout: '3+1',
    heating: 'gas',
    readiness: 'ready',
    buildingType: 'Дом в Гонио',
    features: parseFeaturesCsv('sea_view,mountain_view,terrace,renovated'),
    title: 'Дом в Гонио · Дом в Гонио',
    description:
      'Вилла в Гонио с видом на море. Все коммуникации подключены, есть теплый пол и радиаторы. Продается с ремонтом без мебели и техники. Планировка: 3 спальни, кухня-гостиная, 3 санузла, гараж, терраса на крыше.',
    telegramUrl: 'https://t.me/BatumiRealEstateSell',
    driveFolderUrl: 'https://drive.google.com/drive/folders/1LSWS5T6NV9zQeW8WsUulfkbuz10gr4s8',
    photoUrls: [
      'https://drive.google.com/thumbnail?id=1vAmdV3yWMkSHu0Kv33vFkfy-doXq5N_C&sz=w900',
      'https://drive.google.com/thumbnail?id=11p__XNkj3F_vsbSF7lDC7o-2GIqd6QO_&sz=w900',
      'https://drive.google.com/thumbnail?id=1k5FiUz6QnigU-a3l64RqSGD1Ynz7XXDD&sz=w900',
      'https://drive.google.com/thumbnail?id=1SXFFoS1uRrWuzpOYo18kE9bPkw4hzE9k&sz=w900',
      'https://drive.google.com/thumbnail?id=1unxmRsWVC1_QfDBJyipKtWUyx_Ds83Yl&sz=w900',
      'https://drive.google.com/thumbnail?id=1XkJs9l-M63Crov2hr6CtSfDz_5j7Viuf&sz=w900',
    ],
    listingDate: parseListingDateDdMmYyyy('30.03.2026'),
  },
  {
    objectCode: '450',
    listingStatus: 'active',
    city: 'Batumi',
    district: 'Гонио',
    street: 'Georgia, Batumi, Гонио, шоссе Андрея Первозванного, 8',
    lat: 41.560548,
    lng: 41.571103,
    priceUsd: 110000,
    priceGel: 297000,
    area: 32,
    rooms: 1,
    floor: 21,
    totalFloors: 25,
    condition: 'renovated',
    repair: 'renovated',
    layout: 'studio',
    heating: 'unknown',
    readiness: 'ready',
    buildingType: 'Wyndham Residence Batumi',
    features: parseFeaturesCsv('renovated'),
    title: 'Wyndham Residence Batumi · Гонио',
    description: 'Описание уточняется у менеджера GPI Realty.',
    telegramUrl: 'https://t.me/BatumiRealEstateSell',
    driveFolderUrl: 'https://drive.google.com/drive/folders/17jTq4h51DMtX6fZlRPRWsolWzTkxy1C2',
    photoUrls: [
      'https://drive.google.com/thumbnail?id=127YeR7W0FpY_VcIozhOfvhpIMaA-kIPE&sz=w900',
      'https://drive.google.com/thumbnail?id=1MVcreVkdd7Ii6XWNVPwBY06EsJakPHXa&sz=w900',
      'https://drive.google.com/thumbnail?id=1ttbFfbXEhdddU7P8tJeL5k0fv3nEQlVK&sz=w900',
      'https://drive.google.com/thumbnail?id=1djAbcU8_Me5pgErycGIuVOaygvueWbHn&sz=w900',
      'https://drive.google.com/thumbnail?id=11TRdBpdHnQqV4mHsAKFyHOjgq3_pa-Ty&sz=w900',
      'https://drive.google.com/thumbnail?id=1lisuGyaAbun0xtDKrINObN2a1yCyqCms&sz=w900',
    ],
    listingDate: parseListingDateDdMmYyyy('30.01.2025'),
  },
  {
    objectCode: '901',
    listingStatus: 'active',
    city: 'Batumi',
    district: 'Новый бульвар',
    street: 'Georgia, Batumi, Новый бульвар, ул. Ангиса, 85',
    lat: 41.627972,
    lng: 41.6031,
    priceUsd: 45000,
    priceGel: 121500,
    area: 27.9,
    rooms: 1,
    floor: 15,
    totalFloors: 29,
    condition: 'new',
    repair: 'white_frame',
    layout: 'studio',
    heating: 'unknown',
    readiness: 'building',
    buildingType: 'Guru Status',
    features: parseFeaturesCsv('sea_view,mountain_view,city_view,terrace,pool,new_building'),
    title: 'Guru Status · Новый бульвар',
    description:
      'Современный жилой комплекс со стильным дизайном, оборудованный бассейном во дворе и террасой на эксплуатируемой кровле',
    telegramUrl: 'https://t.me/BatumiRealEstateSell',
    driveFolderUrl: 'https://drive.google.com/drive/folders/1qUwOvtw2hjl1Aw03mu67X-UNc_K2NFWr',
    photoUrls: [
      'https://drive.google.com/thumbnail?id=1418FNnWsnY43NV6xvSx3Wou8km17YvP5&sz=w900',
      'https://drive.google.com/thumbnail?id=1RSn71Y9Plnt8HQPrn6vjhdyzBuMF6jUh&sz=w900',
      'https://drive.google.com/thumbnail?id=1NIzHzuSvKG8WPxRMgiPyw-KAXnugmYgY&sz=w900',
      'https://drive.google.com/thumbnail?id=1bI1tmyVwWs2xmnBoGDiVmi3ry0N3OiOd&sz=w900',
      'https://drive.google.com/thumbnail?id=1IzUODnxtKDyDQfaX1jwUOeXMEIhpHZtS&sz=w900',
      'https://drive.google.com/thumbnail?id=1wJa2o0VcJE8UpCq7wqaKv52etKvfcxgU&sz=w900',
    ],
    listingDate: parseListingDateDdMmYyyy('29.12.2025'),
  },
  {
    objectCode: '902',
    listingStatus: 'active',
    city: 'Batumi',
    district: 'Новый бульвар',
    street: 'Georgia, Batumi, Новый бульвар, ул. Ангиса , 85',
    lat: 41.627972,
    lng: 41.6031,
    priceUsd: 45000,
    priceGel: 121500,
    area: 27.9,
    rooms: 1,
    floor: 16,
    totalFloors: 29,
    condition: 'new',
    repair: 'white_frame',
    layout: 'studio',
    heating: 'unknown',
    readiness: 'building',
    buildingType: 'Guru Status',
    features: parseFeaturesCsv('sea_view,mountain_view,city_view,new_building'),
    title: 'Guru Status · Новый бульвар',
    description: 'https://gpinvest.amocrm.ru/leads/detail/57973355?after_add=yes&reload=yes',
    telegramUrl: 'https://t.me/BatumiRealEstateSell',
    driveFolderUrl: 'https://drive.google.com/drive/folders/1_k_9wFJxLU1gyGwSSkh9WYr4PpytWZ73',
    photoUrls: [
      'https://drive.google.com/thumbnail?id=1lHtuhT4AWrow4WqIchIYjn4jUjF_90Bi&sz=w900',
      'https://drive.google.com/thumbnail?id=1lcKaLHL7aiVu2rwf5Xo7GEOmtsXKcwEo&sz=w900',
      'https://drive.google.com/thumbnail?id=1TMvkCNJ0kgYbYKgKh5zmdPLRZa9JqxuB&sz=w900',
      'https://drive.google.com/thumbnail?id=1x0gcuLJtIgsO6yI06E0YVwhMIVFSrVJ-&sz=w900',
      'https://drive.google.com/thumbnail?id=1EyfAiMib60uqzbdwwbtytJojGlTqdLI4&sz=w900',
      'https://drive.google.com/thumbnail?id=10GHkTchXU91WWk57oOQSfXXzEzwhR0FW&sz=w900',
    ],
    listingDate: parseListingDateDdMmYyyy('29.12.2025'),
  },
  {
    objectCode: '814',
    listingStatus: 'active',
    city: 'Batumi',
    district: 'Новый бульвар',
    street: 'Georgia, Batumi, Новый бульвар, ул. Згвиспирис (Морская), 6',
    lat: 41.646098,
    lng: 41.64049,
    priceUsd: 49140,
    priceGel: 132678,
    area: 39,
    rooms: 1,
    floor: 5,
    totalFloors: 21,
    condition: 'new',
    repair: 'black_frame',
    layout: 'studio',
    heating: 'unknown',
    readiness: 'building',
    buildingType: 'Prime Residence',
    features: parseFeaturesCsv('mountain_view,city_view,new_building'),
    title: 'Prime Residence · Новый бульвар',
    description:
      'Современный жилой комплекс премиум-класса. Расположен в престижной части Батуми всего в пяти минутах ходьбы от моря — это идеальное место как для постоянного проживания, так и для отдыха или аренды. Клубный формат создаёт атмосферу уюта и приватности, а закрытая территория с благоустроенным двором, зонами отдыха и ландшафтным дизайном позволяет наслаждаться спокойной и безопасной жизнью.',
    telegramUrl: 'https://t.me/BatumiRealEstateSell',
    driveFolderUrl: 'https://drive.google.com/drive/folders/1BrSRRJbEAMK8NFk_nUwsBDdC36IGiRrV',
    photoUrls: [
      'https://drive.google.com/thumbnail?id=1apCL6Np-47PYrl2V_W5S3zWSJm31pB2c&sz=w900',
      'https://drive.google.com/thumbnail?id=1aUFkH3UAoKBHTGiM-7rK96UCILn5gmgG&sz=w900',
      'https://drive.google.com/thumbnail?id=1rN61SBhCdyZ68qKS5vSwqIpoIq3wCHPa&sz=w900',
      'https://drive.google.com/thumbnail?id=1PfoT9OzO1fWR8C4HnhYghj5NPJ1eJN2k&sz=w900',
      'https://drive.google.com/thumbnail?id=1Fpdb2wXlvmIX6AyT1uqizoyhWI-o0Xj0&sz=w900',
      'https://drive.google.com/thumbnail?id=1Se10PNqmGpw8bfxg-DxBqtWruUmtmNFO&sz=w900',
    ],
    listingDate: parseListingDateDdMmYyyy('29.09.2025'),
  },
]
