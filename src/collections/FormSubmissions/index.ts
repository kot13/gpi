import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { CONTACT_METHODS } from '@/lib/forms/types'
import { LOCALES } from '@/lib/i18n/config'

import { normalizeSubmission } from './hooks/normalizeSubmission'
import { rejectSpam } from './hooks/rejectSpam'

export const FormSubmissions: CollectionConfig<'form-submissions'> = {
  slug: 'form-submissions',
  labels: {
    singular: 'Заявка',
    plural: 'Заявки',
  },
  access: {
    create: () => true,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  defaultSort: '-submittedAt',
  admin: {
    defaultColumns: ['submittedAt', 'name', 'contactMethod', 'contactDisplay', 'locale', 'status'],
    useAsTitle: 'name',
    group: 'Forms',
    listSearchableFields: ['name', 'contactDisplay', 'contactValue'],
  },
  fields: [
    {
      name: 'form',
      type: 'relationship',
      relationTo: 'forms',
      required: true,
      label: 'Форма',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'name',
      type: 'text',
      required: true,
      maxLength: 120,
      label: 'Имя',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'contactMethod',
      type: 'select',
      required: true,
      options: CONTACT_METHODS.map((value) => ({ label: value, value })),
      label: 'Способ связи',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'countryCode',
      type: 'text',
      label: 'Код страны',
      admin: {
        readOnly: true,
        condition: (_, siblingData) =>
          siblingData?.contactMethod === 'phone'
          || siblingData?.contactMethod === 'whatsapp'
          || siblingData?.contactMethod === 'viber',
      },
    },
    {
      name: 'dialCode',
      type: 'text',
      label: 'Телефонный код',
      admin: {
        readOnly: true,
        condition: (_, siblingData) =>
          siblingData?.contactMethod === 'phone'
          || siblingData?.contactMethod === 'whatsapp'
          || siblingData?.contactMethod === 'viber',
      },
    },
    {
      name: 'contactValue',
      type: 'text',
      required: true,
      label: 'Контакт',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'contactDisplay',
      type: 'text',
      label: 'Контакт (отображение)',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'locale',
      type: 'select',
      required: true,
      options: LOCALES.map((value) => ({ label: value, value })),
      label: 'Локаль',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'new',
      options: [
        { label: 'Новая', value: 'new' },
        { label: 'Обработана', value: 'processed' },
      ],
      label: 'Статус',
      admin: {
        components: {
          Cell: '@/collections/FormSubmissions/StatusCell#StatusCell',
        },
      },
    },
    {
      name: 'submittedAt',
      type: 'date',
      required: true,
      label: 'Дата отправки',
      admin: {
        readOnly: true,
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'honeypot',
      type: 'text',
      label: 'Honeypot',
      admin: {
        hidden: true,
      },
    },
  ],
  hooks: {
    beforeValidate: [rejectSpam, normalizeSubmission],
  },
}
