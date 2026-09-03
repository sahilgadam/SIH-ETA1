import { useMemo } from 'react'
import { journeys } from '../../data/journeys'
import { useLanguage } from '../../context/LanguageProvider'
import { useClock } from '../../hooks/useClock'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { Eyebrow } from '../ui/Eyebrow'
import { Mono } from '../ui/Mono'

/** Derives the four headline counts from the same journeys every other screen reads. */
function useNetworkStats() {
  return useMemo(() => {
    const delayed = journeys.filter((journey) => journey.current.delayMinutes > 0).length
    const congestedSections = new Set(
      journeys
        .filter((journey) => journey.prediction.factors.some((f) => f.id === 'congestion' && f.minutes > 0))
        .map((journey) => journey.segments[journey.current.segmentIndex]?.id),
    ).size

    return {
      running: journeys.length,
      delayed,
      onTime: journeys.length - delayed,
      congestedSections,
    }
  }, [])
}

function Stat({ label, value, unit, tone }) {
  return (
    <div className="flex min-w-0 items-baseline gap-2 py-3 lg:flex-col lg:items-start lg:gap-1 lg:py-0">
      <Mono className={tone ?? 'text-xl font-bold leading-none text-fg sm:text-2xl'}>{value}</Mono>
      <span className="truncate text-xs font-medium text-fg-muted lg:text-[0.8125rem]">
        {label}
        {unit ? <span className="text-fg-subtle"> {unit}</span> : null}
      </span>
    </div>
  )
}

/**
 * A full-width operational readout, not four KPI cards — one thin-divided
 * strip echoing a station indicator board, reading from the same journeys
 * every other screen simulates against.
 */
export function LiveStrip() {
  const { t } = useLanguage()
  const stats = useNetworkStats()
  const clock = useClock()
  const containerRef = useScrollReveal()

  return (
    <section aria-labelledby="strip-title" className="border-b border-line bg-surface">
      <div ref={containerRef} className="mx-auto max-w-[1240px] px-4 py-5 sm:px-6">
        <div data-reveal className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <Eyebrow as="h2" id="strip-title">
            {t('strip.eyebrow')}
          </Eyebrow>
          <Mono className="text-xs font-semibold text-fg-subtle">{clock} IST</Mono>
        </div>

        <div data-reveal className="mt-4 grid grid-cols-2 divide-y divide-line border-t border-line sm:grid-cols-4 sm:divide-y-0 sm:divide-x sm:border-t-0">
          <div className="sm:pr-6">
            <Stat label={t('strip.running')} value={stats.running} unit={t('strip.sample')} />
          </div>
          <div className="sm:px-6">
            <Stat
              label={t('strip.delayed')}
              value={`${stats.delayed}/${stats.running}`}
              tone="text-xl font-bold leading-none text-danger sm:text-2xl"
            />
          </div>
          <div className="sm:px-6">
            <Stat
              label={t('strip.congested')}
              value={stats.congestedSections}
              tone="text-xl font-bold leading-none text-caution sm:text-2xl"
            />
          </div>
          <div className="sm:pl-6">
            <Stat label={t('strip.updated')} value={t('strip.justNow')} tone="text-base font-semibold leading-none text-brand-text sm:text-lg" />
          </div>
        </div>
      </div>
    </section>
  )
}
