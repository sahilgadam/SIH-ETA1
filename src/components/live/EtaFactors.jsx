import { useLanguage } from '../../context/LanguageProvider'
import { severityFor } from '../../lib/etaFactors'
import { Mono } from '../ui/Mono'

/**
 * The "Why this ETA?" breakdown.
 *
 * Reads one `etaFactors(train, minutes)` result and lays it out as a balance:
 * the delay the service is carrying now, the named conditions that add to it
 * between here and the terminus, the margin that gives some back, and the
 * predicted delay on arrival as the total.
 *
 * The column adds up. `etaFactors` reconciles its integers against the two
 * numbers this screen prints — the delay now and the predicted delay — before
 * handing them over, so a reader can total the rows themselves and land on the
 * arrival time shown above. Severity comes from the same minutes as the figure
 * beside it, which is why the badge can never say "heavy" against nothing.
 */

const LABEL_KEY = {
  currentDelay: 'why.currentDelay',
  traffic: 'why.traffic',
  stationCongestion: 'why.stationCongestion',
  restriction: 'why.restriction',
  weather: 'why.weather',
  recovery: 'why.recovery',
}

const SEVERITY_TONE = {
  clear: 'border-brand text-brand-text',
  light: 'border-line-strong text-fg-muted',
  moderate: 'border-caution text-caution',
  heavy: 'border-danger text-danger',
  unknown: 'border-line text-fg-subtle',
}

/** Signed minutes, never bare "-0" and never an unreadable "NaN". */
function signed(value, direction) {
  if (!Number.isFinite(value)) return '—'
  const n = Math.round(value)
  if (direction === 'gain') return n === 0 ? '0' : `−${Math.abs(n)}`
  if (n === 0) return '0'
  return n > 0 ? `+${n}` : `−${Math.abs(n)}`
}

function SeverityChip({ severity }) {
  const { t } = useLanguage()
  return (
    <span
      className={`inline-flex items-center gap-1.5 border px-1.5 py-0.5 font-mono text-[0.5625rem] font-semibold uppercase tracking-[var(--tracking-rail)] ${SEVERITY_TONE[severity] ?? SEVERITY_TONE.unknown}`}
    >
      <span className="size-1.5 shrink-0 rounded-full bg-current" aria-hidden="true" />
      {t(`condition.${severity}`)}
    </span>
  )
}

export function EtaFactors({ train, breakdown }) {
  const { t } = useLanguage()
  if (!breakdown) return null

  const { currentDelay, predictedDelay, lossMin, recoveryMin, factors, hasFactors } = breakdown
  const station = train.destination.name

  const rows = [
    {
      id: 'currentDelay',
      minutes: currentDelay,
      direction: currentDelay < 0 ? 'gain' : 'loss',
      severity: severityFor(currentDelay),
    },
    ...factors.map((factor) => ({
      id: factor.id,
      minutes: factor.minutes,
      direction: 'loss',
      severity: factor.severity,
    })),
  ]

  // Recovery is only ever shown when there is some — a row reading "recovered
  // 0 minutes" is noise, and "when applicable" is the whole point of it.
  if (recoveryMin > 0) {
    rows.push({
      id: 'recovery',
      minutes: recoveryMin,
      direction: 'gain',
      severity: severityFor(recoveryMin),
    })
  }

  // One sentence that has to agree with the table above it in every state the
  // simulation can reach: late, early, holding steady, recovering, or run out.
  const balanceKey = !hasFactors
    ? 'why.noFactors'
    : currentDelay < 0
      ? 'why.balanceEarly'
      : lossMin > 0 && recoveryMin > 0
        ? 'why.balanceLate'
        : lossMin > 0
          ? 'why.balanceLosing'
          : recoveryMin > 0
            ? 'why.balanceRecovering'
            : currentDelay > 0
              ? 'why.balanceHeld'
              : 'why.balanceOnTime'

  return (
    <div>
      <h3 className="font-mono text-[0.6875rem] font-semibold uppercase tracking-[var(--tracking-rail)] text-fg">
        {t('why.factorsTitle')}
      </h3>
      <p className="mt-1.5 max-w-prose text-[0.8125rem] leading-6 text-fg-muted">
        {t('why.factorsLead')}
      </p>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[28rem] border-collapse text-left">
          <thead>
            <tr className="border-b border-line-strong">
              {[t('why.colFactor'), t('why.colCondition'), t('why.colEffect')].map((head, i) => (
                <th
                  key={head}
                  scope="col"
                  className={`pb-2 font-mono text-[0.5625rem] font-semibold uppercase tracking-[var(--tracking-rail)] text-fg-muted ${
                    i === 2 ? 'text-right' : 'pr-4'
                  }`}
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-line">
            {rows.map((row) => (
              <tr key={row.id}>
                <th scope="row" className="py-2.5 pr-4 font-normal align-top">
                  <span className="block text-[0.8125rem] font-medium text-fg">
                    {t(LABEL_KEY[row.id] ?? row.id)}
                  </span>
                  <span className="mt-0.5 block max-w-[24rem] text-[0.6875rem] leading-5 text-fg-muted">
                    {t(`why.note.${row.id}`)}
                  </span>
                </th>
                <td className="py-2.5 pr-4 align-top">
                  <SeverityChip severity={row.severity} />
                </td>
                <td className="py-2.5 text-right align-top">
                  <Mono
                    className={`text-sm font-bold tabular-nums ${
                      row.direction === 'gain'
                        ? 'text-brand-text'
                        : row.minutes > 0
                          ? 'text-caution'
                          : 'text-fg-muted'
                    }`}
                  >
                    {signed(row.minutes, row.direction)}
                  </Mono>
                  <span className="ml-1 text-[0.625rem] text-fg-muted">{t('unit.min')}</span>
                </td>
              </tr>
            ))}
          </tbody>

          {/* The total is the number the rest of the page is built on. */}
          <tfoot>
            <tr className="border-t-2 border-fg">
              <th scope="row" className="py-2.5 pr-4 text-left">
                <span className="text-[0.8125rem] font-semibold text-fg">
                  {t('why.predictedAt', { station })}
                </span>
              </th>
              <td />
              <td className="py-2.5 text-right">
                <Mono
                  className={`text-base font-bold tabular-nums ${
                    predictedDelay > 0 ? 'text-caution' : 'text-brand-text'
                  }`}
                >
                  {signed(predictedDelay, 'loss')}
                </Mono>
                <span className="ml-1 text-[0.625rem] text-fg-muted">{t('unit.min')}</span>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <p className="mt-4 max-w-prose text-[0.9375rem] leading-6 text-fg">
        {t(balanceKey, {
          current: Math.abs(currentDelay),
          loss: lossMin,
          recovery: recoveryMin,
          predicted: Math.abs(predictedDelay),
          station,
        })}
      </p>

      <p className="mt-3 font-mono text-[0.5625rem] uppercase tracking-[var(--tracking-rail)] text-fg-muted">
        {t('why.factorsNote')}
      </p>
    </div>
  )
}
