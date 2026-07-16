import { Block } from 'payload'

export const ScreenIframeContentBlock: Block = {
  slug: 'screen-iframe-content',
  admin: {
    disableBlockName: true,
    components: {
      Label: '/fields/ContentRowLabel#ContentRowLabel',
    },
  },
  labels: {
    singular: 'Webbinnehåll',
    plural: 'Webbinnehåll',
  },
  fields: [
    {
      type: 'text',
      name: 'url',
      label: 'URL',
    },
  ],
}
