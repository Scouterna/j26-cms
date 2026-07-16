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
      name: 'rollingText',
      label: 'Rullande text',
      type: 'text',
      admin: {
        description:
          'Text som rullar längst ner på skärmen. Texten visas på samtliga slides i spellistan. Töm fältet för att gömma hela rullisten.',
      },
    },
    {
      name: 'bottomIframeURL',
      label: 'Interaktiv omröstning i botten',
      type: 'text',
      admin: {
        description:
          'Välj en omröstning som visas som interaktiv webbvy längst ner på skärmen. Lämna tomt för att gömma webbvyn.',
        components: {
          Field: '/fields/SurveyEmbedField#SurveyEmbedField',
        },
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
