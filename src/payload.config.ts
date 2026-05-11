import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { migrations } from './migrations'
import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { en } from 'payload/i18n/en'
import { sv } from 'payload/i18n/sv'
import { InfoPage } from './collections/InfoPage'
import { ScreenSlides } from './collections/ScreenSlides'
import { ScreenPlaylists } from './collections/ScreenPlaylists'
import { ScreenScreens } from './collections/ScreenScreens'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  serverURL: process.env.SERVER_URL,
  i18n: {
    supportedLanguages: { sv, en },
  },
  localization: {
    defaultLocale: 'sv',
    locales: ['sv', 'en'],
  },
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  cors: {
    origins: process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : [],
  },
  collections: [Users, Media, InfoPage, ScreenSlides, ScreenPlaylists, ScreenScreens],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
    prodMigrations: migrations,
  }),
  sharp,
  plugins: [],
  endpoints: [
    {
      path: '/screens/:slug/content',
      method: 'get',
      handler: async (req) => {
        const slug = req.routeParams?.slug

        if (!slug) {
          return Response.json({ error: 'Screen not found' }, { status: 404 })
        }

        const screen = await req.payload.find({
          collection: 'screen-screens',
          where: {
            slug: {
              equals: slug,
            },
          },
          depth: 20, // Make sure we get all the way down to for example nested rich content blocks with images
          populate: {
            'screen-playlists': {
              slides: {
                duration: true,
                slide: true,
              },
            },
          },
        })

        const playlist = screen.docs[0]?.playlist
        if (!playlist || typeof playlist === 'number') {
          return Response.json({ error: 'Screen not found' }, { status: 404 })
        }

        const slideRow = playlist.slides ?? []

        if (slideRow.length === 0) {
          return Response.json({ error: 'Screen not found' }, { status: 404 })
        }

        const formattedSlides = slideRow.flatMap(({ slide, duration }) => {
          if (typeof slide === 'number') {
            return []
          }

          return {
            layout: slide.layout,
            duration,
            content: slide.content,
          }
        })

        return Response.json(formattedSlides)
      },
    },
  ],
})
