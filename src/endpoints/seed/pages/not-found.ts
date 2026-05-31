import type { RequiredDataFromCollectionSlug } from 'payload'

import { lexicalHeading, lexicalParagraph, lexicalRoot } from '../lexical'
import { minimalPlaceholderLayout } from './minimalLayout'

export const notFoundPage = (): RequiredDataFromCollectionSlug<'pages'> => ({
  slug: '404',
  title: 'Страница не найдена',
  _status: 'published',
  hero: {
    type: 'lowImpact',
    links: [
      {
        link: {
          type: 'custom',
          label: 'На главную',
          url: '/ru',
          appearance: 'default',
        },
      },
    ],
    richText: lexicalRoot([
      lexicalHeading('404'),
      lexicalParagraph('Страница не найдена'),
    ]),
  },
  layout: minimalPlaceholderLayout(),
})
