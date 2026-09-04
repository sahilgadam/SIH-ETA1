/**
 * "Why this ETA?" — the named conditions behind the predicted arrival.
 *
 * WHAT THIS IS, AND WHAT IT IS NOT
 *
 * It is not a second forecast. The arrival time is already decided by the
 * propagation in `railSim`; this file only *explains* it, by taking the
 * difference between the delay now and the delay predicted at the terminus and
 * splitting it into the things a passenger would recognise: traffic on the
 * line, congestion at the junctions ahead, speed restrictions, weather, and
 * the margin the timetable gives back.
 *
 * THE DECOMPOSITION IS EXACT
 *
 * Walking the remaining calls, each leg contributes two differences that come
 * straight out of the engine's own predicted-versus-booked times:
 *
 *   dwell excess(i)   = (predDep - predArr)(i)   - (bookedDep - bookedArr)(i)
 *   run excess(i→i+1) = (predArr(i+1) - predDep(i)) - (bookedArr(i+1) - bookedDep(i))
 *
 * Summed from the train's current position to the terminus, those telescope
 * *exactly* to `destinationDelay - delayMin`. So every minute shown here is a
 * minute the arrival time actually contains — the factors and the ETA cannot
 * drift apart, and the totals are reconciled to the displayed integers before
 * being returned.
 *
 * WHERE THE NAMES COME FROM
 *
 * The engine models running time, not named incidents: it knows a section is
 * costing four minutes more than booked, not that it is raining. Attributing
 * that excess across traffic / station / restriction / weather is therefore
 * demo attribution, not measurement — deterministic from the train, the
 * section and the simulated clock, so it is stable between ticks and drifts
 * slowly as the run progresses rather than flickering. The split is mock; the
 * total it is splitting is real.
 *
 * A factor's severity is read from the minutes it accounts for, never from the
 * attribution weight, so the badge can never contradict the number beside it.
 */

const isNum = (value) => typeof value === 'number' && Number.isFinite(value)

