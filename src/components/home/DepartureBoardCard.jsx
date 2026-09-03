import { useRef, useState } from 'react'
import { Search } from 'lucide-react'
import { quickStations } from '../../data/content'
import { formatStation, stations } from '../../data/stations'
import { useLanguage } from '../../context/LanguageProvider'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { shake } from '../../lib/motion'
import { Button } from '../ui/Button'
import { Eyebrow } from '../ui/Eyebrow'
import { FieldMessage } from '../ui/FieldMessage'
import { StationField } from '../ui/StationField'

const stationByCode = new Map(stations.map((station) => [station.code, station]))

/**
 * The compact "check another station" widget embedded at the foot of the
 * Stations section — deliberately not its own card, just a form.
 */
export function DepartureBoardCard({ className, onSearch }) {
  const { t } = useLanguage()
  const prefersReducedMotion = usePrefersReducedMotion()

  const [station, setStation] = useState('')
  const [error, setError] = useState(false)

  const formRef = useRef(null)
  const inputRef = useRef(null)

  const handleSubmit = (event) => {
    event.preventDefault()
    const trimmed = station.trim()

    if (!trimmed) {
      setError(true)
      inputRef.current?.focus()
      if (!prefersReducedMotion) shake(formRef.current)
      return
    }

    setError(false)
    onSearch({ kind: 'station', station: trimmed })
  }

  return (
    <div className={className}>
      <Eyebrow as="h3">{t('stations.searchTitle')}</Eyebrow>

      <form ref={formRef} onSubmit={handleSubmit} noValidate className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end">
        <StationField
          label={t('board.label')}
          placeholder={t('board.placeholder')}
          value={station}
          onChange={(next) => {
            setStation(next)
            setError(false)
          }}
          invalid={error}
          describedBy="board-feedback"
          inputRef={inputRef}
          name="board-station"
          className="flex-1"
        />

        <Button type="submit" variant="secondary" className="shrink-0">
          <Search className="size-4" aria-hidden="true" />
          {t('board.submit')}
        </Button>
      </form>

      <div id="board-feedback" className="mt-2 empty:mt-0">
        {error ? <FieldMessage tone="error">{t('board.error')}</FieldMessage> : null}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-fg-subtle">{t('board.quick')}</span>
        {quickStations.map((code) => (
          <button
            key={code}
            type="button"
            onClick={() => {
              setStation(formatStation(stationByCode.get(code)))
              setError(false)
            }}
            className="rounded-sm border border-line px-2 py-1 font-mono text-xs font-semibold text-fg-muted transition-colors duration-150 hover:border-line-strong hover:bg-sunken hover:text-fg"
          >
            {code}
          </button>
        ))}
      </div>
    </div>
  )
}
