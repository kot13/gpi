import type { CollectionConfig } from 'payload'

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublishedActive } from '../../access/authenticatedOrPublishedActive'
import { validatePropertyPublish } from '@/hooks/validatePropertyPublish'
import {
  PROPERTY_CITIES,
  PROPERTY_CONDITIONS,
  PROPERTY_FEATURES,
  PROPERTY_HEATING,
  PROPERTY_LAYOUTS,
  PROPERTY_READINESS,
  PROPERTY_REPAIRS,
} from '@/lib/properties/dictionaries'

import { revalidateProperty, revalidatePropertyDelete } from './hooks/revalidateProperty'

const cityAdminLabels: Record<string, string> = {
  Tbilisi: 'Тбилиси',
  Batumi: 'Батуми',
}

const conditionAdminLabels: Record<string, string> = {
  renovated: 'С ремонтом',
  new: 'Новостройка',
  good: 'Хорошее состояние',
  premium: 'Премиум',
}

const repairAdminLabels: Record<string, string> = {
  renovated: 'С ремонтом',
  white_frame: 'Белый каркас',
  black_frame: 'Чёрный каркас',
  unknown: 'Уточняется',
}

const layoutAdminLabels: Record<string, string> = {
  studio: 'Студия',
  '1+1': '1+1',
  '2+1': '2+1',
  '3+1': '3+1',
  '4plus': '4 и более',
}

const heatingAdminLabels: Record<string, string> = {
  gas: 'Газовое',
  electric: 'Электрическое',
  unknown: 'Неизвестно',
}

const readinessAdminLabels: Record<string, string> = {
  ready: 'Готовая',
  building: 'Строится',
  unknown: 'Уточняется',
}

const featureAdminLabels: Record<string, string> = {
  balcony: 'Балкон',
  elevator: 'Лифт',
  parking: 'Паркинг',
  sea_view: 'Вид на море',
  mountain_view: 'Вид на горы',
  city_view: 'Вид на город',
  new_building: 'Новостройка',
  renovated: 'Ремонт',
  furnished: 'Мебель',
  near_metro: 'Рядом метро',
  terrace: 'Терраса',
  old_town: 'Старый город',
  central_heating: 'Отопление',
  boulevard: 'Бульвар',
  pool: 'Бассейн',
}

function optionsFrom(
  values: readonly string[],
  labels: Record<string, string>,
): { label: string; value: string }[] {
  return values.map((value) => ({ label: labels[value] ?? value, value }))
}

