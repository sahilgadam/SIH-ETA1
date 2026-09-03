import { TrainTrack } from 'lucide-react'
import { useLanguage } from '../../context/LanguageProvider'
import { useEntrance } from '../../hooks/useEntrance'
import { VoiceSearch } from '../voice/VoiceSearch'
import { DepartureBoardCard } from './DepartureBoardCard'
import { RouteSearchForm } from './RouteSearchForm'
import { TrainSearchForm } from './TrainSearchForm'

export function Hero({ onSearch, onOpenTrain }) {
  const { t } = useLanguage()
  const containerRef = useEntrance({ delay: 60 })

  return (
    <section id="top" className="track-backdrop border-b border-line">
      <div
        ref={containerRef}
        className="mx-auto max-w-[1200px] px-4 py-9 sm:px-6 lg:py-12"
      >
        <div className="grid items-start gap-6 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <h1
              data-enter
              className="text-3xl font-bold tracking-tight text-fg sm:text-4xl lg:text-[2.625rem] lg:leading-[1.1]"
            >
              {t('hero.title')}
            </h1>
            <p data-enter className="mt-2.5 max-w-xl text-base leading-7 text-fg-muted">
              {t('hero.subtitle')}
            </p>
            <p data-enter className="mt-1.5 flex items-center gap-1.5 text-sm text-fg-subtle">
              <TrainTrack className="size-3.5" aria-hidden="true" />
              {t('hero.note')}
            </p>

            <div
              data-enter
              id="find-train"
              className="mt-5 scroll-mt-24 rounded-lg border border-line bg-surface p-5 shadow-sm shadow-black/[0.03] sm:p-6"
            >
              <RouteSearchForm onSearch={onSearch} />

              <div className="my-5 flex items-center gap-3" aria-hidden="true">
                <span className="h-px flex-1 bg-line" />
                <span className="text-xs font-medium uppercase tracking-wide text-fg-subtle">
                  {t('common.or')}
                </span>
                <span className="h-px flex-1 bg-line" />
              </div>

              <TrainSearchForm onSearch={onSearch} />

              <div className="my-5 flex items-center gap-3" aria-hidden="true">
                <span className="h-px flex-1 bg-line" />
                <span className="text-xs font-medium uppercase tracking-wide text-fg-subtle">
                  {t('common.or')}
                </span>
                <span className="h-px flex-1 bg-line" />
              </div>

              {/* Voice is a third way into the same search, not a separate page. */}
              <VoiceSearch bare onOpenTrain={onOpenTrain} />
            </div>
          </div>

          <div data-enter className="lg:col-span-5">
            <DepartureBoardCard className="h-full scroll-mt-24" onSearch={onSearch} />
          </div>
        </div>
      </div>
    </section>
  )
}
