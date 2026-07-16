'use client'

import React, { useEffect } from 'react'
import type { SelectFieldClientComponent } from 'payload'
import { FieldDescription, FieldError, FieldLabel, useField } from '@payloadcms/ui'
import { layoutOptions } from './layoutOptions'
import './LayoutField.css'

// next/image doesn't prefix basePath onto a static src, so do it manually.
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

export const LayoutField: SelectFieldClientComponent = ({ field, path }) => {
  const { value, setValue, showError, errorMessage } = useField<string>({ path })
  // The slide's type sits at the document root, next to this field.
  const { value: type } = useField<string>({ path: 'type' })

  // Only offer layouts that belong to the currently selected type.
  const visibleOptions = layoutOptions.filter((option) => !type || option.type === type)

  // If the type changes so the current layout no longer matches, clear it so a
  // now-hidden card can't stay silently selected. Validation is the backstop.
  useEffect(() => {
    if (!value || !type) return
    const selectedLayout = layoutOptions.find((option) => option.value === value)
    if (selectedLayout && selectedLayout.type !== type) {
      setValue(undefined)
    }
  }, [type, value, setValue])

  const description = field?.admin?.description
  const staticDescription =
    typeof description === 'string' || (typeof description === 'object' && description !== null)
      ? description
      : undefined

  return (
    <div className="field-type layout-field">
      <FieldLabel label={field?.label} path={path} required={field?.required} />

      <FieldError message={errorMessage} path={path} showError={showError} />

      <div className="layout-field__grid" role="radiogroup">
        {visibleOptions.map((option) => {
          const selected = value === option.value

          return (
            <button
              aria-checked={selected}
              className={`layout-field__card${selected ? ' layout-field__card--selected' : ''}`}
              key={option.value}
              onClick={() => setValue(option.value)}
              role="radio"
              type="button"
            >
              <span className="layout-field__preview">
                <img
                  alt=""
                  className="layout-field__image"
                  loading="lazy"
                  onError={(event) => {
                    event.currentTarget.style.display = 'none'
                  }}
                  src={`${BASE_PATH}/layout-previews/${option.value}.png`}
                />
              </span>
              <span className="layout-field__label">{option.label}</span>
            </button>
          )
        })}
      </div>

      <FieldDescription description={staticDescription} path={path} />
    </div>
  )
}
