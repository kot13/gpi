import { readFile } from 'node:fs/promises'
import path from 'node:path'

import type { CollectionSlug, GlobalSlug, Payload, PayloadRequest, File } from 'payload'

import { home } from './home'
import { image1 } from './image-1'
import { image2 } from './image-2'
import { imageHero1 } from './image-hero-1'
import { post1 } from './post-1'
import { post2 } from './post-2'
import { post3 } from './post-3'
import { seedLocalizedContent } from './localized'
import { blogPage } from './pages/blog'
import { notFoundPage } from './pages/not-found'
import { contactsPage } from './pages/contacts'
import { privacyPolicyPage } from './pages/privacy-policy'
import { propertiesPage } from './pages/properties'
import { seedConsultationForm } from './forms'
import { seedPropertiesCatalog } from './properties'
import { seedPropertiesMapDensity } from './properties-map-density'

/** FK-safe order: children before parents */
const collections: CollectionSlug[] = [
  'form-submissions',
  'forms',
  'posts',
  'properties',
  'pages',
  'categories',
  'media',
]

const globals: GlobalSlug[] = ['header', 'footer']

const categories = ['Technology', 'News', 'Finance', 'Design', 'Software', 'Engineering']

const seedAssetsDir = path.join(process.cwd(), 'src/endpoints/seed')

