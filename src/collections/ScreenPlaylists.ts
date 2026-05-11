import type { CollectionConfig } from 'payload'

export const ScreenPlaylists: CollectionConfig = {
  slug: 'screen-playlists',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      label: 'Namn',
      type: 'text',
      required: true,
      admin: {
        description: 'Internt namn för att hålla ordning på spellistor. Visas inte på skärmarna',
      },
    },
    {
      name: 'slides',
      label: 'Slides',
      type: 'array',
      fields: [
        {
          name: 'slide',
          type: 'relationship',
          relationTo: 'screen-slides',
          required: true,
        },
        {
          name: 'duration',
          label: 'Varaktighet (sekunder)',
          type: 'number',
          required: true,
          defaultValue: 10,
        },
      ],
    },
  ],
}
