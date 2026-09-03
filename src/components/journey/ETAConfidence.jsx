import { ShieldAlert, ShieldCheck, ShieldQuestion } from 'lucide-react'
import { useLanguage } from '../../context/LanguageProvider'
import { cn } from '../../lib/cn'

const LEVELS = {
  high: { icon: ShieldCheck, tone: 'text-brand', bar: 'bg-brand', filled: 3 },
  medium: { icon: ShieldQuestion, tone: 'text-caution', bar: 'bg-caution', filled: 2 },
  low: { icon: ShieldAlert, tone: 'text-danger', bar: 'bg-danger', filled: 1 },
}

/**
 * How much to trust the forecast (§19).
 *
 * Three named levels, never a false-precision percentage. The margin shown is
 * the real number the connection check uses, so a passenger can see why a
 * medium-confidence run needs a wider buffer to be called safe.
 *
 * Both the level and the reason are derived in `src/lib/simulation.js` from how
 * many minutes are still in play ahead and how unsettled conditions are, so
 * confidence rises as the train nears its destination and falls when the
 * factors start swinging.
 */
export function ETAConfidence({ confidence, className }) {
  const { t } = useLanguage()
  const level = LEVELS[confidence.level] ?? LEVELS.medium
  const Icon = level.icon

  return (
    <section
      aria-labelledby="confidence-title"
      className={cn('rounded-lg border border-line bg-surface p-5', className)}
    >
      <h2 id="confidence-title" className="text-base font-bold text-fg">
        {t('confidence.title')}
      </h2>

      <p className={cn('mt-3 flex items-center gap-2 text-lg font-bold', level.tone)}>
        <Icon className="size-5 shrink-0" aria-hidden="true" />
        {t(`confidence.${confidence.level}`)}
      </p>

      <div className="mt-3 flex gap-1" aria-hidden="true">
        {[1, 2, 3].map((step) => (
          <span
            key={step}
            className={cn('h-1.5 flex-1 rounded-full', step <= level.filled ? level.bar : 'bg-sunken')}
          />
        ))}
      </div>

      <p className="mt-3 text-sm leading-6 text-fg-muted">
        {t(confidence.reason.key, {
          ...confidence.reason.params,
          cause: t(confidence.reason.params.causeKey),
          section: t(confidence.reason.params.sectionKey),
        })}
      </p>

      <p className="mt-3 border-t border-line pt-3 text-xs leading-5 text-fg-subtle">
        {t('confidence.margin', { minutes: confidence.marginMinutes })}
      </p>
    </section>
  )
}
