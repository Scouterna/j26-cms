import type { ScreenType } from './screenType'

export type LayoutOption = {
  label: string
  value: string
  /**
   * Which screen type this layout belongs to. Used to filter the layout picker
   * and to validate that a slide's chosen layout matches its type.
   */
  type: ScreenType
  /**
   * Name of each content slot, in the order the content blocks map to the
   * layout. The number of slots is `slots.length`. Shown as the row label and
   * used to validate the block count in the editor.
   */
  slots: string[]
}

export const layoutOptions: LayoutOption[] = [
  {
    label: 'En ruta',
    value: 'kom_single',
    type: 'kommunikation',
    slots: ['Helskärm 9:14'],
  },
  {
    label: 'Två rader',
    value: 'kom_two_rows',
    type: 'kommunikation',
    slots: ['Övre rad 4:3', 'Nedre rad 4:3'],
  },
  {
    label: 'Kollage',
    value: 'kom_gallery',
    type: 'kommunikation',
    slots: [
      'Övre vänster 4:3',
      'Övre höger 4:3',
      'Mitten 4:3',
      'Nedre vänster 3:4',
      'Nedre mitten 3:4',
      'Nedre höger 3:4',
    ],
  },
  {
    label: 'Röstning, en ruta',
    value: 'kom_vote_single',
    type: 'kommunikation',
    slots: ['Innehåll 3:4'],
  },
  {
    label: 'Röstning, kollage',
    value: 'kom_vote_gallery',
    type: 'kommunikation',
    slots: ['Övre 4:3', 'Nedre vänster 3:4', 'Nedre mitten 3:4', 'Nedre höger 3:4'],
  },
  {
    label: 'Nytt & nyttigt',
    value: 'ser_info',
    type: 'service',
    slots: ['Innehåll'],
  },
]
