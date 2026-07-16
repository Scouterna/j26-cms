import { Block } from 'payload'

export const ScreenEmptyContentBlock: Block = {
  slug: 'screen-empty-content',
  admin: {
    disableBlockName: true,
    components: {
      Label: '/fields/ContentRowLabel#ContentRowLabel',
    },
  },
  labels: {
    singular: 'Tom',
    plural: 'Tomma',
  },
  fields: [],
}
