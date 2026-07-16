import { Block } from 'payload'

export const ScreenImageContentBlock: Block = {
  slug: 'screen-image-content',
  admin: {
    disableBlockName: true,
    components: {
      Label: '/fields/ContentRowLabel#ContentRowLabel',
    },
  },
  labels: {
    singular: 'Bild',
    plural: 'Bilder',
  },
  fields: [
    {
      type: 'upload',
      name: 'image',
      label: 'Bild',
      relationTo: 'media',
    },
  ],
}
