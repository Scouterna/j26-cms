import type { CollectionConfig } from 'payload'
import { isEditor } from '../access'

export const InfoPage: CollectionConfig = {
  slug: 'info-page',
  access: {
    read: () => true,
    create: isEditor,
    update: isEditor,
    delete: isEditor,
  },
  admin: {
    defaultColumns: ['title', 'content'],
  },
  versions: {
    drafts: true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'icon',
      type: 'text',
      // admin: {
      //   components: {
      //     Field: '/fields/IconField#IconField',
      //   },
      // },
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
      localized: true,
    },
  ],
}
