import { FlaskConical } from 'lucide-react'
import { useLanguage } from '../../context/LanguageProvider'
import { cn } from '../../lib/cn'

function Minutes({ value, tone = 'auto' }) {
  const { t } = useLanguage()

  return (
    <span
      className={cn(
        'shrink-0 font-mono text-sm font-semibold tabular-nums',
        tone === 'plain' && 'text-fg',
        tone === 'auto' && (value > 0 ? 'text-danger' : value < 0 ? 'text-brand' : 'text-fg-subtle'),
      )}
    >
      {value > 0 ? `+${value}` : value < 0 ? `${value}` : '0'} {t('unit.min')}
    </span>
  )
}

/**
 * Explains the gap between how late the train is now and how late RailSense
 * expects it to be at the destination — not a restatement of either figure.
 *
 * The paragraph is generated from the same factors the table below itemises
 * (`getEtaExplanation`), so it re-words itself as the forecast moves instead of
 * describing conditions the train has already left behind.
 */
export function WhyThisETA({ breakdown, explanation, destinationName, className }) {
  const { t } = useLanguage()

  // Factor labels arrive as keys so the prose names a cause exactly the way the
  // table row beneath it does.
  const say = ({ key, params }) =>
    t(key, {
      ...params,
      ...(params.causeKey ? { cause: t(params.causeKey) } : null),
      ...(params.sectionKey ? { section: t(params.sectionKey) } : null),
    })

  return (
    <section
      aria-labelledby="why-title"
      className={cn('rounded-lg border border-line bg-surface p-5', className)}
    >
      <h2 id="why-title" className="text-base font-bold text-fg">
        {t('why.title')}
      </h2>
      <p className="mt-1.5 text-sm leading-6 text-fg-muted">
        {explanation.map(say).join(' ')}
      </p>

      <dl className="mt-4 border-t border-line pt-3">
        <div className="flex items-center justify-between gap-4">
          <dt className="text-sm text-fg">{t('why.currentDelay')}</dt>
          <dd>
            <Minutes value={breakdown.currentDelayMinutes} tone="plain" />
          </dd>
        </div>
      </dl>

      <ul className="mt-3 divide-y divide-line border-y border-line">
        {breakdown.factors.map((factor) => (
          <li key={factor.id} className="flex items-center justify-between gap-4 py-2">
            <span className="min-w-0 text-sm text-fg">{t(factor.labelKey)}</span>
            <Minutes value={factor.minutes} />
          </li>
        ))}
      </ul>

      <div className="mt-3 flex items-center justify-between gap-4">
        <span className="text-sm font-semibold text-fg">
          {t('why.predictedAt', { station: destinationName })}
        </span>
        <span className="shrink-0 font-mono text-sm font-bold tabular-nums text-fg">
          {breakdown.predictedDelayMinutes > 0 ? `+${breakdown.predictedDelayMinutes}` : breakdown.predictedDelayMinutes}{' '}
          {t('unit.min')}
        </span>
      </div>

      <p className="mt-4 flex items-start gap-2 rounded-md bg-sunken px-3 py-2.5 text-xs leading-5 text-fg-muted">
        <FlaskConical className="mt-0.5 size-3.5 shrink-0 text-fg-subtle" aria-hidden="true" />
        {t('why.disclaimer')}
      </p>
    </section>
  )
}
