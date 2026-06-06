import type { Block } from 'payload'

import { DEFAULT_ZOOM, ZOOM_MAX, ZOOM_MIN } from '@/lib/maps/constants'

export const MapBlock: Block = {
  slug: 'mapBlock',
  interfaceName: 'MapBlock',
  labels: {
    singular: 'Карта',
    plural: 'Карты',
  },
  fields: [
    {
      name: 'layoutVariant',
      type: 'select',
      defaultValue: 'textAndMap',
      required: true,
      label: 'Компоновка',
      options: [
        { label: 'Только карта', value: 'mapOnly' },
        { label: 'Текст и карта', value: 'textAndMap' },
      ],
    },
    {
      name: 'location',
      type: 'group',
      label: 'Местоположение',
      fields: [
        {
          name: 'lat',
          type: 'number',
          label: 'Широта (lat)',
          localized: false,
          admin: {
            step: 0.000001,
            description: 'От -90 до 90. Можно указать на карте ниже.',
          },
        },
        {
          name: 'lng',
          type: 'number',
          label: 'Долгота (lng)',
          localized: false,
          admin: {
            step: 0.000001,
            description: 'От -180 до 180. Можно указать на карте ниже.',
          },
        },
        {
          name: 'zoom',
          type: 'number',
          label: 'Масштаб',
          localized: false,
          defaultValue: DEFAULT_ZOOM,
          min: ZOOM_MIN,
          max: ZOOM_MAX,
          admin: {
            description: `Начальный zoom (${ZOOM_MIN}–${ZOOM_MAX}). По умолчанию ${DEFAULT_ZOOM}.`,
          },
        },
        {
          name: 'mapPicker',
          type: 'ui',
          admin: {
            components: {
              Field: '@/blocks/MapBlock/fields/MapPointPicker#MapPointPicker',
            },
          },
        },
      ],
    },
    {
      name: 'title',
      type: 'text',
      localized: true,
      label: 'Заголовок',
      admin: {
        description: 'Например, название города. Отображается как h2.',
      },
    },
    {
      name: 'address',
      type: 'textarea',
      localized: true,
      label: 'Адрес',
    },
    {
      name: 'phone',
      type: 'text',
      localized: true,
      label: 'Телефон',
    },
    {
      name: 'markerLabel',
      type: 'text',
      localized: true,
      label: 'Подпись маркера (доступность)',
      admin: {
        description: 'Для скринридеров. Если пусто — используется заголовок или адрес.',
      },
    },
    {
      name: 'quickContacts',
      type: 'array',
      label: 'Быстрые контакты',
      localized: false,
      admin: {
        description: 'Иконки телефона, WhatsApp, Telegram под текстом.',
        initCollapsed: true,
      },
      fields: [
        {
          name: 'platform',
          type: 'select',
          required: true,
          options: [
            { label: 'Телефон', value: 'phone' },
            { label: 'WhatsApp', value: 'whatsapp' },
            { label: 'Telegram', value: 'telegram' },
          ],
        },
        {
          name: 'url',
          type: 'text',
          required: true,
          label: 'Ссылка',
          admin: {
            description: 'tel:+995..., https://wa.me/..., https://t.me/...',
          },
        },
      ],
    },
  ],
}
