import { useEffect, useMemo, useRef, useState } from 'react'
import { useLanguage } from '../../context/LanguageProvider'
import { useNetwork } from '../../context/NetworkProvider'
import {
  CONNECTION_STATUS,
  connectingServicesAt,
  MIN_TRANSFER_MIN,
  predictConnection,
} from '../../lib/connections'
import { formatClock } from '../../lib/railSim'
import { Eyebrow } from '../ui/Eyebrow'
import { Mono } from '../ui/Mono'

/**
 * "Will I make my connection?"
 *
 * Three choices — my train, where I change, what I change to — and then a
 * prediction taken straight from the shared simulation. Because the arrival
 * side of the sum is the same propagated ETA the map is drawing, the transfer
 * window narrows on its own as the incoming service loses time; nothing here
 * is recalculated independently.
 */

const TONE = {
  brand: {
    text: 'text-brand-text',
    border: 'border-brand',
    bg: 'bg-brand-soft',
    bar: 'var(--brand)',
  },
  caution: {
    text: 'text-caution',
    border: 'border-caution',
    bg: 'bg-caution-soft',
    bar: 'var(--caution)',
  },
  danger: {
    text: 'text-danger',
    border: 'border-danger',
    bg: 'bg-danger-soft',
    bar: 'var(--danger)',
  },
}

function Step({ index, label, children }) {
  return (
    <div className="min-w-0">
      <p className="flex items-center gap-2 font-mono text-[0.5625rem] uppercase tracking-[var(--tracking-rail)] text-fg-subtle">
        <span className="grid size-4 place-items-center border border-line-strong text-[0.5rem] font-bold text-fg-muted">
          {index}
        </span>
        {label}
      </p>
      <div className="mt-2">{children}</div>
    </div>
  )
}

function Select({ value, onChange, children, label }) {
  return (
    <select
      value={value ?? ''}
      onChange={(event) => onChange(event.target.value || null)}
      aria-label={label}
      className="w-full border border-line bg-surface px-2.5 py-2 font-mono text-xs text-fg outline-none focus-visible:border-brand"
    >
      {children}
    </select>
  )
}

/**
 * The transfer, drawn (§9).
 *
 * Two rails and the gap between them. The gap's width is the transfer window
 * to scale, so a shrinking connection visibly closes rather than only
 * changing a number, and the bar animates when the prediction moves.
 */
function TransferTimeline({ prediction }) {
  const tone = TONE[CONNECTION_STATUS[prediction.status].tone]
  const barRef = useRef(null)

  // Window as a share of a 40-minute reference, so the geometry is comparable
  // between predictions rather than always filling the track.
  const share = Math.max(0, Math.min(prediction.transferMin / 40, 1))

  useEffect(() => {
    if (barRef.current) barRef.current.style.width = `${Math.max(share * 100, 3)}%`
  }, [share])

  return (
    <div className="mt-5 border border-line bg-surface p-4">
      {/* Incoming service */}
      <div className="flex items-baseline justify-between gap-3">
        <p className="font-mono text-[0.5625rem] uppercase tracking-[var(--tracking-rail)] text-fg-subtle">
          Arriving · {prediction.train.number}
        </p>
        <Mono className="text-sm font-semibold tabular-nums text-fg">
          {formatClock(prediction.arrival)}
        </Mono>
      </div>
      <div className="relative mt-2 h-px w-full bg-line-strong">
        <span className="absolute right-0 top-1/2 size-2.5 -translate-y-1/2 rounded-full bg-fg" aria-hidden="true" />
      </div>

      {/* The window */}
      <div className="my-3 pl-1">
        <div className="flex items-center gap-2.5">
          <div className="h-2 flex-1 bg-sunken">
            <div
              ref={barRef}
              className="h-full transition-[width] duration-500 ease-[var(--ease-rail)] motion-reduce:transition-none"
              style={{ width: '3%', background: tone.bar }}
            />
          </div>
          <Mono className={`shrink-0 text-sm font-bold tabular-nums ${tone.text}`}>
            {prediction.transferMin >= 0 ? `${prediction.transferMin} min` : `${prediction.transferMin} min`}
          </Mono>
        </div>
        <p className="mt-1.5 font-mono text-[0.5625rem] uppercase tracking-[var(--tracking-rail)] text-fg-subtle">
          Transfer window at {prediction.station.code}
          {prediction.lostMin > 0 ? ` · ${prediction.lostMin} min lost to delay` : ''}
        </p>
      </div>

      {/* Connecting service */}
      <div className="relative mt-2 h-px w-full bg-line-strong">
        <span className="absolute left-0 top-1/2 size-2.5 -translate-y-1/2 rounded-full bg-fg" aria-hidden="true" />
      </div>
      <div className="mt-2 flex items-baseline justify-between gap-3">
        <p className="font-mono text-[0.5625rem] uppercase tracking-[var(--tracking-rail)] text-fg-subtle">
          Departing · {prediction.connecting.number}
        </p>
        <Mono className="text-sm font-semibold tabular-nums text-fg">
          {formatClock(prediction.departure)}
        </Mono>
      </div>
    </div>
  )
}

