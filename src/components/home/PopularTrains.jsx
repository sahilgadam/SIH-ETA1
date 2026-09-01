import { ChevronRight } from 'lucide-react'
import { popularTrains } from '../../data/trains'
import { useLanguage } from '../../context/LanguageProvider'
import { cn } from '../../lib/cn'

export function PopularTrains({ onSelectTrain }) {
  const { t } = useLanguage()

  return (
    <section id="popular-trains" aria-labelledby="popular-title" className="scroll-mt-20">
      <div className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h2 id="popular-title" className="text-lg font-bold tracking-tight text-fg">
            {t('popular.title')}
          </h2>
          <p className="text-sm text-fg-muted">{t('popular.description')}</p>
        </div>

        <ul className="mt-4 grid overflow-hidden rounded-lg border border-line bg-surface lg:grid-cols-2">
          {popularTrains.map((train, index) => (
            <li
              key={train.number}
              className={cn(
                'min-w-0 border-line',
                index < popularTrains.length - 1 && 'border-b',
                'lg:[&:nth-child(odd)]:border-r',
                'lg:[&:nth-last-child(-n+2)]:border-b-0',
              )}
            >
              <button
                type="button"
                onClick={() => onSelectTrain(train)}
                className="group flex w-full items-center gap-3.5 px-4 py-3.5 text-left transition-colors duration-150 hover:bg-sunken active:bg-sunken"
              >
                <span className="shrink-0 rounded-md border border-line bg-sunken px-2 py-1 font-mono text-sm font-semibold text-fg">
                  {train.number}
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-fg">
                    {train.name}
                  </span>
                  <span className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-fg-muted">
                    <span className="font-mono font-semibold">
                      {train.from.code}
                      <span aria-hidden="true"> → </span>
                      <span className="sr-only"> to </span>
                      {train.to.code}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>
                      <span className="sr-only">{t('popular.departs')} </span>
                      {train.departs}
                      <span aria-hidden="true">–</span>
                      <span className="sr-only">, {t('popular.arrives')} </span>
                      {train.arrives}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>
                      <span className="sr-only">{t('popular.duration')} </span>
                      {train.duration}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>
                      <span className="sr-only">{t('popular.runsOn')} </span>
                      {train.runsOn}
                    </span>
                  </span>
                </span>

                <ChevronRight
                  className="size-4 shrink-0 text-fg-subtle transition-colors duration-150 group-hover:text-fg"
                  aria-hidden="true"
                />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
