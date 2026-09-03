/**
 * The Ask RailSense query engine.
 *
 * ONE engine serves both the microphone and the text box (§14). Voice produces
 * a transcript, typing produces a string, and from that point the path is
 * identical: parse → resolve against the live simulation → answer → act on the
 * interface. There is no separate "voice logic", which is what stops the two
 * from drifting apart.
 *
 * It is deterministic, not a chatbot. Every answer is computed from the same
 * `railSim` state the map and timeline render, so the assistant can never
 * report a position or an ETA that disagrees with what is on screen. Anything
 * it cannot parse returns `unknown` and says so rather than inventing a reply.
 *
 * Answers are returned as `{ key, params }` and rendered through the app's
 * translation table, so the spoken sentence and the printed sentence are the
 * same string in whichever language is active.
 */

import { liveTrains } from '../data/liveTrains'
import { callsAtStation, formatClock, networkStations, stationByCode } from './railSim'

// ---------------------------------------------------------------------------
// Lexicon
// ---------------------------------------------------------------------------

/** Distinctive words in service names, for "how late is Rajdhani". */
const NAME_KEYWORDS = [
  'rajdhani', 'shatabdi', 'vande bharat', 'coromandel', 'tamil nadu',
  'karnataka', 'udyan', 'punjab mail', 'duronto', 'garib rath',
]

const INTENT_HINTS = {
  eta: ['when', 'reach', 'arrive', 'arrival', 'eta', 'get to', 'reaching', 'कब', 'पहुंच', 'पहुँच'],
  delay: ['late', 'delay', 'delayed', 'behind', 'running late', 'देरी', 'लेट'],
  locate: ['where', 'location', 'position', 'currently', 'कहाँ', 'कहां'],
  next: ['next station', 'next stop', 'next halt', 'अगला'],
  list: ['which trains', 'what trains', 'show me', 'list', 'trains from', 'trains to', 'trains at', 'arriving'],
}

const includesAny = (text, hints) => hints.some((h) => text.includes(h))

/**
 * Pull a train number from a transcript.
 *
 * Recognisers return "12952", "1 2 9 5 2" and "129 52" for the same utterance,
 * so digits are also collected across the whole string as a fallback.
 */
export function extractTrainNumber(text) {
  const direct = text.match(/\b(\d{4,5})\b/)
  if (direct) return direct[1]
  const digits = text.replace(/\D/g, '')
  return digits.length >= 4 && digits.length <= 5 ? digits : null
}

const norm = (s) => s.toLowerCase().replace(/\s+(jn|junction|central|cantt|city)\.?$/i, '').trim()

/** Stations mentioned in the text, longest name first so "New Delhi" beats "Delhi". */
export function extractStations(text) {
  const lower = ` ${text.toLowerCase()} `
  const found = []

  for (const station of [...networkStations].sort((a, b) => b.name.length - a.name.length)) {
    const name = station.name.toLowerCase()
    const bare = norm(station.name)
    const codeHit = new RegExp(`\\b${station.code.toLowerCase()}\\b`).test(lower)
    if (lower.includes(name) || (bare.length >= 4 && lower.includes(bare)) || codeHit) {
      if (!found.some((s) => s.code === station.code)) found.push(station)
    }
  }
  return found
}

/** Resolve the service the question is about. */
function resolveTrain(text, trains) {
  const number = extractTrainNumber(text)
  if (number) {
    const byNumber = trains.find((t) => t.number === number)
    if (byNumber) return { train: byNumber, number }
    return { train: null, number }
  }

  const lower = text.toLowerCase()
  const keyword = NAME_KEYWORDS.find((k) => lower.includes(k))
  if (keyword) {
    // Prefer the most delayed match — "how late is Rajdhani" is asking about
    // the one that is actually in trouble.
    const matches = trains.filter((t) => t.name.toLowerCase().includes(keyword))
    if (matches.length) {
      const best = [...matches].sort((a, b) => b.delayMin - a.delayMin)[0]
      return { train: best, number: best.number, ambiguous: matches.length > 1, matches }
    }
  }
  return { train: null, number: null }
}

// ---------------------------------------------------------------------------
// Parsing
// ---------------------------------------------------------------------------

/**
 * Classify a question. Natural variations of the same request — "where is
 * 12952", "where's 12952", "12952 location", "tell me about 12952" — all land
 * on the same intent.
 */
