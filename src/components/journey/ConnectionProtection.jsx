import { AlertTriangle, CircleCheck, CircleSlash, Search, TriangleAlert } from 'lucide-react'
import { useId, useState } from 'react'
import { useLanguage } from '../../context/LanguageProvider'
import { cn } from '../../lib/cn'
import { CONNECTION_STATUS, getOnwardDepartures } from '../../lib/prediction'
import { Button } from '../ui/Button'
import { FieldMessage } from '../ui/FieldMessage'
import { SourceBadge } from '../ui/SourceBadge'
import { TextField } from '../ui/TextField'

const VERDICTS = {
  [CONNECTION_STATUS.SAFE]: {
    icon: CircleCheck,
    tone: 'text-brand',
    ring: 'border-brand/40 bg-brand-soft',
  },
  [CONNECTION_STATUS.AT_RISK]: {
    icon: TriangleAlert,
    tone: 'text-caution',
    ring: 'border-caution/40 bg-sunken',
  },
  [CONNECTION_STATUS.HIGH_RISK]: {
    icon: AlertTriangle,
    tone: 'text-danger',
    ring: 'border-danger/40 bg-danger-soft',
  },
  [CONNECTION_STATUS.MISSED]: {
    icon: CircleSlash,
    tone: 'text-danger',
    ring: 'border-danger/40 bg-danger-soft',
  },
}

function Figure({ label, value, mono = true, tone }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs text-fg-muted">{label}</dt>
      <dd
        className={cn(
          'mt-0.5 text-sm font-semibold tabular-nums',
          mono && 'font-mono',
          tone ?? 'text-fg',
        )}
      >
        {value}
      </dd>
    </div>
  )
}

/**
 * The verdict, and then why (§20, §21).
 *
 * Everything is measured against the RailSense *predicted* arrival, never the
 * current delay — that is the whole point of the feature, so the panel shows
 * the scheduled buffer alongside it to make the difference visible.
 */
function Verdict({ assessment }) {
  const { t } = useLanguage()
  const verdict = VERDICTS[assessment.status]
  const Icon = verdict.icon
  const { connection, confidence } = assessment

  return (
    <div className="mt-4">
      <div className={cn('flex items-start gap-3 rounded-md border p-3.5', verdict.ring)}>
        <Icon className={cn('mt-0.5 size-5 shrink-0', verdict.tone)} aria-hidden="true" />
        <div className="min-w-0">
          <p className={cn('text-sm font-bold', verdict.tone)}>
            {t(`connection.verdict.${assessment.status}`)}
          </p>
          <p className="mt-1 text-sm leading-6 text-fg-muted">
            {t(`connection.body.${assessment.status}`, {
              train: connection.trainNumber,
              minutes: Math.abs(assessment.bufferMinutes),
              transfer: assessment.transferMinutes,
            })}
          </p>
        </div>
      </div>

      <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-fg-subtle">
        {t('connection.whyTitle')}
      </p>

      <dl className="mt-2.5 grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3">
        <Figure
          label={t('connection.predictedArrival', { station: assessment.arrivalStationName })}
          value={assessment.predictedArrival}
        />
        <Figure label={t('connection.departure')} value={connection.scheduledDeparture} />
        <Figure
          label={t('connection.buffer')}
          value={`${assessment.bufferMinutes} ${t('unit.min')}`}
          tone={assessment.status === CONNECTION_STATUS.SAFE ? 'text-brand' : 'text-danger'}
        />
        <Figure
          label={t('connection.scheduledBuffer')}
          value={`${assessment.scheduledBufferMinutes} ${t('unit.min')}`}
          tone="text-fg-muted"
        />
        <Figure
          label={t('connection.transfer')}
          value={`${assessment.transferMinutes} ${t('unit.min')}`}
          tone="text-fg-muted"
        />
        <Figure
          label={t('connection.confidence')}
          value={t(`confidence.${confidence.level}`)}
          mono={false}
          tone="text-fg-muted"
        />
      </dl>

      <p className="mt-3.5 text-sm leading-6 text-fg-muted">
        {assessment.bufferLostMinutes > 0
          ? t('connection.explainLost', {
              lost: assessment.bufferLostMinutes,
              scheduled: assessment.scheduledBufferMinutes,
              buffer: assessment.bufferMinutes,
            })
          : t('connection.explainHeld', { minutes: assessment.bufferMinutes })}
        {' '}
        {t(`connection.explainConfidence.${confidence.level}`, { margin: confidence.marginMinutes })}
      </p>

      {connection.platform ? (
        <p className="mt-2 text-xs text-fg-subtle">
          {t('connection.onward', { name: connection.trainName, to: connection.toStation })}
        </p>
      ) : null}
    </div>
  )
}

/**
 * Connection protection. The passenger types the number of the train they are
 * changing onto; we only assess numbers we hold a departure for, and show the
 * unavailable state rather than a guessed risk for anything else (§35).
 *
 * Only the typed number is held in state. The assessment itself is recomputed
 * from the live forecast on every render, so when the simulation moves the
 * predicted arrival the risk moves with it — there is no stale verdict to go
 * out of date.
 */
export function ConnectionProtection({ journey, assessment, connectionNumber, onConnectionChange, className }) {
  const { t } = useLanguage()
  const inputId = useId()
  const errorId = `${inputId}-error`
  const [value, setValue] = useState(connectionNumber ?? '')

  const departures = getOnwardDepartures(journey)
  const isUnavailable = assessment?.status === CONNECTION_STATUS.UNAVAILABLE

  const submit = (event) => {
    event.preventDefault()
    onConnectionChange(value.trim())
  }

  return (
    <section
      aria-labelledby="connection-title"
      className={cn('rounded-lg border border-line bg-surface p-5', className)}
    >
      <h2 id="connection-title" className="text-base font-bold text-fg">
        {t('connection.title')}
      </h2>
      <p className="mt-1.5 text-sm leading-6 text-fg-muted">{t('connection.intro')}</p>

      <form onSubmit={submit} noValidate className="mt-4 flex flex-wrap items-end gap-3">
        <TextField
          id={inputId}
          label={t('connection.label')}
          placeholder={t('connection.placeholder')}
          value={value}
          inputMode="numeric"
          autoComplete="off"
          invalid={isUnavailable}
          describedBy={isUnavailable ? errorId : undefined}
          onChange={(event) => {
            setValue(event.target.value)
            // Clear the standing verdict as soon as the number is edited, so a
            // result never sits under a number it did not come from.
            if (connectionNumber) onConnectionChange('')
          }}
          className="min-w-[12rem] flex-1"
        />
        <Button type="submit" className="shrink-0">
          <Search className="size-4" aria-hidden="true" />
          {t('connection.submit')}
        </Button>
      </form>

      {departures.length ? (
        <p className="mt-2.5 text-xs leading-5 text-fg-subtle">
          {t('connection.sampleHint')}{' '}
          <span className="font-mono">{departures.map((train) => train.trainNumber).join(', ')}</span>
        </p>
      ) : null}

      {isUnavailable ? (
        <div className="mt-4">
          <FieldMessage id={errorId} tone="error">
            {t('connection.unavailable', { train: assessment.trainNumber })}
          </FieldMessage>
          <SourceBadge source="unavailable" className="mt-2" />
        </div>
      ) : null}

      {assessment && !isUnavailable ? <Verdict assessment={assessment} /> : null}
    </section>
  )
}
