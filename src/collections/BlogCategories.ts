import type { CollectionAfterDeleteHook, CollectionBeforeChangeHook, CollectionConfig } from 'payload'
import { slugField } from 'payload'

import { slugify } from '@/hooks/slugify'
import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

const normalizeCategorySlug: CollectionBeforeChangeHook = ({ data }) => {
  if (data?.slug && typeof data.slug === 'string') {
    data.slug = slugify(data.slug)
  }
  return data
}

const nullifyPostsOnCategoryDelete: CollectionAfterDeleteHook = async ({ doc, req }) => {
  if (!doc?.id) return doc

  const posts = await req.payload.find({
    collection: 'posts',
    where: { category: { equals: doc.id } },
    limit: 1000,
    pagination: false,
    depth: 0,
  })

  await Promise.all(
    posts.docs.map((post) =>
      req.payload.update({
        collection: 'posts',
        id: post.id,
        data: { category: null },
        depth: 0,
        context: { disableRevalidate: true },
      }),
    ),
  )

  return doc
}

export const BlogCategories: CollectionConfig = {
  slug: 'categories',
  labels: {
    singular: 'Blog Category',
    plural: 'Blog Categories',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'title',
    group: 'Blog',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    slugField({
      position: undefined,
    }),
  ],
  hooks: {
    beforeChange: [normalizeCategorySlug],
    afterDelete: [nullifyPostsOnCategoryDelete],
  },
}