export function parseQuery(text) {
  const clean = text.trim()
  const lower = clean.toLowerCase()
  if (!clean) return { intent: 'unknown', text: clean }

  const stations = extractStations(clean)
  const number = extractTrainNumber(lower)

  // "New Delhi to Mumbai" / "trains from NDLS to BCT"
  const pair = lower.match(/\bfrom\s+(.+?)\s+to\s+(.+)$/) ?? lower.match(/^(.+?)\s+to\s+(.+)$/)
  const isList = includesAny(lower, INTENT_HINTS.list)

  if (pair && stations.length >= 2 && !number) {
    const fromStation = extractStations(pair[1])[0]
    const toStation = extractStations(pair[2])[0]
    if (fromStation && toStation && fromStation.code !== toStation.code) {
      // "delay between A and B" is a section question, not a search.
      if (includesAny(lower, INTENT_HINTS.delay)) {
        return { intent: 'section', from: fromStation, to: toStation, text: clean }
      }
      return { intent: 'between', from: fromStation, to: toStation, text: clean }
    }
  }

  if (/\bbetween\b/.test(lower) && stations.length >= 2 && includesAny(lower, INTENT_HINTS.delay)) {
    return { intent: 'section', from: stations[0], to: stations[1], text: clean }
  }

  if (isList && !number) {
    if (stations.length) return { intent: 'arrivals', station: stations[0], text: clean }
    if (includesAny(lower, INTENT_HINTS.delay)) return { intent: 'delayedList', text: clean }
    return { intent: 'delayedList', text: clean }
  }

  if (includesAny(lower, INTENT_HINTS.next)) return { intent: 'next', number, stations, text: clean }
  if (includesAny(lower, INTENT_HINTS.eta)) return { intent: 'eta', number, stations, text: clean }
  if (includesAny(lower, INTENT_HINTS.delay)) return { intent: 'delay', number, stations, text: clean }
  if (includesAny(lower, INTENT_HINTS.locate)) return { intent: 'locate', number, stations, text: clean }

  // A bare station is a departure-board request; a bare train is "tell me about it".
  if (!number && stations.length === 1) return { intent: 'arrivals', station: stations[0], text: clean }
  if (number || NAME_KEYWORDS.some((k) => lower.includes(k))) {
    return { intent: 'locate', number, stations, text: clean }
  }

  return { intent: 'unknown', text: clean }
}

// ---------------------------------------------------------------------------
// Answering
// ---------------------------------------------------------------------------

/**
 * Answer a parsed query from the current simulation.
 *
 * Returns `{ key, params, actions, results }`:
 *   key/params → rendered through `t()` for both display and speech
 *   actions    → what the interface should do (select a train, focus a
 *                station, highlight a stop) so the answer drives the UI (§16)
 *   results    → train numbers to list under the answer
 */
