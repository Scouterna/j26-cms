import type { CollectionConfig } from 'payload'
import { typeField } from '../fields/screenType'
import { isEditor } from '../access'

export const ScreenPlaylists: CollectionConfig = {
  slug: 'screen-playlists',
  access: {
    read: () => true,
    create: isEditor,
    update: isEditor,
    delete: isEditor,
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
    typeField(),
    {
      name: 'rollingText',
      label: 'Rullande text',
      type: 'text',
      admin: {
        description:
          'Text som rullar längst ner på skärmen. Texten visas på samtliga slides i spellistan. Töm fältet för att gömma hela rullisten.',
        // Kommunikation-only field.
        condition: (data) => (data as any)?.type === 'kommunikation',
      },
    },
    {
      name: 'bottomIframeURL',
      label: 'Interaktiv omröstning i botten',
      type: 'text',
      admin: {
        description:
          'Välj en omröstning som visas som interaktiv webbvy längst ner på skärmen. Lämna tomt för att gömma webbvyn.',
        // Kommunikation-only field.
        condition: (data) => (data as any)?.type === 'kommunikation',
        components: {
          Field: '/fields/SurveyEmbedField#SurveyEmbedField',
        },
      },
    },
    {
      name: 'slides',
      label: 'Slides',
      type: 'array',
      // Every slide in the playlist must match the playlist's type. The type can
      // be changed after slides are added, so validate the whole list here.
      validate: async (value, options) => {
        const type: string | undefined = (options?.data as any)?.type
        const rows = (value as { slide?: unknown }[] | null | undefined) ?? []

        const ids = rows
          .map((row) => (typeof row?.slide === 'object' ? (row.slide as any)?.id : row?.slide))
          .filter((id): id is string | number => id !== undefined && id !== null)

        if (!type || ids.length === 0) {
          return true
        }

        const { docs } = await options.req.payload.find({
          collection: 'screen-slides',
          where: { id: { in: ids } },
          depth: 0,
          limit: ids.length,
          pagination: false,
          req: options.req,
        })

        const mismatched = docs.filter((slide) => (slide as any).type !== type)

        if (mismatched.length > 0) {
          const names = mismatched.map((slide) => (slide as any).name).join(', ')
          return `Följande slides matchar inte spellistans typ: ${names}. Ta bort dem eller byt spellistans typ.`
        }

        return true
      },
      fields: [
        {
          name: 'slide',
          type: 'relationship',
          relationTo: 'screen-slides',
          required: true,
          // Only offer slides of the playlist's type.
          filterOptions: ({ data }) => {
            const type = (data as any)?.type
            return type ? { type: { equals: type } } : true
          },
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
