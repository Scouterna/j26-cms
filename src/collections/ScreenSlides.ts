import type { CollectionConfig } from 'payload'
import { ScreenEmptyContentBlock } from '../blocks/ScreenEmptyContentBlock'
import { ScreenIframeContentBlock } from '../blocks/ScreenIframeContentBlock'
import { ScreenImageContentBlock } from '../blocks/ScreenImageContentBlock'
import { ScreenRichTextContentBlock } from '../blocks/ScreenRichTextContentBlock'
import { layoutOptions } from '../fields/layoutOptions'

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
        components: {
          Field: '/fields/LayoutField#LayoutField',
        },
      },
      options: layoutOptions,
    },
    {
      name: 'content',
      label: 'Innehåll',
      type: 'blocks',
      admin: {
        description:
          'Lägg till ett block per ruta i vald layout, i ordning. Radens namn visar vilken ruta blocket hamnar i – dra för att flytta. Använd "Tom" för en ruta som ska vara tom.',
        components: {
          beforeInput: ['/fields/ContentSlotStatus#ContentSlotStatus'],
        },
      },
      blocks: [
        ScreenIframeContentBlock,
        ScreenRichTextContentBlock,
        ScreenImageContentBlock,
        ScreenEmptyContentBlock,
      ],
      validate: (value, options) => {
        // Each layout declares how many content-block slots it renders.
        const layout: string | undefined = (options?.data as any)?.layout

        const layoutSlots = layoutOptions.find((option) => option.value === layout)?.slots.length ?? 0
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
