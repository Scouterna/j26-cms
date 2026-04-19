import type { CollectionConfig } from 'payload'

export const InfoPage: CollectionConfig = {
  slug: 'info-page',
  access: {
    read: () => true,
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
