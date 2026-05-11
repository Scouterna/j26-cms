import { Block } from 'payload'

export const ScreenImageContentBlock: Block = {
  slug: 'screen-image-content',
  admin: {
    disableBlockName: true,
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
