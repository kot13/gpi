'use client'

import { ChevronDown } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useCallback, useEffect, useId, useMemo, useRef, useState, useTransition } from 'react'

import type { Locale } from '@/lib/i18n/config'
import { getMessages } from '@/lib/i18n/getMessages'
import {
  PROPERTY_CITIES,
  PROPERTY_CONDITIONS,
  PROPERTY_HEATING,
  PROPERTY_LAYOUTS,
  PROPERTY_READINESS,
  PROPERTY_REPAIRS,
} from '@/lib/properties/dictionaries'
import {
  cityLabel,
  conditionLabel,
  heatingLabel,
  layoutLabel,
  readinessLabel,
  repairLabel,
} from '@/lib/properties/labels'
import { buildPropertyFilterQuery } from '@/lib/properties/filterQuery'
import { searchParamsToFilterRecord } from '@/lib/properties/filters'
import type {
  PropertyCity,
  PropertyCondition,
  PropertyHeating,
  PropertyLayout,
  PropertyReadiness,
  PropertyRepair,
  PropertySort,
} from '@/lib/properties/types'
import { cn } from '@/utilities/ui'

type Props = {
  locale: Locale
  districts: string[]
  className?: string
  basePath?: string
  presentation?: 'sidebar' | 'sheet'
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

type FilterFormState = {
  city: string[]
  district: string
  minUsd: string
  maxUsd: string
  rooms: string
  layout: string[]
  condition: string[]
  repair: string[]
  heating: string[]
  readiness: string[]
  sort: PropertySort
}

type MultiFilterKey = 'city' | 'layout' | 'condition' | 'repair' | 'heating' | 'readiness'

function parseFormState(searchParams: URLSearchParams): FilterFormState {
  const record = searchParamsToFilterRecord(searchParams)
  const get = (key: string) => {
    const v = record[key]
    return Array.isArray(v) ? v[0] ?? '' : v ?? ''
  }
  return {
    city: searchParams.getAll('city'),
    district: get('district'),
    minUsd: get('minUsd'),
    maxUsd: get('maxUsd'),
    rooms: get('rooms'),
    layout: searchParams.getAll('layout'),
    condition: searchParams.getAll('condition'),
    repair: searchParams.getAll('repair'),
    heating: searchParams.getAll('heating'),
    readiness: searchParams.getAll('readiness'),
    sort: (get('sort') || 'updatedAt-desc') as PropertySort,
  }
}

function countActiveFilters(state: FilterFormState): number {
  let count = 0
  if (state.city.length) count += 1
  if (state.district) count += 1
  if (state.minUsd) count += 1
  if (state.maxUsd) count += 1
  if (state.rooms) count += 1
  if (state.layout.length) count += 1
  if (state.condition.length) count += 1
  if (state.repair.length) count += 1
  if (state.heating.length) count += 1
  if (state.readiness.length) count += 1
  if (state.sort !== 'updatedAt-desc') count += 1
  return count
}

function hasActiveFilters(state: FilterFormState): boolean {
  return countActiveFilters(state) > 0
}

const inputClass =
  'w-full min-h-11 px-3 rounded-md border border-gpi-border bg-gpi-bg text-gpi-text text-sm'

type MultiFilterProps<T extends string> = {
  legend: string
  options: readonly T[]
  selected: string[]
  label: (value: T) => string
  onToggle: (value: T) => void
  placeholder: string
}

function FilterMultiSelectDropdown<T extends string>({
  legend,
  options,
  selected,
  label,
  onToggle,
  placeholder,
}: MultiFilterProps<T>) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const labelId = useId()

  const summaryText = useMemo(() => {
    if (!selected.length) return placeholder
    return selected.map((v) => label(v as T)).join(', ')
  }, [label, placeholder, selected])

  useEffect(() => {
    if (!open) return
    const onPointerDown = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  return (
    <div ref={rootRef} className="relative text-sm">
      <span id={labelId} className="text-gpi-muted mb-1 block">
        {legend}
      </span>
      <button
        type="button"
        className={cn(inputClass, 'flex items-center justify-between gap-2 text-left')}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-labelledby={labelId}
        onClick={() => setOpen((isOpen) => !isOpen)}
      >
        <span className={cn('truncate', !selected.length && 'text-gpi-muted')}>{summaryText}</span>
        <ChevronDown
          aria-hidden
          className={cn('h-4 w-4 shrink-0 text-gpi-muted transition-transform', open && 'rotate-180')}
        />
      </button>
      {open && (
        <div
          role="listbox"
          aria-multiselectable
          aria-labelledby={labelId}
          className="absolute z-30 mt-1 w-full max-h-60 overflow-y-auto rounded-md border border-gpi-border bg-gpi-bg py-1 shadow-md"
        >
          {options.map((value) => {
            const optionId = `${labelId}-${value}`
            const isSelected = selected.includes(value)
            return (
              <label
                key={value}
                htmlFor={optionId}
                role="option"
                aria-selected={isSelected}
                className="flex items-center gap-2 min-h-11 cursor-pointer px-3 hover:bg-gpi-border/30"
              >
                <input
                  id={optionId}
                  type="checkbox"
                  className="h-4 w-4 shrink-0 rounded border-gpi-border accent-gpi-brand"
                  checked={isSelected}
                  onChange={() => onToggle(value)}
                />
                <span className="text-gpi-text">{label(value)}</span>
              </label>
            )
          })}
        </div>
      )}
    </div>
  )
}

export function PropertyFilters({
  locale,
  districts,
  className,
  basePath,
  presentation = 'sidebar',
  open = false,
  onOpenChange,
}: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const t = getMessages(locale)
  const p = t.properties

  const pathBase = basePath ?? `/${locale}/properties`

  const current = useMemo(() => parseFormState(searchParams), [searchParams])

  const [mobileOpen, setMobileOpen] = useState(() => hasActiveFilters(current))
  const activeCount = countActiveFilters(current)

  const apply = useCallback(
    (updates: Partial<FilterFormState>) => {
      const next = { ...current, ...updates }
      const query = buildPropertyFilterQuery({
        city: next.city as PropertyCity[],
        district: next.district,
        minUsd: next.minUsd ? Number(next.minUsd) : undefined,
        maxUsd: next.maxUsd ? Number(next.maxUsd) : undefined,
        rooms: next.rooms ? Number(next.rooms) : undefined,
        layout: next.layout as PropertyLayout[],
        condition: next.condition as PropertyCondition[],
        repair: next.repair as PropertyRepair[],
        heating: next.heating as PropertyHeating[],
        readiness: next.readiness as PropertyReadiness[],
        sort: next.sort,
      })
      startTransition(() => {
        router.replace(`${pathBase}${query ? `?${query}` : ''}`, { scroll: false })
      })
    },
    [current, pathBase, router],
  )

  const toggleInList = useCallback(
    (key: MultiFilterKey, value: string) => {
      const list = current[key]
      const next = list.includes(value) ? list.filter((v) => v !== value) : [...list, value]
      apply({ [key]: next })
    },
    [apply, current],
  )

  const panelId = 'property-filters-panel'
  const filterPlaceholder = p?.filterAll ?? '—'

  const filterFields = (
    <div id={panelId} className="space-y-4">
        <FilterMultiSelectDropdown
          legend={p?.filterCity ?? 'City'}
          options={PROPERTY_CITIES}
          selected={current.city}
          label={(city) => cityLabel(locale, city)}
          onToggle={(city) => toggleInList('city', city)}
          placeholder={filterPlaceholder}
        />

        <label className="block text-sm">
          <span className="text-gpi-muted mb-1 block">{p?.filterDistrict}</span>
          <input
            list="property-districts"
            className={inputClass}
            value={current.district}
            onChange={(e) => apply({ district: e.target.value })}
          />
          <datalist id="property-districts">
            {districts.map((d) => (
              <option key={d} value={d} />
            ))}
          </datalist>
        </label>

        <div className="grid grid-cols-2 gap-2">
          <label className="block text-sm">
            <span className="text-gpi-muted mb-1 block">{p?.filterMinUsd}</span>
            <input
              type="number"
              className={inputClass}
              value={current.minUsd}
              onChange={(e) => apply({ minUsd: e.target.value })}
            />
          </label>
          <label className="block text-sm">
            <span className="text-gpi-muted mb-1 block">{p?.filterMaxUsd}</span>
            <input
              type="number"
              className={inputClass}
              value={current.maxUsd}
              onChange={(e) => apply({ maxUsd: e.target.value })}
            />
          </label>
        </div>

        <label className="block text-sm">
          <span className="text-gpi-muted mb-1 block">{p?.filterRooms}</span>
          <input
            type="number"
            min={0}
            className={inputClass}
            value={current.rooms}
            onChange={(e) => apply({ rooms: e.target.value })}
          />
        </label>

        <FilterMultiSelectDropdown
          legend={p?.filterLayout ?? 'Layout'}
          options={PROPERTY_LAYOUTS}
          selected={current.layout}
          label={(layout) => layoutLabel(locale, layout)}
          onToggle={(layout) => toggleInList('layout', layout)}
          placeholder={filterPlaceholder}
        />

        <FilterMultiSelectDropdown
          legend={p?.filterCondition ?? 'Condition'}
          options={PROPERTY_CONDITIONS}
          selected={current.condition}
          label={(c) => conditionLabel(locale, c)}
          onToggle={(c) => toggleInList('condition', c)}
          placeholder={filterPlaceholder}
        />

        <FilterMultiSelectDropdown
          legend={p?.filterRepair ?? 'Repair'}
          options={PROPERTY_REPAIRS}
          selected={current.repair}
          label={(repair) => repairLabel(locale, repair)}
          onToggle={(repair) => toggleInList('repair', repair)}
          placeholder={filterPlaceholder}
        />

        <FilterMultiSelectDropdown
          legend={p?.filterHeating ?? 'Heating'}
          options={PROPERTY_HEATING}
          selected={current.heating}
          label={(heating) => heatingLabel(locale, heating)}
          onToggle={(heating) => toggleInList('heating', heating)}
          placeholder={filterPlaceholder}
        />

        <FilterMultiSelectDropdown
          legend={p?.filterReadiness ?? 'Readiness'}
          options={PROPERTY_READINESS}
          selected={current.readiness}
          label={(readiness) => readinessLabel(locale, readiness)}
          onToggle={(readiness) => toggleInList('readiness', readiness)}
          placeholder={filterPlaceholder}
        />

        <label className="block text-sm">
          <span className="text-gpi-muted mb-1 block">{p?.sortLabel}</span>
          <div className="relative">
            <select
              className={cn(inputClass, 'appearance-none pr-10')}
              value={current.sort}
              onChange={(e) => apply({ sort: e.target.value as PropertySort })}
            >
              <option value="updatedAt-desc">{p?.sortUpdatedDesc}</option>
              <option value="priceUsd-asc">{p?.sortPriceAsc}</option>
              <option value="priceUsd-desc">{p?.sortPriceDesc}</option>
            </select>
            <ChevronDown
              aria-hidden
              className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gpi-muted"
            />
          </div>
        </label>

        <button
          type="button"
          className="w-full min-h-11 rounded-md border border-gpi-border text-gpi-text font-medium"
          onClick={() =>
            startTransition(() => router.replace(pathBase, { scroll: false }))
          }
        >
          {p?.filterReset}
        </button>
    </div>
  )

  if (presentation === 'sheet') {
    if (!open) return null

    return (
      <div className="fixed inset-0 z-[2000] flex justify-end" aria-busy={isPending}>
        <button
          type="button"
          className="absolute inset-0 bg-black/40"
          aria-label={p?.filtersHide}
          onClick={() => onOpenChange?.(false)}
        />
        <aside
          className="relative h-full w-full max-w-md overflow-y-auto bg-gpi-bg p-4 shadow-xl"
          aria-label={p?.filtersTitle}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold font-gpi-heading text-gpi-text">
              {p?.filtersTitle}
            </h2>
            <button
              type="button"
              className="min-h-11 min-w-11 rounded-md border border-gpi-border"
              onClick={() => onOpenChange?.(false)}
            >
              ×
            </button>
          </div>
          {filterFields}
        </aside>
      </div>
    )
  }

  return (
    <aside className={cn(className)} aria-label={p?.filtersTitle} aria-busy={isPending}>
      <button
        type="button"
        className="lg:hidden flex w-full min-h-11 items-center justify-between gap-3 rounded-md border border-gpi-border bg-gpi-bg px-3 text-left"
        aria-expanded={mobileOpen}
        aria-controls={panelId}
        onClick={() => setMobileOpen((isOpen) => !isOpen)}
      >
        <span className="flex min-w-0 items-center gap-2">
          <span className="text-lg font-semibold font-gpi-heading text-gpi-text truncate">
            {p?.filtersTitle}
          </span>
          {activeCount > 0 && (
            <span className="shrink-0 rounded-full bg-gpi-brand px-2 py-0.5 text-xs font-medium text-white">
              {activeCount}
            </span>
          )}
        </span>
        <ChevronDown
          aria-hidden
          className={cn('h-5 w-5 shrink-0 text-gpi-muted transition-transform', mobileOpen && 'rotate-180')}
        />
        <span className="sr-only">{mobileOpen ? p?.filtersHide : p?.filtersShow}</span>
      </button>

      <h2 className="hidden lg:block text-lg font-semibold font-gpi-heading text-gpi-text mb-4">
        {p?.filtersTitle}
      </h2>

      <div className={cn(mobileOpen ? 'block' : 'hidden', 'lg:block')}>{filterFields}</div>
    </aside>
  )
}
