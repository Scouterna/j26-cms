import type { CollectionConfig } from 'payload'
import { ScreenEmptyContentBlock } from '../blocks/ScreenEmptyContentBlock'
import { ScreenIframeContentBlock } from '../blocks/ScreenIframeContentBlock'
import { ScreenImageContentBlock } from '../blocks/ScreenImageContentBlock'
import { ScreenRichTextContentBlock } from '../blocks/ScreenRichTextContentBlock'

export const ScreenSlides: CollectionConfig = {
  slug: 'screen-slides',
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
        description: 'Internt namn för att hålla ordning på slides. Visas inte på skärmarna',
      },
    },
    {
      name: 'layout',
      label: 'Layout',
      type: 'select',
      required: true,
      admin: {
        description:
          'Layout för skärmen. Varje rad innehåll nedan tar upp en ruta i layouten i den ordning de ligger.',
      },
      options: [
        {
          label: '[kom] Två rader, [4:3] [4:3]',
          value: 'two-rows-1-1',
        },
        {
          label: '[kom] Tre rader, [4:3 4:3] [4:3] [3:4 3:4 3:4]',
          value: 'three-rows-2-1-3',
        },
        {
          label: '[kom] Röstningskarta',
          value: 'voting-map',
        },
        {
          label: '[ser] Nytt & nyttigt - Banner',
          value: 'news-banner-1',
        },
        {
          label: '[ser] Nytt & nyttigt - Väder',
          value: 'news-weather-1',
        },
      ],
    },
    {
      name: 'content',
      label: 'Innehåll',
      type: 'blocks',
      blocks: [
        ScreenIframeContentBlock,
        ScreenRichTextContentBlock,
        ScreenImageContentBlock,
        ScreenEmptyContentBlock,
      ],
      validate: (value, options) => {
        // Count the sum of all numbers in the layout ID
        const NUMBER_REGEX = /\d+/g
        const layout: string | undefined = (options?.data as any)?.layout

        const layoutSlots =
          layout
            ?.match(NUMBER_REGEX)
            ?.map(Number)
            .reduce((a, b) => a + b, 0) ?? 0
        const contentBlocks = (value as any)?.length ?? 0

        if (contentBlocks > layoutSlots) {
          return `För många innehållsblock för vald layout. Layouten har ${layoutSlots} platser, men det finns ${contentBlocks} block. Ta bort ${contentBlocks - layoutSlots} block eller välj en layout med fler platser.`
        }

        if (contentBlocks < layoutSlots) {
          return `För få innehållsblock för vald layout. Layouten har ${layoutSlots} platser, men det finns bara ${contentBlocks} block. Lägg till ${layoutSlots - contentBlocks} block eller välj en layout med färre platser.`
        }

        return true
      },
    },
  ],
}