/** Deterministic 0–1 hash — same idea as `railSim`'s, kept local to the demo. */
function hash01(seed) {
  let h = 2166136261
  for (let i = 0; i < seed.length; i += 1) {
    h ^= seed.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return ((h >>> 0) % 10000) / 10000
}

/**
 * A slow, deterministic 0–1 condition index.
 *
 * The period is in *simulated minutes*, and the shortest here is over an hour
 * and a half of railway time — on the one-minute-per-minute clock that is a
 * condition that eases over an hour, which is how weather and line occupancy
 * actually behave. Nothing about this reacts to a re-render.
 */
function conditionAt(seed, minutes, periodMin) {
  const phase = hash01(seed) * Math.PI * 2
  const t = isNum(minutes) ? minutes : 0
  return (Math.sin((t / periodMin) * Math.PI * 2 + phase) + 1) / 2
}

/**
 * How each named condition is weighted when apportioning a section's lost
 * minutes. `floor` keeps a condition from ever disappearing entirely, `swing`
 * is how much of it the clock moves, and `period` is how slowly.
 *
 * Station congestion is only ever weighted on a leg that *ends at a major
 * junction* — attributing station congestion to an approach with no junction
 * on it would be an explanation of something that is not there.
 */
const CONDITIONS = [
  { id: 'traffic', floor: 0.3, swing: 0.5, period: 97, majorOnly: false },
  { id: 'stationCongestion', floor: 0.2, swing: 0.45, period: 113, majorOnly: true },
  { id: 'restriction', floor: 0.08, swing: 0.38, period: 131, majorOnly: false },
  { id: 'weather', floor: 0.06, swing: 0.42, period: 173, majorOnly: false },
]

/** Severity bands, in minutes accounted for. Ordered least to most. */
export function severityFor(minutes) {
  if (!isNum(minutes)) return 'unknown'
  const m = Math.abs(minutes)
  if (m === 0) return 'clear'
  if (m <= 2) return 'light'
  if (m <= 6) return 'moderate'
  return 'heavy'
}

/**
 * The remaining legs of the run, each with the minutes it is predicted to
 * gain or lose against the timetable.
 *
 * Starts at the call the current delay is measured against, so the chain
 * covers exactly the ground between "how late it is now" and "how late it
 * will be at the end" — no leg counted twice, none missed.
 */
function remainingLegs(train) {
  const timeline = Array.isArray(train?.timeline) ? train.timeline : []
  if (timeline.length < 2) return []

  const from = timeline.findIndex((stop) => stop.state === 'next' || stop.state === 'current')
  if (from < 0) return []

  const legs = []
  for (let i = from; i < timeline.length - 1; i += 1) {
    const a = timeline[i]
    const b = timeline[i + 1]

    const dwell =
      isNum(a.predictedDepMin) &&
      isNum(a.predictedArrMin) &&
      isNum(a.bookedDepMin) &&
      isNum(a.bookedArrMin)
        ? a.predictedDepMin - a.predictedArrMin - (a.bookedDepMin - a.bookedArrMin)
        : 0

    const run =
      isNum(a.predictedDepMin) &&
      isNum(b.predictedArrMin) &&
      isNum(a.bookedDepMin) &&
      isNum(b.bookedArrMin)
        ? b.predictedArrMin - a.predictedDepMin - (b.bookedArrMin - a.bookedDepMin)
        : 0

    legs.push({ id: `${a.code}-${b.code}`, run, dwell, endsAtMajor: Boolean(b.major) })
  }
  return legs
}

/**
 * Round a set of real-valued parts to integers whose total is the rounded
 * total. Plain per-part rounding loses or invents a minute and the column
 * stops adding up; the largest-remainder method does not.
 */
function roundParts(values) {
  const total = Math.round(values.reduce((sum, value) => sum + value, 0))
  const floors = values.map((value) => Math.floor(value))
  let left = total - floors.reduce((sum, value) => sum + value, 0)

  const order = values
    .map((value, index) => ({ index, fraction: value - Math.floor(value) }))
    .sort((a, b) => b.fraction - a.fraction)

  const out = [...floors]
  for (const entry of order) {
    if (left <= 0) break
    out[entry.index] += 1
    left -= 1
  }
  return out
}

/**
 * The complete explanation of one train's predicted arrival at `minutes`.
 *
 * Returns null only when there is no train at all. Everything else — a service
 * standing at its origin, one that has run out of route, a timeline with gaps
 * — comes back as a well-formed result with zeroed factors and `hasFactors`
 * false, so the screen shows "nothing expected to change" rather than a hole.
 */
export function etaFactors(train, minutes) {
  if (!train) return null

  const currentDelay = isNum(train.delayMin) ? Math.round(train.delayMin) : 0
  const predictedDelay = isNum(train.destinationDelay) ? Math.round(train.destinationDelay) : 0
  const wantedAhead = predictedDelay - currentDelay

  const legs = remainingLegs(train)

  // Losses split by condition; every minute the forecast gives back, whether
  // on the line or at a stand, is recovery.
  const lost = { traffic: 0, stationCongestion: 0, restriction: 0, weather: 0 }
  let gained = 0

  for (const leg of legs) {
    const weights = CONDITIONS.map((condition) =>
      condition.majorOnly && !leg.endsAtMajor
        ? 0
        : condition.floor +
          condition.swing * conditionAt(`${train.number}|${leg.id}|${condition.id}`, minutes, condition.period),
    )
    const total = weights.reduce((sum, weight) => sum + weight, 0)

    if (leg.run > 0 && total > 0) {
      CONDITIONS.forEach((condition, i) => {
        lost[condition.id] += leg.run * (weights[i] / total)
      })
    } else if (leg.run < 0) {
      gained += -leg.run
    }

    // Held longer than booked is congestion at that stop; leaving sooner is
    // margin handed back.
    if (leg.dwell > 0) lost.stationCongestion += leg.dwell
    else gained += -leg.dwell
  }

  const ids = CONDITIONS.map((condition) => condition.id)
  const rounded = roundParts(ids.map((id) => lost[id]))
  let recoveryMin = Math.max(0, Math.round(gained))

  const byId = {}
  ids.forEach((id, i) => {
    byId[id] = Math.max(0, rounded[i])
  })

  // Reconcile against the two integers the page actually prints. Rounding, and
  // the engine's refusal to report a train as early, can leave a minute
  // unaccounted for; parking it here means the column always adds up to the
  // ETA rather than to something a reader can catch out by a minute.
  const net = ids.reduce((sum, id) => sum + byId[id], 0) - recoveryMin
  const residual = wantedAhead - net
  if (residual > 0) {
    const biggest = ids.reduce((best, id) => (byId[id] > byId[best] ? id : best), 'traffic')
    byId[biggest] += residual
  } else if (residual < 0) {
    recoveryMin += -residual
  }

  const factors = ids.map((id) => ({
    id,
    minutes: byId[id],
    severity: legs.length ? severityFor(byId[id]) : 'unknown',
  }))

  const lossMin = ids.reduce((sum, id) => sum + byId[id], 0)

  return {
    currentDelay,
    predictedDelay,
    /** Net change still expected between here and the terminus. */
    ahead: wantedAhead,
    lossMin,
    recoveryMin,
    factors,
    /** True when there is any remaining route to explain. */
    hasFactors: legs.length > 0,
    /** True when something is actually expected to happen ahead. */
    hasMovement: lossMin > 0 || recoveryMin > 0,
    legCount: legs.length,
  }
}
