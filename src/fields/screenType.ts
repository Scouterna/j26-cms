import type { Field } from 'payload'

export const screenTypeOptions = [
  {
    label: 'Service (vänster)',
    value: 'service',
  },
  {
    label: 'Kommunikation (höger)',
    value: 'kommunikation',
  },
] as const

export type ScreenType = (typeof screenTypeOptions)[number]['value']

/**
 * The Service/Kommunikation selector shared by screens, playlists and slides.
 * Returned from a factory so each collection gets its own object – Payload
 * mutates field configs during sanitization, so a shared reference is unsafe.
 */
export const typeField = (): Field => ({
  name: 'type',
  label: 'Typ',
  type: 'select',
  required: true,
  defaultValue: 'service',
  options: [...screenTypeOptions],
})