// Next.js revalidation errors are normal when seeding the database without a server running
// i.e. running `yarn seed` locally instead of using the admin UI within an active app
// The app is not running to revalidate the pages and so the API routes are not available
// These error messages can be ignored: `Error hitting revalidate route for...`
export const seed = async ({
  payload,
  req,
}: {
  payload: Payload
  req: PayloadRequest
}): Promise<void> => {
  payload.logger.info('Seeding database...')

  // we need to clear the media directory before seeding
  // as well as the collections and globals
  // this is because while `yarn seed` drops the database
  // the custom `/api/seed` endpoint does not
  payload.logger.info(`— Clearing collections and globals...`)

  // clear the database
  await Promise.all(
    globals.map((global) =>
      payload.updateGlobal({
        slug: global,
        data: {
          navItems: [],
        },
        depth: 0,
        context: {
          disableRevalidate: true,
        },
      }),
    ),
  )

  const versionedCollections = collections.filter((collection) =>
    Boolean(payload.collections[collection]?.config.versions),
  )

  for (const collection of versionedCollections) {
    await payload.db.deleteVersions({ collection, req, where: {} })
  }

  for (const collection of collections) {
    await payload.db.deleteMany({ collection, req, where: {} })
  }

  payload.logger.info(`— Seeding demo author and user...`)

  await payload.delete({
    collection: 'users',
    depth: 0,
    where: {
      email: {
        equals: 'demo-author@example.com',
      },
    },
  })

  payload.logger.info(`— Seeding media...`)

  const [image1Buffer, image2Buffer, image3Buffer, hero1Buffer] = await Promise.all([
    readSeedAsset('image-post1.webp'),
    readSeedAsset('image-post2.webp'),
    readSeedAsset('image-post3.webp'),
    readSeedAsset('image-hero1.webp'),
  ])

  const [demoAuthor, image1Doc, image2Doc, image3Doc, imageHomeDoc] = await Promise.all([
    payload.create({
      collection: 'users',
      data: {
        name: 'Demo Author',
        email: 'demo-author@example.com',
        password: 'password',
      },
    }),
    payload.create({
      collection: 'media',
      data: image1,
      file: image1Buffer,
    }),
    payload.create({
      collection: 'media',
      data: image2,
      file: image2Buffer,
    }),
    payload.create({
      collection: 'media',
      data: image2,
      file: image3Buffer,
    }),
    payload.create({
      collection: 'media',
      data: imageHero1,
      file: hero1Buffer,
    }),
    ...categories.map((category) =>
      payload.create({
        collection: 'categories',
        data: {
          title: category,
          slug: category,
        },
      }),
    ),
  ])

  payload.logger.info(`— Seeding posts...`)

  // Do not create posts with `Promise.all` because we want the posts to be created in order
  // This way we can sort them by `createdAt` or `publishedAt` and they will be in the expected order
  const post1Doc = await payload.create({
    collection: 'posts',
    depth: 0,
    req,
    context: {
      disableRevalidate: true,
    },
    data: post1({ heroImage: image1Doc, blockImage: image2Doc, author: demoAuthor }),
  })

  const post2Doc = await payload.create({
    collection: 'posts',
    depth: 0,
    req,
    context: {
      disableRevalidate: true,
    },
    data: post2({ heroImage: image2Doc, blockImage: image3Doc, author: demoAuthor }),
  })

  const post3Doc = await payload.create({
    collection: 'posts',
    depth: 0,
    req,
    context: {
      disableRevalidate: true,
    },
    data: post3({ heroImage: image3Doc, blockImage: image1Doc, author: demoAuthor }),
  })

  // update each post with related posts
  await payload.update({
    id: post1Doc.id,
    collection: 'posts',
    req,
    context: { disableRevalidate: true },
    data: {
      relatedPosts: [post2Doc.id, post3Doc.id],
    },
  })
  await payload.update({
    id: post2Doc.id,
    collection: 'posts',
    req,
    context: { disableRevalidate: true },
    data: {
      relatedPosts: [post1Doc.id, post3Doc.id],
    },
  })
  await payload.update({
    id: post3Doc.id,
    collection: 'posts',
    req,
    context: { disableRevalidate: true },
    data: {
      relatedPosts: [post1Doc.id, post2Doc.id],
    },
  })

  payload.logger.info(`— Seeding pages...`)

  const homeDoc = await payload.create({
    collection: 'pages',
    depth: 0,
    context: { disableRevalidate: true },
    data: home({ heroImage: imageHomeDoc, metaImage: image2Doc }),
  })

  const blogDoc = await payload.create({
    collection: 'pages',
    depth: 0,
    context: { disableRevalidate: true },
    data: blogPage(),
  })

  await payload.create({
    collection: 'pages',
    depth: 0,
    context: { disableRevalidate: true },
    data: notFoundPage(),
  })

  await payload.create({
    collection: 'pages',
    depth: 0,
    context: { disableRevalidate: true },
    data: propertiesPage(),
  })

  const privacyPageDoc = await payload.create({
    collection: 'pages',
    depth: 0,
    context: { disableRevalidate: true },
    data: privacyPolicyPage(),
  })

  const contactsPageDoc = await payload.create({
    collection: 'pages',
    depth: 0,
    context: { disableRevalidate: true },
    data: contactsPage(),
  })

  payload.logger.info(`— Seeding properties catalog...`)

  await seedPropertiesCatalog(payload, req, [image1Doc, image2Doc, image3Doc])

  payload.logger.info(`— Seeding consultation form...`)

  await seedConsultationForm(payload, req, Number(privacyPageDoc.id))

  payload.logger.info(`— Seeding globals...`)

  await Promise.all([
    payload.updateGlobal({
      slug: 'header',
      data: {
        navItems: [],
        socialLinks: [
          { platform: 'telegram', url: 'https://t.me/gpi' },
          { platform: 'whatsapp', url: 'https://wa.me/' },
        ],
      },
      context: { disableRevalidate: true },
    }),
    payload.updateGlobal({
      slug: 'footer',
      data: {
        companyName: 'Georgia Private Investment LLC',
        identificationNumber: '445623111',
        address: 'Georgia, Batumi city, Selim Khimshiashvili St. 17',
        copyrightText: '© Georgia Private Investment 2019-2026',
        navItems: [],
      },
      context: { disableRevalidate: true },
    }),
  ])

  await seedLocalizedContent(payload, {
    pageIds: {
      home: Number(homeDoc.id),
      blog: Number(blogDoc.id),
      contacts: Number(contactsPageDoc.id),
    },
    homeHeroMediaId: Number(imageHomeDoc.id),
  })

  if (process.env.SEED_MAP_DENSITY === '1') {
    await seedPropertiesMapDensity(payload)
  }

  payload.logger.info('Seeded database successfully!')
}

/** Load bundled seed images from repo (works offline on staging VPS). */
async function readSeedAsset(filename: string): Promise<File> {
  const filepath = path.join(seedAssetsDir, filename)
  const data = await readFile(filepath)
  const ext = path.extname(filename).slice(1) || 'webp'

  return {
    name: filename,
    data,
    mimetype: `image/${ext}`,
    size: data.byteLength,
  }
}
