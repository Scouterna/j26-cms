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
import { ImportantInfo } from './globals/ImportantInfo'

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
    theme: 'light',
    importMap: {
      baseDir: path.resolve(dirname),
    },
    components: {
      beforeLogin: ['/components/BeforeLogin#BeforeLogin'],
    },
  },
  cors: {
    origins: process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : [],
  },
  collections: [Users, Media, InfoPage, ScreenSlides, ScreenPlaylists, ScreenScreens],
  globals: [ImportantInfo],
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
      // Consumed by the j26-app shell (see J26_PUBLIC_APP_CONFIGS) to render the
      // CMS tool in the navigation. Served at /_services/cms/api/app-config.
      // req.user is populated by the Keycloak auth strategy only for users with a
      // j26-cms role, so returning 401 otherwise hides the tool from everyone
      // without CMS access.
      path: '/app-config',
      method: 'get',
      handler: (req) => {
        if (!req.user) {
          return Response.json({ error: 'Unauthorized' }, { status: 401 })
        }

        return Response.json({
          navigation: [
            {
              type: 'page',
              id: 'page_cms',
              label: 'Hantera innehåll',
              icon: 'edit',
              path: '/_services/cms/admin',
            },
          ],
        })
      },
    },
    {
      path: '/screens/:slug/content',
      method: 'get',
      handler: async (req) => {
        const slug = req.routeParams?.slug

        if (!slug) {
          return Response.json({ error: 'Screen not found' }, { status: 404 })
        }

        const screens = await req.payload.find({
          collection: 'screen-screens',
          where: {
            slug: {
              equals: slug,
            },
          },
          depth: 20, // Make sure we get all the way down to for example nested rich content blocks with images
          populate: {
            'screen-playlists': {
              rollingText: true,
              bottomIframeURL: true,
              slides: {
                duration: true,
                slide: true,
              },
            },
          },
        })

        const screen = screens.docs[0]

        if (!screen) {
          return Response.json({ error: 'Screen not found' }, { status: 404 })
        }

        const playlist = screen.playlist
        if (!playlist || typeof playlist === 'number') {
          return Response.json({ error: 'Playlist not found' }, { status: 404 })
        }

        const slideRow = playlist.slides ?? []

        if (slideRow.length === 0) {
          return Response.json({ error: 'No slides found in playlist' }, { status: 404 })
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

        const importantInfo = await req.payload.findGlobal({
          slug: 'important-info',
          depth: 20,
        })

        // rollingText and bottomIframeURL are Kommunikation-only; importantInfo
        // is Service-only.
        const isKommunikation = screen.type === 'kommunikation'
        const showImportantInfo = importantInfo.active && screen.type === 'service'

        // The bottom iframe is stored as a path relative to the host that serves
        // the interactive screens. Return it as an absolute URL (prefixed with
        // SERVER_URL) so the screen can embed it directly.
        const baseURL = (process.env.SERVER_URL ?? '').replace(/\/$/, '')
        const bottomIframe = isKommunikation ? playlist.bottomIframeURL?.trim() : undefined
        const bottomIframeURL = bottomIframe
          ? /^https?:\/\//i.test(bottomIframe)
            ? bottomIframe
            : `${baseURL}${bottomIframe.startsWith('/') ? '' : '/'}${bottomIframe}`
          : null

        return Response.json({
          slides: formattedSlides,
          rollingText:
            isKommunikation && playlist.rollingText?.trim()
              ? {
                  content: playlist.rollingText,
                }
              : null,
          importantInfo: showImportantInfo
            ? {
                content: importantInfo.content ?? null,
              }
            : null,
          bottomIframeURL,
        })
      },
    },
  ],
})
