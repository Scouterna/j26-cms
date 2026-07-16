'use client'

import React from 'react'
import { useFormFields, useRowLabel } from '@payloadcms/ui'
import { layoutOptions } from './layoutOptions'

// Block slug -> human label, so the row label can show what kind of content it is.
const BLOCK_LABELS: Record<string, string> = {
  'screen-iframe-content': 'Webbinnehåll',
  'screen-image-content': 'Bild',
  'screen-rich-text-content': 'Text',
  'screen-empty-content': 'Tom',
}

export const ContentRowLabel: React.FC = () => {
  // `rowNumber` here is the 0-based row index (see Payload's BlockRow).
  const { data, rowNumber } = useRowLabel<{ blockType?: string }>()
  const layout = useFormFields(([fields]) => fields?.layout?.value as string | undefined)

  const index = typeof rowNumber === 'number' ? rowNumber : 0
  const option = layoutOptions.find((entry) => entry.value === layout)
  const cell = option?.slots[index]
  const blockLabel = data?.blockType ? BLOCK_LABELS[data.blockType] : undefined

  const position = cell ?? `Ruta ${index + 1}`

  return (
    <span>
      {position}
      {blockLabel ? ` · ${blockLabel}` : ''}
    </span>
  )
}
