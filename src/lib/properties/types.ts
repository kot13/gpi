import type { Media } from '@/payload-types'

export type PropertyCity = 'Tbilisi' | 'Batumi'
export type PropertyCondition = 'renovated' | 'new' | 'good' | 'premium'
export type PropertyRepair = 'renovated' | 'white_frame' | 'black_frame' | 'unknown'
export type PropertyLayout = 'studio' | '1+1' | '2+1' | '3+1' | '4plus'
export type PropertyHeating = 'gas' | 'electric' | 'unknown'
export type PropertyReadiness = 'ready' | 'building' | 'unknown'
export type PropertyListingStatus = 'draft' | 'active' | 'inactive'

export type PropertyFeature =
  | 'balcony'
  | 'elevator'
  | 'parking'
  | 'sea_view'
  | 'mountain_view'
  | 'city_view'
  | 'new_building'
  | 'renovated'
  | 'furnished'
  | 'near_metro'
  | 'terrace'
  | 'old_town'
  | 'central_heating'
  | 'boulevard'
  | 'pool'

export type PropertyPhoto = {
  image?: Media | string | number | null
  id?: string | null
}

export type PropertyListItem = {
  id: string | number
  objectCode: string
  title: string
  description?: string | null
  city: PropertyCity
  district?: string | null
  street?: string | null
  lat?: number | null
  lng?: number | null
  priceUsd: number
  priceGel: number
  area: number
  rooms: number
  floor?: number | null
  totalFloors?: number | null
  condition?: PropertyCondition | null
  repair?: PropertyRepair | null
  layout?: PropertyLayout | null
  heating?: PropertyHeating | null
  readiness?: PropertyReadiness | null
  buildingType?: string | null
  features?: PropertyFeature[] | null
  photos?: PropertyPhoto[] | null
  crmUrl?: string | null
  telegramUrl?: string | null
  driveFolderUrl?: string | null
  listingDate?: string | null
  listingStatus?: PropertyListingStatus
  meta?: {
    title?: string | null
    description?: string | null
    image?: Media | string | number | null
  } | null
}

export type PropertySort = 'updatedAt-desc' | 'priceUsd-asc' | 'priceUsd-desc'

export type PropertyFilterParams = {
  city?: PropertyCity[]
  district?: string
  minUsd?: number
  maxUsd?: number
  minGel?: number
  maxGel?: number
  rooms?: number
  layout?: PropertyLayout[]
  condition?: PropertyCondition[]
  repair?: PropertyRepair[]
  heating?: PropertyHeating[]
  readiness?: PropertyReadiness[]
  features?: PropertyFeature[]
  sort?: PropertySort
}
