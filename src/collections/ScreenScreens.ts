import type { CollectionConfig, RelationshipFieldValidation } from 'payload'
import { typeField } from '../fields/screenType'

// The screen's type can be changed after a playlist is chosen, so validate the match.
const validatePlaylist: RelationshipFieldValidation = async (value, options) => {
  if (!value) {
    return 'Detta fält är obligatoriskt.'
  }

  const type: string | undefined = (options?.data as any)?.type
  if (!type) {
    return true
  }

  const id = typeof value === 'object' ? (value as any).id : value
  const playlist = await options.req.payload.findByID({
    collection: 'screen-playlists',
    id,
    depth: 0,
    req: options.req,
    disableErrors: true,
  })

  if (playlist && (playlist as any).type !== type) {
    return 'Vald spellista matchar inte skärmens typ. Välj en spellista med samma typ eller byt skärmens typ.'
  }

  return true
}

export const ScreenScreens: CollectionConfig = {
  slug: 'screen-screens',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'name',
    preview: ({ slug }) => `https://app.dev.j26.se/_services/screens/?slug=${slug}`,
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
    typeField(),
    {
      name: 'playlist',
      label: 'Spellista',
      type: 'relationship',
      relationTo: 'screen-playlists',
      required: true,
      // Only offer playlists of the screen's type.
      filterOptions: ({ data }) => {
        const type = (data as any)?.type
        return type ? { type: { equals: type } } : true
      },
      validate: validatePlaylist,
    },
  ],
}
