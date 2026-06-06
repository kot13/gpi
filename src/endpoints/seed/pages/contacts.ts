import type { RequiredDataFromCollectionSlug } from 'payload'

import { lexicalHeading, lexicalParagraph, lexicalRoot } from '../lexical'
import { buildMapBlock } from './mapBlocks'

export const contactsPage = (): RequiredDataFromCollectionSlug<'pages'> => ({
  slug: 'contacts',
  title: 'Контакты',
  _status: 'published',
  hero: {
    type: 'lowImpact',
    richText: lexicalRoot([
      lexicalHeading('Мы работаем с объектами недвижимости по всей Грузии'),
      lexicalParagraph('Офисы GPI в Батуми и Тбилиси.'),
    ]),
  },
  layout: [
    buildMapBlock({
      title: 'Батуми',
      address: 'ул. Селима Химшиашвили, 17',
      lat: 41.646,
      lng: 41.64,
    }),
    buildMapBlock({
      title: 'Тбилиси',
      address: 'Проспект Ильи Чавчавадзе, 47',
      lat: 41.71,
      lng: 44.75,
    }),
  ],
})