export const Properties: CollectionConfig<'properties'> = {
  slug: 'properties',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublishedActive,
    update: authenticated,
  },
  admin: {
    group: 'Properties',
    useAsTitle: 'title',
    defaultColumns: ['objectCode', 'title', 'city', 'listingStatus', 'listingDate'],
    preview: (data, { req }) => {
      const code = data?.objectCode as string | undefined
      if (!code) return null
      const locale = req.locale || 'ru'
      return `/${locale}/properties/${encodeURIComponent(code)}`
    },
    livePreview: {
      url: ({ data, req }) => {
        const code = data?.objectCode as string | undefined
        if (!code) return null
        const locale = req.locale || 'ru'
        return `/${locale}/properties/${encodeURIComponent(code)}`
      },
    },
  },
  defaultPopulate: {
    title: true,
    objectCode: true,
    city: true,
    priceUsd: true,
    priceGel: true,
    photos: true,
    meta: true,
  },
  fields: [
    {
      name: 'objectCode',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      label: 'Код объекта',
      admin: {
        description: 'Уникальный идентификатор для URL (например, 1037)',
      },
    },
    {
      name: 'listingStatus',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      label: 'Статус в каталоге',
      options: [
        { label: 'Черновик', value: 'draft' },
        { label: 'Активен', value: 'active' },
        { label: 'Неактивен', value: 'inactive' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Основное',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
              localized: true,
              label: 'Заголовок',
            },
            {
              name: 'description',
              type: 'textarea',
              required: true,
              localized: true,
              label: 'Описание',
            },
            {
              name: 'listingDate',
              type: 'date',
              label: 'Дата актуализации',
              admin: {
                date: {
                  pickerAppearance: 'dayOnly',
                  displayFormat: 'd MMM yyyy',
                },
                description: 'Дата на сайте (не путать с автоматическим updatedAt документа)',
              },
            },
          ],
        },
        {
          label: 'Локация',
          fields: [
            {
              name: 'city',
              type: 'select',
              required: true,
              label: 'Город',
              options: optionsFrom(PROPERTY_CITIES, cityAdminLabels),
            },
            { name: 'district', type: 'text', label: 'Район' },
            { name: 'street', type: 'text', label: 'Адрес' },
            { name: 'lat', type: 'number', label: 'Широта (lat)' },
            { name: 'lng', type: 'number', label: 'Долгота (lng)' },
          ],
        },
        {
          label: 'Характеристики',
          fields: [
            { name: 'priceUsd', type: 'number', required: true, label: 'Цена USD', min: 0 },
            { name: 'priceGel', type: 'number', required: true, label: 'Цена GEL', min: 0 },
            { name: 'area', type: 'number', required: true, label: 'Площадь, м²', min: 0 },
            { name: 'rooms', type: 'number', required: true, label: 'Комнат', min: 0 },
            { name: 'floor', type: 'number', label: 'Этаж' },
            { name: 'totalFloors', type: 'number', label: 'Этажей в доме' },
            {
              name: 'condition',
              type: 'select',
              label: 'Состояние',
              options: optionsFrom(PROPERTY_CONDITIONS, conditionAdminLabels),
            },
            {
              name: 'repair',
              type: 'select',
              label: 'Ремонт',
              options: optionsFrom(PROPERTY_REPAIRS, repairAdminLabels),
            },
            {
              name: 'layout',
              type: 'select',
              label: 'Планировка',
              options: optionsFrom(PROPERTY_LAYOUTS, layoutAdminLabels),
            },
            {
              name: 'heating',
              type: 'select',
              label: 'Отопление',
              options: optionsFrom(PROPERTY_HEATING, heatingAdminLabels),
            },
            {
              name: 'readiness',
              type: 'select',
              label: 'Готовность',
              options: optionsFrom(PROPERTY_READINESS, readinessAdminLabels),
            },
            { name: 'buildingType', type: 'text', label: 'Тип здания / ЖК' },
            {
              name: 'features',
              type: 'select',
              hasMany: true,
              label: 'Особенности',
              options: optionsFrom(PROPERTY_FEATURES, featureAdminLabels),
            },
          ],
        },
        {
          label: 'Медиа и ссылки',
          fields: [
            {
              name: 'photos',
              type: 'array',
              label: 'Фотографии',
              labels: { singular: 'Фото', plural: 'Фотографии' },
              admin: {
                description: 'Загрузите изображения в медиатеку. Порядок = порядок в галерее.',
              },
              fields: [
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                  label: 'Изображение',
                },
              ],
            },
            { name: 'telegramUrl', type: 'text', label: 'Telegram URL' },
            { name: 'crmUrl', type: 'text', label: 'CRM URL' },
            { name: 'driveFolderUrl', type: 'text', label: 'Папка с материалами (Drive)' },
          ],
        },
        {
          name: 'meta',
          label: 'SEO',
          fields: [
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            MetaTitleField({ hasGenerateFn: true }),
            MetaImageField({ relationTo: 'media' }),
            MetaDescriptionField({}),
            PreviewField({
              hasGenerateFn: true,
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
        },
      ],
    },
  ],
  hooks: {
    beforeChange: [validatePropertyPublish],
    afterChange: [revalidateProperty],
    afterDelete: [revalidatePropertyDelete],
  },
  versions: {
    drafts: {
      autosave: { interval: 100 },
    },
    maxPerDoc: 50,
  },
}
