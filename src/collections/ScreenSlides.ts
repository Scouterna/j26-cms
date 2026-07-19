import type { CollectionConfig, SelectFieldValidation } from 'payload'
import { ScreenEmptyContentBlock } from '../blocks/ScreenEmptyContentBlock'
import { ScreenIframeContentBlock } from '../blocks/ScreenIframeContentBlock'
import { ScreenImageContentBlock } from '../blocks/ScreenImageContentBlock'
import { ScreenRichTextContentBlock } from '../blocks/ScreenRichTextContentBlock'
import { layoutOptions } from '../fields/layoutOptions'
import { screenTypeOptions, typeField } from '../fields/screenType'
import { isEditor } from '../access'

// The chosen layout must belong to the slide's type.
const validateLayout: SelectFieldValidation = (value, options) => {
  // A custom validate replaces the built-in required check, so enforce it here.
  if (!value) {
    return 'Detta fält är obligatoriskt.'
  }

  const type: string | undefined = (options?.data as any)?.type
  const layout = layoutOptions.find((option) => option.value === value)

  if (layout && type && layout.type !== type) {
    const typeLabel = screenTypeOptions.find((option) => option.value === type)?.label ?? type
    return `Vald layout hör inte till typen "${typeLabel}". Välj en layout som matchar slidens typ eller byt typ.`
  }

  return true
}

export const ScreenSlides: CollectionConfig = {
  slug: 'screen-slides',
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
        description: 'Internt namn för att hålla ordning på slides. Visas inte på skärmarna',
      },
    },
    typeField(),
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
      validate: validateLayout,
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
