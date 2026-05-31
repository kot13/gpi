import type { Field } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { link } from '@/fields/link'
import { linkGroup } from '@/fields/linkGroup'

const heroTypeCondition =
  (types: string[]) =>
  (_: unknown, { type }: { type?: string } = {}) =>
    types.includes(type ?? '')

export const hero: Field = {
  name: 'hero',
  type: 'group',
  localized: true,
  fields: [
    {
      name: 'type',
      type: 'select',
      defaultValue: 'lowImpact',
      label: 'Тип hero',
      options: [
        { label: 'Нет', value: 'none' },
        { label: 'High Impact', value: 'highImpact' },
        { label: 'Medium Impact', value: 'mediumImpact' },
        { label: 'Low Impact', value: 'lowImpact' },
        { label: 'Слайдшоу', value: 'slideshow' },
      ],
      required: true,
    },
    {
      name: 'richText',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ]
        },
      }),
      label: false,
      admin: {
        condition: heroTypeCondition(['highImpact', 'mediumImpact', 'lowImpact']),
      },
    },
    linkGroup({
      overrides: {
        maxRows: 2,
        admin: {
          condition: heroTypeCondition(['highImpact', 'mediumImpact', 'lowImpact']),
        },
      },
    }),
    {
      name: 'media',
      type: 'upload',
      admin: {
        condition: heroTypeCondition(['highImpact', 'mediumImpact']),
      },
      relationTo: 'media',
      required: true,
    },
    {
      name: 'slides',
      type: 'array',
      label: 'Слайды',
      minRows: 1,
      maxRows: 10,
      admin: {
        condition: heroTypeCondition(['slideshow']),
        description: 'От 1 до 10 слайдов. Навигация и автопрокрутка — при 2+ слайдах.',
        initCollapsed: false,
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Изображение',
        },
        {
          name: 'title',
          type: 'text',
          required: true,
          localized: true,
          label: 'Заголовок',
        },
        {
          name: 'subtitle',
          type: 'text',
          required: true,
          localized: true,
          label: 'Подзаголовок',
        },
        link({
          appearances: false,
          disableLabel: true,
          overrides: {
            label: 'Ссылка',
          },
        }),
        {
          name: 'buttonLabel',
          type: 'text',
          required: true,
          localized: true,
          label: 'Текст кнопки',
        },
      ],
    },
  ],
  label: false,
}
