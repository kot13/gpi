import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateHeader } from './hooks/revalidateHeader'

export const Header: GlobalConfig = {
  slug: 'header',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'navItems',
      type: 'array',
      fields: [
        link({
          appearances: false,
        }),
      ],
      maxRows: 12,
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/Header/RowLabel#RowLabel',
        },
      },
    },
    {
      name: 'socialLinks',
      type: 'array',
      label: 'Social Links',
      fields: [
        {
          name: 'platform',
          type: 'select',
          required: true,
          options: [
            { label: 'WhatsApp', value: 'whatsapp' },
            { label: 'Telegram', value: 'telegram' },
            { label: 'VK', value: 'vk' },
            { label: 'Viber', value: 'viber' },
            { label: 'Messenger', value: 'messenger' },
          ],
        },
        {
          name: 'url',
          type: 'text',
          required: true,
        },
        {
          name: 'order',
          type: 'number',
          required: true,
          defaultValue: 0,
        },
      ],
      admin: {
        initCollapsed: true,
      },
    },
  ],
  hooks: {
    afterChange: [revalidateHeader],
  },
}
