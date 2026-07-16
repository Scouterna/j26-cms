import { Block } from 'payload'

export const ScreenRichTextContentBlock: Block = {
  slug: 'screen-rich-text-content',
  admin: {
    disableBlockName: true,
    components: {
      Label: '/fields/ContentRowLabel#ContentRowLabel',
    },
  },
  labels: {
    singular: 'Text',
    plural: 'Text',
  },
  fields: [
    {
      type: 'richText',
      name: 'richText',
      label: 'Innehåll',
    },
  ],
}
