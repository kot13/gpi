import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateFooter } from './hooks/revalidateFooter'

export const Footer: GlobalConfig = {
  slug: 'footer',
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
          RowLabel: '@/Footer/RowLabel#RowLabel',
        },
      },
    },
    {
      name: 'companyName',
      type: 'text',
      localized: true,
      label: 'Company Name',
    },
    {
      name: 'identificationNumber',
      type: 'text',
      label: 'Identification Number',
    },
    {
      name: 'address',
      type: 'textarea',
      localized: true,
      label: 'Address',
    },
    {
      name: 'copyrightText',
      type: 'text',
      localized: true,
      label: 'Copyright Text',
    },
  ],
  hooks: {
    afterChange: [revalidateFooter],
  },
}
