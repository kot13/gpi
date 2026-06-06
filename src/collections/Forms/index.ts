import type { CollectionConfig } from 'payload'

import { slugField } from 'payload'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { revalidateForms, revalidateFormsDelete } from './hooks/revalidateForms'
import { validateSingleFooterForm } from './hooks/validateSingleFooterForm'

export const Forms: CollectionConfig<'forms'> = {
  slug: 'forms',
  labels: {
    singular: 'Форма',
    plural: 'Формы',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['title', 'slug', 'formType', 'placement', '_status', 'updatedAt'],
    useAsTitle: 'title',
    group: 'Forms',
  },
  defaultPopulate: {
    title: true,
    slug: true,
    privacyPage: true,
  },
  defaultSort: 'title',
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Контент',
          fields: [
            {
              name: 'title',
              type: 'text',
              localized: true,
              required: true,
              label: 'Заголовок',
            },
            {
              name: 'submitButtonLabel',
              type: 'text',
              localized: true,
              required: true,
              label: 'Текст кнопки',
            },
            {
              name: 'successMessage',
              type: 'text',
              localized: true,
              required: true,
              label: 'Сообщение об успехе',
            },
            {
              name: 'privacyLinkLabel',
              type: 'text',
              localized: true,
              label: 'Подпись ссылки на политику',
            },
          ],
        },
        {
          label: 'Настройки',
          fields: [
            {
              name: 'formType',
              type: 'select',
              required: true,
              defaultValue: 'consultation',
              options: [{ label: 'Заявка на консультацию', value: 'consultation' }],
              label: 'Тип формы',
              admin: {
                description: 'Шаблон полей на публичном сайте',
              },
            },
            {
              name: 'placement',
              type: 'select',
              required: true,
              defaultValue: 'none',
              options: [
                { label: 'Подвал сайта', value: 'footer' },
                { label: 'Не отображать', value: 'none' },
              ],
              label: 'Размещение',
            },
            {
              name: 'privacyPage',
              type: 'relationship',
              relationTo: 'pages',
              label: 'Страница политики конфиденциальности',
            },
          ],
        },
      ],
    },
    slugField({ fieldToUse: 'title' }),
  ],
  hooks: {
    beforeChange: [validateSingleFooterForm],
    afterChange: [revalidateForms],
    afterDelete: [revalidateFormsDelete],
  },
  versions: {
    drafts: {
      autosave: false,
    },
  },
}
