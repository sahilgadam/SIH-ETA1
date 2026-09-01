import { useRef, useState } from 'react'
import { ArrowLeftRight, Search } from 'lucide-react'
import { quickRoutes } from '../../data/content'
import { formatStation, stations } from '../../data/stations'
import { useLanguage } from '../../context/LanguageProvider'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { shake, spin } from '../../lib/motion'
import { Button } from '../ui/Button'
import { FieldMessage } from '../ui/FieldMessage'
import { StationField } from '../ui/StationField'

const stationByCode = new Map(stations.map((station) => [station.code, station]))

export function RouteSearchForm({ onSearch }) {
  const { t } = useLanguage()
  const prefersReducedMotion = usePrefersReducedMotion()

  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [error, setError] = useState(null)

  const formRef = useRef(null)
  const fromRef = useRef(null)
  const toRef = useRef(null)
  const swapIconRef = useRef(null)
  const swapTurns = useRef(0)

  const reportError = (messageKey, field) => {
    setError(messageKey)
    field?.current?.focus()
    if (!prefersReducedMotion) shake(formRef.current)
  }

  const handleSwap = () => {
    setFrom(to)
    setTo(from)
    setError(null)
    if (!prefersReducedMotion) {
      swapTurns.current += 1
      spin(swapIconRef.current, swapTurns.current * 180)
    }
  }

  const applyQuickRoute = (route) => {
    setFrom(formatStation(stationByCode.get(route.from)))
    setTo(formatStation(stationByCode.get(route.to)))
    setError(null)
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const trimmedFrom = from.trim()
    const trimmedTo = to.trim()

    if (!trimmedFrom) return reportError('route.errorFrom', fromRef)
    if (!trimmedTo) return reportError('route.errorTo', toRef)
    if (trimmedFrom.toLowerCase() === trimmedTo.toLowerCase()) {
      return reportError('route.errorSame', toRef)
    }

    setError(null)
    onSearch({ kind: 'route', from: trimmedFrom, to: trimmedTo })
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate aria-describedby="route-feedback">
      <h2 className="sr-only">{t('route.legend')}</h2>

      <div className="grid gap-3 sm:grid-cols-[1fr_auto_1fr]">
        <StationField
          label={t('route.from')}
          placeholder={t('route.fromPlaceholder')}
          value={from}
          onChange={(next) => {
            setFrom(next)
            setError(null)
          }}
          invalid={error === 'route.errorFrom' || error === 'route.errorSame'}
          describedBy="route-feedback"
          inputRef={fromRef}
          name="from-station"
        />

        <div className="flex items-end justify-center">
          <button
            type="button"
            onClick={handleSwap}
            aria-label={t('route.swap')}
            title={t('route.swap')}
            className="inline-flex size-12 items-center justify-center rounded-md border border-line bg-surface text-fg-muted transition-colors duration-150 hover:bg-sunken hover:text-fg active:bg-sunken"
          >
            <span className="inline-flex rotate-90 sm:rotate-0">
              <ArrowLeftRight ref={swapIconRef} className="size-4" aria-hidden="true" />
            </span>
          </button>
        </div>

        <StationField
          label={t('route.to')}
          placeholder={t('route.toPlaceholder')}
          value={to}
          onChange={(next) => {
            setTo(next)
            setError(null)
          }}
          invalid={error === 'route.errorTo' || error === 'route.errorSame'}
          describedBy="route-feedback"
          inputRef={toRef}
          name="to-station"
        />
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-fg-subtle">{t('route.quick')}</span>
          {quickRoutes.map((route) => (
            <button
              key={`${route.from}-${route.to}`}
              type="button"
              onClick={() => applyQuickRoute(route)}
              className="rounded-md border border-line px-2 py-1 font-mono text-xs font-semibold text-fg-muted transition-colors duration-150 hover:border-line-strong hover:bg-sunken hover:text-fg"
            >
              {route.from} → {route.to}
            </button>
          ))}
        </div>

        <Button type="submit" size="lg" className="w-full shrink-0 whitespace-nowrap sm:w-auto">
          <Search className="size-4" aria-hidden="true" />
          {t('route.submit')}
        </Button>
      </div>

      <div id="route-feedback" className="mt-3 empty:mt-0">
        {error ? <FieldMessage tone="error">{t(error)}</FieldMessage> : null}
      </div>
    </form>
  )
}
