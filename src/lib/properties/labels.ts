import type { Locale } from '@/lib/i18n/config'
import { getMessages } from '@/lib/i18n/getMessages'

import {
  CITY_KEYS,
  CONDITION_KEYS,
  FEATURE_KEYS,
  HEATING_KEYS,
  LAYOUT_KEYS,
  READINESS_KEYS,
  REPAIR_KEYS,
} from './dictionaries'
import type {
  PropertyCity,
  PropertyCondition,
  PropertyFeature,
  PropertyHeating,
  PropertyLayout,
  PropertyReadiness,
  PropertyRepair,
} from './types'

type Messages = ReturnType<typeof getMessages> & {
  properties?: {
    dict?: Record<string, string>
  }
}

function dictLabel(locale: Locale, key: string): string {
  const messages = getMessages(locale) as Messages
  const dict = messages.properties?.dict
  return dict?.[key] ?? key
}

export function cityLabel(locale: Locale, city: PropertyCity): string {
  return dictLabel(locale, CITY_KEYS[city])
}

export function conditionLabel(locale: Locale, value: PropertyCondition): string {
  return dictLabel(locale, CONDITION_KEYS[value])
}

export function repairLabel(locale: Locale, value: PropertyRepair): string {
  return dictLabel(locale, REPAIR_KEYS[value])
}

export function layoutLabel(locale: Locale, value: PropertyLayout): string {
  return dictLabel(locale, LAYOUT_KEYS[value])
}

export function heatingLabel(locale: Locale, value: PropertyHeating): string {
  return dictLabel(locale, HEATING_KEYS[value])
}

export function readinessLabel(locale: Locale, value: PropertyReadiness): string {
  return dictLabel(locale, READINESS_KEYS[value])
}

export function featureLabel(locale: Locale, value: PropertyFeature): string {
  return dictLabel(locale, FEATURE_KEYS[value])
}
