import type { CollectionConfig } from 'payload'

export const ScreenScreens: CollectionConfig = {
  slug: 'screen-screens',
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
        description: 'Internt namn för att hålla ordning på skärmar. Visas inte på skärmen.',
      },
    },
    {
      name: 'slug',
      label: 'Tekniskt namn',
      type: 'text',
      required: true,
      admin: {
        description: 'Endast små engelska bokstäver, siffror och understreck.',
      },
      validate: (value: string | null | undefined) => {
        if (!value || !/^[a-z0-9_]+$/.test(value)) {
          return 'Endast små engelska bokstäver, siffror och understreck är tillåtna'
        }
        return true
      },
    },
    {
      name: 'playlist',
      label: 'Spellista',
      type: 'relationship',
      relationTo: 'screen-playlists',
      required: true,
    },
  ],
}
