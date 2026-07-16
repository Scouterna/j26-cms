'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import type { TextFieldClientComponent } from 'payload'
import {
  Banner,
  FieldDescription,
  FieldError,
  FieldLabel,
  ReactSelect,
  useField,
} from '@payloadcms/ui'

type Embed = {
  id: string
  name: string
  type: string
  status: string
  path: string
  url: string
}

type Option = { label: string; value: string }

type LoadState = 'loading' | 'ready' | 'unauthorized' | 'error'

// Same-origin: the interactive-screens API is served under the same host.
const ENDPOINT = '/_services/interactive-screens/api/surveys/embeds'

const STATUS_LABELS: Record<string, string> = {
  archived: 'arkiverad',
  draft: 'utkast',
  ended: 'avslutad',
}

// Active votes show just their name; others are suffixed with their status.
const labelForEmbed = (embed: Embed) =>
  embed.status === 'active'
    ? embed.name
    : `${embed.name} (${STATUS_LABELS[embed.status] ?? embed.status})`

// The iframe renders as if the screen were this wide, then gets scaled down to
// fit the preview box — so the embed lays out like it will on a real screen.
const PREVIEW_ASPECT = 3 // width / height
const VIRTUAL_WIDTH = 1080
const VIRTUAL_HEIGHT = VIRTUAL_WIDTH / PREVIEW_ASPECT

const PREVIEW_STYLE: React.CSSProperties = {
  position: 'relative',
  aspectRatio: `${PREVIEW_ASPECT} / 1`,
  marginTop: 'var(--base)',
  marginInline: 'auto',
  width: 'auto',
  maxWidth: 'calc(var(--base) * 40)',
  border: '1px solid var(--theme-elevation-150)',
  borderRadius: 'var(--style-radius-m, 4px)',
  overflow: 'hidden',
  background: 'var(--theme-elevation-50)',
}

const RETRY_BUTTON_STYLE: React.CSSProperties = {
  background: 'none',
  border: 'none',
  padding: 0,
  color: 'inherit',
  font: 'inherit',
  textDecoration: 'underline',
  cursor: 'pointer',
}

export const SurveyEmbedField: TextFieldClientComponent = ({ field, path }) => {
  const { value, setValue, showError, errorMessage } = useField<string>({ path })

  const [state, setState] = useState<LoadState>('loading')
  const [embeds, setEmbeds] = useState<Embed[]>([])

  // Measure the preview box so we can scale the (virtually wide) iframe to fit.
  const previewRef = useRef<HTMLDivElement>(null)
  const [previewWidth, setPreviewWidth] = useState(0)

  const load = useCallback(async () => {
    setState('loading')
    try {
      const res = await fetch(ENDPOINT, { credentials: 'include' })
      if (res.status === 401) {
        setState('unauthorized')
        return
      }
      if (!res.ok) {
        setState('error')
        return
      }
      const data = (await res.json()) as Embed[]
      setEmbeds(Array.isArray(data) ? data : [])
      setState('ready')
    } catch {
      setState('error')
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  useEffect(() => {
    const el = previewRef.current
    if (!el) return
    const observer = new ResizeObserver((entries) => {
      setPreviewWidth(entries[0]?.contentRect.width ?? 0)
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [value, state])

  const description = field?.admin?.description
  const staticDescription =
    typeof description === 'string' || (typeof description === 'object' && description !== null)
      ? description
      : undefined

  const options: Option[] = embeds
    .filter((embed) => embed.type === 'vote')
    // Active votes first, otherwise keep API order.
    .sort((a, b) => Number(b.status === 'active') - Number(a.status === 'active'))
    .map((embed) => ({ label: labelForEmbed(embed), value: embed.path }))

  // Keep the current selection visible even if it's no longer in the list,
  // so editing the playlist doesn't silently discard it.
  if (value && !options.some((option) => option.value === value)) {
    const existing = embeds.find((embed) => embed.path === value)
    options.unshift({
      label: existing ? labelForEmbed(existing) : `${value} (nuvarande)`,
      value,
    })
  }

  const selected = options.find((option) => option.value === value) ?? null

  return (
    <div className="field-type">
      <FieldLabel label={field?.label} path={path} required={field?.required} />

      <FieldError message={errorMessage} path={path} showError={showError} />

      {state === 'loading' && <p>Laddar omröstningar…</p>}

      {state === 'unauthorized' && (
        <Banner type="error">
          Du är inte inloggad i interaktiva skärmar-appen. Logga in där och{' '}
          <button type="button" onClick={() => void load()} style={RETRY_BUTTON_STYLE}>
            försök igen
          </button>
          .
        </Banner>
      )}

      {state === 'error' && (
        <Banner type="error">
          Kunde inte hämta omröstningar.{' '}
          <button type="button" onClick={() => void load()} style={RETRY_BUTTON_STYLE}>
            Försök igen
          </button>
          .
        </Banner>
      )}

      {state === 'ready' && (
        <ReactSelect
          isClearable
          options={options}
          value={selected ?? undefined}
          onChange={(option) => {
            const next = option as Option | null
            setValue(next?.value ?? null)
          }}
          placeholder={options.length ? 'Välj omröstning…' : 'Inga aktiva omröstningar'}
        />
      )}

      <FieldDescription description={staticDescription} path={path} />

      {value && (
        <div ref={previewRef} style={PREVIEW_STYLE}>
          <iframe
            key={value}
            src={value}
            title="Förhandsvisning av omröstning"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: VIRTUAL_WIDTH,
              height: VIRTUAL_HEIGHT,
              border: 'none',
              transform: `scale(${previewWidth / VIRTUAL_WIDTH})`,
              transformOrigin: 'top left',
            }}
          />
        </div>
      )}
    </div>
  )
}
