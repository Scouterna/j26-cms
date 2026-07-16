export type LayoutOption = {
  label: string
  value: string
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
    slots: ['Helskärm 9:14'],
  },
  {
    label: 'Två rader',
    value: 'kom_two_rows',
    slots: ['Övre rad 4:3', 'Nedre rad 4:3'],
  },
  {
    label: 'Galleri',
    value: 'kom_gallery',
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
    slots: ['Innehåll 3:4'],
  },
  {
    label: 'Röstning, galleri',
    value: 'kom_vote_gallery',
    slots: ['Övre 4:3', 'Nedre vänster 3:4', 'Nedre mitten 3:4', 'Nedre höger 3:4'],
  },
  {
    label: 'Endast Service - Nytt & nyttigt',
    value: 'ser_info',
    slots: ['Innehåll'],
  },
]
