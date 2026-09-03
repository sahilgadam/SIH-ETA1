import { TrendingDown, TrendingUp } from 'lucide-react'
import { useLanguage } from '../../context/LanguageProvider'
import { cn } from '../../lib/cn'

function Row({ label, minutes, tone = 'auto', strong = false }) {
  const { t } = useLanguage()

  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className={cn('text-sm', strong ? 'font-semibold text-fg' : 'text-fg-muted')}>{label}</dt>
      <dd
        className={cn(
          'shrink-0 font-mono tabular-nums',
          strong ? 'text-base font-bold' : 'text-sm font-semibold',
          tone === 'late' && 'text-danger',
          tone === 'good' && 'text-brand',
          tone === 'plain' && 'text-fg',
          tone === 'auto' && (minutes > 0 ? 'text-danger' : minutes < 0 ? 'text-brand' : 'text-fg'),
        )}
      >
        {minutes > 0 ? `+${minutes}` : minutes} {t('unit.min')}
      </dd>
    </div>
  )
}

/**
 * Whether the train is expected to make time back (§18).
 *
 * The three rows are the two halves of the forecast factors and their result,
 * so this panel and "Why this ETA?" are the same arithmetic shown twice — once
 * grouped into lose/gain, once itemised.
 */
export function DelayRecovery({ recovery, className }) {
  const { t } = useLanguage()
  const Icon = recovery.isNetRecovery ? TrendingDown : TrendingUp

  return (
    <section aria-labelledby="recovery-title" className={cn(className)}>
      <h2 id="recovery-title" className="flex items-center gap-2 text-base font-bold text-fg">
        <Icon
          className={cn('size-4 shrink-0', recovery.isNetRecovery ? 'text-brand' : 'text-caution')}
          aria-hidden="true"
        />
        {t('recovery.title')}
      </h2>

      <dl className="mt-4 space-y-2.5">
        <Row label={t('recovery.currentDelay')} minutes={recovery.currentDelayMinutes} tone="plain" />
        <Row label={t('recovery.additional')} minutes={recovery.additionalDelayMinutes} tone="late" />
        <Row label={t('recovery.expected')} minutes={-recovery.recoveryMinutes} tone="good" />
        <div className="border-t border-line pt-2.5">
          <Row
            label={t('recovery.atDestination', { station: recovery.destinationName })}
            minutes={recovery.destinationDelayMinutes}
            strong
          />
        </div>
      </dl>

      <p className="mt-4 text-sm leading-6 text-fg-muted">
        {recovery.recoveryMinutes > 0
          ? t('recovery.explain', {
              minutes: recovery.recoveryMinutes,
              section: t(recovery.sectionKey),
            })
          : t('recovery.none')}
      </p>
    </section>
  )
}
