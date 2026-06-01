import type {
  PropertyCity,
  PropertyCondition,
  PropertyFeature,
  PropertyHeating,
  PropertyLayout,
  PropertyReadiness,
  PropertyRepair,
} from './types'

/** i18n key suffix under `properties.dict.*` */
export const CITY_KEYS: Record<PropertyCity, string> = {
  Tbilisi: 'city.Tbilisi',
  Batumi: 'city.Batumi',
}

export const CONDITION_KEYS: Record<PropertyCondition, string> = {
  renovated: 'condition.renovated',
  new: 'condition.new',
  good: 'condition.good',
  premium: 'condition.premium',
}

export const REPAIR_KEYS: Record<PropertyRepair, string> = {
  renovated: 'repair.renovated',
  white_frame: 'repair.white_frame',
  black_frame: 'repair.black_frame',
  unknown: 'repair.unknown',
}

export const LAYOUT_KEYS: Record<PropertyLayout, string> = {
  studio: 'layout.studio',
  '1+1': 'layout.1+1',
  '2+1': 'layout.2+1',
  '3+1': 'layout.3+1',
  '4plus': 'layout.4plus',
}

export const HEATING_KEYS: Record<PropertyHeating, string> = {
  gas: 'heating.gas',
  electric: 'heating.electric',
  unknown: 'heating.unknown',
}

export const READINESS_KEYS: Record<PropertyReadiness, string> = {
  ready: 'readiness.ready',
  building: 'readiness.building',
  unknown: 'readiness.unknown',
}

export const FEATURE_KEYS: Record<PropertyFeature, string> = {
  balcony: 'feature.balcony',
  elevator: 'feature.elevator',
  parking: 'feature.parking',
  sea_view: 'feature.sea_view',
  mountain_view: 'feature.mountain_view',
  city_view: 'feature.city_view',
  new_building: 'feature.new_building',
  renovated: 'feature.renovated',
  furnished: 'feature.furnished',
  near_metro: 'feature.near_metro',
  terrace: 'feature.terrace',
  old_town: 'feature.old_town',
  central_heating: 'feature.central_heating',
  boulevard: 'feature.boulevard',
  pool: 'feature.pool',
}

export const PROPERTY_CITIES = Object.keys(CITY_KEYS) as PropertyCity[]
export const PROPERTY_CONDITIONS = Object.keys(CONDITION_KEYS) as PropertyCondition[]
export const PROPERTY_REPAIRS = Object.keys(REPAIR_KEYS) as PropertyRepair[]
export const PROPERTY_LAYOUTS = Object.keys(LAYOUT_KEYS) as PropertyLayout[]
export const PROPERTY_HEATING = Object.keys(HEATING_KEYS) as PropertyHeating[]
export const PROPERTY_READINESS = Object.keys(READINESS_KEYS) as PropertyReadiness[]
export const PROPERTY_FEATURES = Object.keys(FEATURE_KEYS) as PropertyFeature[]