export function answerQuery(query, trains) {
  const unknown = { key: 'ask.unknown', params: {}, actions: [], results: [] }
  if (query.intent === 'unknown') return unknown

  // --- fleet-wide questions ------------------------------------------------
  if (query.intent === 'delayedList') {
    const late = trains.filter((t) => t.delayMin > 3).sort((a, b) => b.delayMin - a.delayMin)
    if (!late.length) return { key: 'ask.noneDelayed', params: {}, actions: [], results: [] }
    return {
      key: 'ask.delayedList',
      params: { count: late.length, train: late[0].number, minutes: late[0].delayMin },
      actions: [],
      results: late.map((t) => t.number),
    }
  }

  if (query.intent === 'between') {
    const matches = trains.filter((t) => {
      const codes = t.stops.map((s) => s.code)
      const i = codes.indexOf(query.from.code)
      const j = codes.indexOf(query.to.code)
      return i !== -1 && j !== -1 && i < j
    })
    if (!matches.length) {
      return {
        key: 'ask.noServices',
        params: { from: query.from.name, to: query.to.name },
        actions: [],
        results: [],
      }
    }
    return {
      key: 'ask.between',
      params: { count: matches.length, from: query.from.name, to: query.to.name },
      actions: [{ type: 'focusStation', code: query.from.code }],
      results: matches.map((t) => t.number),
    }
  }

  if (query.intent === 'arrivals') {
    const calls = callsAtStation(query.station.code, trains).filter((c) => c.state !== 'past')
    return {
      key: calls.length ? 'ask.arrivals' : 'ask.noArrivals',
      params: {
        station: query.station.name,
        count: calls.length,
        time: calls.length ? formatClock(calls[0].predicted) : '',
        train: calls.length ? calls[0].train.number : '',
      },
      actions: [{ type: 'focusStation', code: query.station.code }],
      results: calls.map((c) => c.train.number),
    }
  }

  if (query.intent === 'section') {
    // Average current running penalty across services using that section.
    const relevant = []
    for (const train of trains) {
      const codes = train.stops.map((s) => s.code)
      const i = codes.indexOf(query.from.code)
      const j = codes.indexOf(query.to.code)
      if (i !== -1 && j !== -1 && Math.abs(i - j) === 1) {
        const a = train.timeline[Math.min(i, j)]
        const b = train.timeline[Math.max(i, j)]
        relevant.push(Math.max(0, (b.delayMin ?? 0) - (a.delayMin ?? 0)))
      }
    }
    if (!relevant.length) {
      return {
        key: 'ask.noSection',
        params: { from: query.from.name, to: query.to.name },
        actions: [],
        results: [],
      }
    }
    const avg = Math.round(relevant.reduce((s, n) => s + n, 0) / relevant.length)
    return {
      key: 'ask.section',
      params: { from: query.from.name, to: query.to.name, minutes: avg, count: relevant.length },
      actions: [{ type: 'focusStation', code: query.from.code }],
      results: [],
    }
  }

  // --- single-service questions -------------------------------------------
  const resolved = resolveTrain(query.text, trains)
  if (!resolved.train) {
    return resolved.number
      ? { key: 'ask.noTrain', params: { train: resolved.number }, actions: [], results: [] }
      : unknown
  }

  const train = resolved.train
  const select = { type: 'selectTrain', number: train.number }

  if (query.intent === 'next') {
    return {
      key: 'ask.next',
      params: {
        train: train.number,
        station: train.nextStation.name,
        time: formatClock(train.nextStationEtaMin),
      },
      actions: [select, { type: 'highlightStop', code: train.nextStation.code }],
      results: [train.number],
    }
  }

  if (query.intent === 'eta') {
    // "when does 12952 reach BCT" — answer for that stop if it is on the route.
    const named = (query.stations ?? []).find((s) => train.stops.some((stop) => stop.code === s.code))
    if (named) {
      const stop = train.timeline.find((s) => s.code === named.code)
      return {
        key: stop.state === 'past' ? 'ask.etaPassed' : 'ask.etaStation',
        params: {
          train: train.number,
          station: stop.name,
          time: formatClock(stop.predictedArrMin ?? stop.predictedDepMin),
          booked: formatClock(stop.bookedArrMin ?? stop.bookedDepMin),
          minutes: stop.delayMin,
        },
        actions: [select, { type: 'highlightStop', code: stop.code }],
        results: [train.number],
      }
    }
    return {
      key: 'ask.etaDestination',
      params: {
        train: train.number,
        station: train.destination.name,
        time: formatClock(train.etaMinutes),
        minutes: train.destinationDelay,
      },
      actions: [select, { type: 'highlightStop', code: train.destination.code }],
      results: [train.number],
    }
  }

  if (query.intent === 'delay') {
    return {
      key: train.delayMin > 0 ? 'ask.delay' : 'ask.onTime',
      params: {
        train: train.number,
        minutes: train.delayMin,
        destination: train.destination.name,
        time: formatClock(train.etaMinutes),
        destMinutes: train.destinationDelay,
      },
      actions: [select],
      results: [train.number],
    }
  }

  // 'locate'
  const running = train.phase !== 'dwell' && train.phase !== 'origin' && train.phase !== 'arrived'
  return {
    key: running ? 'ask.locateRunning' : 'ask.locateStopped',
    params: {
      train: train.number,
      name: train.name,
      from: train.prevStation.name,
      to: train.nextStation.name,
      station: train.atStation?.name ?? train.prevStation.name,
      speed: train.speedKmh,
      minutes: train.delayMin,
      next: train.nextStation.name,
      time: formatClock(train.nextStationEtaMin),
    },
    actions: [select],
    results: [train.number],
  }
}

/** Convenience: the whole pipeline in one call. */
export function ask(text, trains) {
  const query = parseQuery(text)
  const answer = answerQuery(query, trains)
  return { query, ...answer }
}

/** Suggestions shown before the user has asked anything. */
export const SAMPLE_QUESTIONS = [
  'Where is train 12952?',
  'Is 12301 delayed?',
  'When does 12951 reach New Delhi?',
  'Which trains are delayed?',
  'Trains from New Delhi to Mumbai Central',
  'Show me trains arriving at NDLS',
]

/** Every service, for the search box (§6). */
export const searchableTrains = liveTrains.map((t) => ({
  number: t.number,
  name: t.name,
  from: t.stops[0][0],
  to: t.stops[t.stops.length - 1][0],
}))

export { stationByCode }
