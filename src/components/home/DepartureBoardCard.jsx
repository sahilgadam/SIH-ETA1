import { useRef, useState } from 'react'
import { LayoutList, Search } from 'lucide-react'
import { quickStations } from '../../data/content'
import { formatStation, stations } from '../../data/stations'
import { useLanguage } from '../../context/LanguageProvider'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { shake } from '../../lib/motion'
import { Button } from '../ui/Button'
import { FieldMessage } from '../ui/FieldMessage'
import { StationField } from '../ui/StationField'

const stationByCode = new Map(stations.map((station) => [station.code, station]))

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
    <section
      id="station-board"
      aria-labelledby="station-board-title"
      className={className}
    >
      <div className="flex h-full flex-col rounded-lg border border-line bg-surface p-5">
        <h2
          id="station-board-title"
          className="flex items-center gap-2 text-base font-bold text-fg"
        >
          <LayoutList className="size-4 text-brand" aria-hidden="true" />
          {t('board.title')}
        </h2>
        <p className="mt-2 text-sm leading-6 text-fg-muted">{t('board.description')}</p>

        <form ref={formRef} onSubmit={handleSubmit} noValidate className="mt-4">
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
          />

          <Button type="submit" size="lg" variant="secondary" className="mt-3 w-full">
            <Search className="size-4" aria-hidden="true" />
            {t('board.submit')}
          </Button>

          <div id="board-feedback" className="mt-3 empty:mt-0">
            {error ? <FieldMessage tone="error">{t('board.error')}</FieldMessage> : null}
          </div>
        </form>

        <div className="mt-auto pt-5">
          <div className="flex flex-wrap items-center gap-2 border-t border-line pt-4">
            <span className="text-xs font-medium text-fg-subtle">{t('board.quick')}</span>
            {quickStations.map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => {
                  setStation(formatStation(stationByCode.get(code)))
                  setError(false)
                }}
                className="rounded-md border border-line px-2 py-1 font-mono text-xs font-semibold text-fg-muted transition-colors duration-150 hover:border-line-strong hover:bg-sunken hover:text-fg"
              >
                {code}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
