import type { GlobalConfig } from 'payload'
import { isEditor } from '../access'

export const ImportantInfo: GlobalConfig = {
  slug: 'important-info',
  label: 'Viktig info',
  access: {
    read: () => true,
    update: isEditor,
  },
  fields: [
    {
      name: 'active',
      label: 'Aktiv',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description:
          'Slå på för att visa viktig info på serviceskärmarna. Detta puttar undan annat innehåll och är väldigt påträngande, med gul bakgrund och varningstriangel.',
      },
    },
    {
      name: 'content',
      label: 'Innehåll',
      type: 'richText',
    },
  ],
}
