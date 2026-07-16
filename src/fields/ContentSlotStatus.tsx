'use client'

import React from 'react'
import { Banner, useFormFields } from '@payloadcms/ui'
import { layoutOptions } from './layoutOptions'

// Rendered before the content block rows. Shows a live info/warning banner about
// how the current blocks line up with the chosen layout's slots.
export const ContentSlotStatus: React.FC = () => {
  const layout = useFormFields(([fields]) => fields?.layout?.value as string | undefined)
  const rowCount = useFormFields(([fields]) => fields?.content?.rows?.length ?? 0)

  const option = layoutOptions.find((entry) => entry.value === layout)
  if (!option) return null

  const missingCells = option.slots.slice(rowCount)

  if (missingCells.length > 0) {
    return (
      <Banner type="success">
        {missingCells.length === 1
          ? '1 ruta kvar att fylla'
          : `${missingCells.length} rutor kvar att fylla`}
        {`: ${missingCells.join(', ')}. Lägg till ett block per ruta nedan.`}
      </Banner>
    )
  }

  const extra = rowCount - option.slots.length
  if (extra > 0) {
    return (
      <Banner type="error">
        {`För många block för vald layout – ta bort ${extra}. Layouten har ${option.slots.length} rutor.`}
      </Banner>
    )
  }

  return null
}
