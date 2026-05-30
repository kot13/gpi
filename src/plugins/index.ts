import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { Plugin } from 'payload'
import { revalidateRedirects } from '@/hooks/revalidateRedirects'
import { GenerateTitle, GenerateURL } from '@payloadcms/plugin-seo/types'

import { Page, Post } from '@/payload-types'
import { getServerSideURL } from '@/utilities/getURL'

const generateTitle: GenerateTitle<Post | Page> = ({ doc }) => {
  return doc?.title ? `${doc.title} | GPI` : 'GPI — Georgia Private Investment'
}

const generateURL: GenerateURL<Post | Page> = ({ doc, locale }) => {
  const url = getServerSideURL()
  const loc = locale || 'ru'
  if (!doc?.slug) return `${url}/${loc}`
  if ('heroImage' in doc || doc.slug === 'home') {
    // posts vs pages heuristic handled by collection in caller
  }
  return `${url}/${loc}/${doc.slug}`
}

export const plugins: Plugin[] = [
  redirectsPlugin({
    collections: ['pages', 'posts'],
    overrides: {
      hooks: {
        afterChange: [revalidateRedirects],
      },
    },
  }),
  nestedDocsPlugin({
    collections: ['categories'],
    generateURL: (docs) => docs.reduce((url, doc) => `${url}/${doc.slug}`, ''),
  }),
  seoPlugin({
    generateTitle,
    generateURL,
  }),
]
