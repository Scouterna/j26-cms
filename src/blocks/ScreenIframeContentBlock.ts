import { Block } from 'payload'

export const ScreenIframeContentBlock: Block = {
  slug: 'screen-iframe-content',
  admin: {
    disableBlockName: true,
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
