import type { PropertyFilterParams } from './types'

/** Builds catalog query string; multi-value filters use repeated keys (`city=A&city=B`). */
export function buildPropertyFilterQuery(params: PropertyFilterParams): string {
  const sp = new URLSearchParams()
  for (const city of params.city ?? []) {
    sp.append('city', city)
  }
  if (params.district) sp.set('district', params.district)
  if (params.minUsd != null) sp.set('minUsd', String(params.minUsd))
  if (params.maxUsd != null) sp.set('maxUsd', String(params.maxUsd))
  if (params.minGel != null) sp.set('minGel', String(params.minGel))
  if (params.maxGel != null) sp.set('maxGel', String(params.maxGel))
  if (params.rooms != null) sp.set('rooms', String(params.rooms))
  if (params.features?.length) sp.set('features', params.features.join(','))
  for (const layout of params.layout ?? []) {
    sp.append('layout', layout)
  }
  for (const condition of params.condition ?? []) {
    sp.append('condition', condition)
  }
  for (const repair of params.repair ?? []) {
    sp.append('repair', repair)
  }
  for (const heating of params.heating ?? []) {
    sp.append('heating', heating)
  }
  for (const readiness of params.readiness ?? []) {
    sp.append('readiness', readiness)
  }
  if (params.sort && params.sort !== 'updatedAt-desc') sp.set('sort', params.sort)
  return sp.toString()
}