export function ConnectionPlanner({ stationCode, fixedTrain, onSelectTrain, headingId }) {
  const { t } = useLanguage()
  const { trains } = useNetwork()

  const [myNumber, setMyNumber] = useState(fixedTrain?.number ?? null)
  const [connNumber, setConnNumber] = useState(null)
  // Where the passenger changes. In train-first mode they pick it from the
  // calls still ahead of the service they are already on.
  const [changeAt, setChangeAt] = useState(null)

  // Services that actually call here, for the "my train" choice.
  const calling = useMemo(
    () => (stationCode ? trains.filter((t2) => t2.stops.some((stop) => stop.code === stationCode)) : []),
    [trains, stationCode],
  )

  // Calls this service has not reached yet — the only places a passenger
  // still on board could actually change.
  const interchanges = useMemo(
    () =>
      fixedTrain
        ? fixedTrain.timeline.filter((stop) => stop.state !== 'past').slice(0, -1)
        : [],
    [fixedTrain],
  )

  // Keep the chosen interchange valid as the train runs past stations, and
  // default to one that actually has onward services — offering a station
  // whose dropdown is then empty is a dead end for the passenger.
  const firstUsable = useMemo(() => {
    if (!fixedTrain) return null
    const withOptions = interchanges.find(
      (stop) => connectingServicesAt(stop.code, fixedTrain, trains).length > 0,
    )
    return (withOptions ?? interchanges[0])?.code ?? null
  }, [fixedTrain, interchanges, trains])

  const activeStation = fixedTrain
    ? (interchanges.find((stop) => stop.code === changeAt)?.code ?? firstUsable)
    : stationCode

  // Reset the pair whenever the station changes — a connection at Kanpur is
  // meaningless once the user is looking at Howrah.
  const resetKey = fixedTrain ? `train:${fixedTrain.number}` : `station:${stationCode}`
  const [lastKey, setLastKey] = useState(resetKey)
  if (lastKey !== resetKey) {
    setLastKey(resetKey)
    setMyNumber(fixedTrain?.number ?? null)
    setConnNumber(null)
    setChangeAt(null)
  }

  const myTrain = fixedTrain ?? calling.find((train) => train.number === myNumber) ?? null

  const options = useMemo(
    () => (myTrain && activeStation ? connectingServicesAt(activeStation, myTrain, trains) : []),
    [myTrain, activeStation, trains],
  )

  const connecting = options.find((option) => option.train.number === connNumber)?.train ?? null

  const prediction = useMemo(
    () => predictConnection({ train: myTrain, code: activeStation, connecting, trains }),
    [myTrain, activeStation, connecting, trains],
  )

  const status = prediction ? CONNECTION_STATUS[prediction.status] : null
  const tone = status ? TONE[status.tone] : null

  return (
    <section aria-labelledby={headingId ?? "connection-title"} className="border border-line bg-page p-4 sm:p-5">
      <Eyebrow as="p">{t('connect.eyebrow')}</Eyebrow>
      <h2 id={headingId ?? "connection-title"} className="mt-2 font-display text-2xl font-medium text-fg">
        {t('connect.title')}
      </h2>
      <p className="mt-2 max-w-prose text-sm leading-6 text-fg-muted">{t('connect.lead')}</p>

      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <Step index="1" label={t('connect.step1')}>
          {fixedTrain ? (
            <p className="truncate border border-line bg-sunken px-2.5 py-2 font-mono text-xs text-fg">
              {fixedTrain.number} · {fixedTrain.name}
            </p>
          ) : (
            <Select value={myNumber} onChange={setMyNumber} label={t('connect.step1')}>
              <option value="">{t('connect.choose')}</option>
              {calling.map((train) => (
                <option key={train.number} value={train.number}>
                  {train.number} · {train.name.slice(0, 34)}
                </option>
              ))}
            </Select>
          )}
        </Step>

        <Step index="2" label={t('connect.step2')}>
          {fixedTrain ? (
            <Select value={activeStation} onChange={setChangeAt} label={t('connect.step2')}>
              {interchanges.map((stop) => {
                const count = connectingServicesAt(stop.code, fixedTrain, trains).length
                return (
                  <option key={stop.code} value={stop.code}>
                    {stop.name} ({stop.code}) ·{' '}
                    {formatClock(stop.predictedArrMin ?? stop.predictedDepMin)}
                    {count ? ` · ${count} onward` : ' · none'}
                  </option>
                )
              })}
            </Select>
          ) : (
            <p className="border border-line bg-sunken px-2.5 py-2 font-mono text-xs text-fg">
              {stationCode}
            </p>
          )}
        </Step>

        <Step index="3" label={t('connect.step3')}>
          {myTrain && options.length === 0 ? (
            <p className="border border-dashed border-line px-2.5 py-2 text-[0.6875rem] leading-5 text-fg-muted">
              {t('connect.noneHere')}
            </p>
          ) : (
            <Select value={connNumber} onChange={setConnNumber} label={t('connect.step3')}>
              <option value="">{myTrain ? t('connect.choose') : t('connect.chooseFirst')}</option>
              {options.map((option) => (
                <option key={option.train.number} value={option.train.number}>
                  {option.train.number} → {option.train.destination.code} ·{' '}
                  {formatClock(option.departure)}
                </option>
              ))}
            </Select>
          )}
        </Step>
      </div>

      {/* Verdict */}
      {prediction ? (
        <div aria-live="polite">
          <div className={`mt-5 border-l-2 ${tone.border} ${tone.bg} px-4 py-3`}>
            <p className={`font-mono text-[0.625rem] font-semibold uppercase tracking-[var(--tracking-rail)] ${tone.text}`}>
              {status.label}
            </p>
            <p className="mt-1.5 text-sm leading-6 text-fg">
              {prediction.status === 'missed'
                ? t('connect.verdictMissed', {
                    train: prediction.connecting.number,
                    minutes: Math.abs(prediction.transferMin),
                  })
                : prediction.status === 'at-risk'
                  ? t('connect.verdictRisk', {
                      train: prediction.connecting.number,
                      minutes: prediction.transferMin,
                      min: MIN_TRANSFER_MIN,
                    })
                  : t('connect.verdictOk', {
                      train: prediction.connecting.number,
                      minutes: prediction.transferMin,
                    })}
            </p>
            <p className="mt-1.5 font-mono text-[0.625rem] text-fg-muted">
              {prediction.train.number} {t('connect.arrives')} {formatClock(prediction.arrival)}
              <span className="mx-1.5 opacity-50">·</span>
              {t('connect.booked')} {formatClock(prediction.bookedArrival)}
              <span className="mx-1.5 opacity-50">·</span>
              {prediction.connecting.number} {t('connect.departs')} {formatClock(prediction.departure)}
            </p>
          </div>

          <TransferTimeline prediction={prediction} />

          {prediction.alternatives.length ? (
            <div className="mt-4">
              <p className="font-mono text-[0.5625rem] uppercase tracking-[var(--tracking-rail)] text-fg-subtle">
                {prediction.alternativesAreOnward ? t('connect.altOnward') : t('connect.altSame')}
              </p>
              <ul className="mt-2 divide-y divide-line border border-line">
                {prediction.alternatives.map((option) => (
                  <li key={option.train.number}>
                    <button
                      type="button"
                      onClick={() => onSelectTrain?.(option.train.number)}
                      className="flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left transition-colors hover:bg-sunken"
                    >
                      <span className="min-w-0">
                        <span className="flex items-baseline gap-2">
                          <Mono className="text-sm font-bold text-fg">{option.train.number}</Mono>
                          <span className="truncate text-[0.6875rem] text-fg-muted">
                            {option.train.name}
                          </span>
                        </span>
                        <span className="mt-0.5 block font-mono text-[0.625rem] text-fg-subtle">
                          {t('connect.wait')} {option.transferMin} min
                          <span className="mx-1.5 opacity-50">·</span>
                          {t('connect.into')} {option.train.destination.code}{' '}
                          {formatClock(option.train.etaMinutes)}
                        </span>
                      </span>
                      <Mono className="shrink-0 text-sm font-semibold tabular-nums text-fg">
                        {formatClock(option.departure)}
                      </Mono>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      ) : (
        <p className="mt-5 border border-dashed border-line px-4 py-6 text-center text-sm text-fg-subtle">
          {t('connect.empty')}
        </p>
      )}

      <p className="mt-4 font-mono text-[0.5625rem] uppercase tracking-[var(--tracking-rail)] text-fg-subtle">
        {t('connect.note')}
      </p>
    </section>
  )
}
