/**
 * Railway-style spoken announcements, in English and Hindi.
 *
 * WHAT THIS IS
 *
 * The words a station announcer would say about the train currently on
 * screen — "Train 12951 is expected to arrive at Kota at 8:42 PM,
 * approximately 12 minutes late" — built from the very same `railSim` train
 * state the journey page renders. Nothing here predicts, rounds differently,
 * or carries a timing of its own: `station`, `time` and `minutes` are read
 * straight off the state, so an announcement can never say something the
 * screen is not also showing.
 *
 * WHY THE TEXT IS BUILT AS A KEY PLUS VALUES
 *
 * Every announcement resolves through `translate(language, key, vars)`, which
 * is the same lookup the interface uses. That buys two things: the announcement
 * language can differ from the interface language (a passenger may want Hindi
 * announcements over an English screen), and the singular/plural handling that
 * stops sentences reading "1 minutes" is shared rather than reimplemented.
 *
 * WHAT DECIDES THAT SOMETHING IS WORTH SAYING
 *
 * `announcementSignal` reduces a train to the handful of facts an announcement
 * is actually about — which station is next, when it is expected there, how
 * late it is, what it is doing. The announcer compares consecutive signals and
 * speaks only when one of those facts has genuinely moved, which is what keeps
 * a re-render, or a clock tick that changed nothing, from producing noise.
 */

import { translate } from '../i18n/translations'
import { SIM_START_MINUTES } from './railSim'

/** Languages announcements can be spoken in, with their BCP-47 voice tags. */
export const ANNOUNCEMENT_LANGUAGES = [
  { code: 'en', label: 'English', shortLabel: 'EN', speechLang: 'en-IN' },
  { code: 'hi', label: 'हिन्दी', shortLabel: 'हिं', speechLang: 'hi-IN' },
]

export const speechLangFor = (code) =>
  ANNOUNCEMENT_LANGUAGES.find((entry) => entry.code === code)?.speechLang ??
  ANNOUNCEMENT_LANGUAGES[0].speechLang

/**
 * A change worth interrupting someone for, in minutes.
 *
 * Predictions drift by fractions of a minute continuously; announcing that
 * would be both useless and maddening. These are the thresholds at which a
 * real announcement would be made.
 */
export const ETA_CHANGE_MIN = 2
export const DELAY_CHANGE_MIN = 3

/** Smallest gap between two automatic announcements, in real milliseconds. */
export const ANNOUNCE_COOLDOWN_MS = 20000

/**
 * The floor for one kind of announcement.
 *
 * A new station coming up is the announcement a passenger is waiting for, so
 * it gets a shorter floor than a revised time or a status change — at a fast
 * demo speed a full cooldown would swallow it entirely. Everything still has
 * a floor, and nothing ever speaks over an announcement in progress.
 */
export const cooldownFor = (kind) =>
  kind === 'station' ? ANNOUNCE_COOLDOWN_MS / 4 : ANNOUNCE_COOLDOWN_MS

const isFiniteNumber = (value) => typeof value === 'number' && Number.isFinite(value)

/**
 * The name an announcer would use.
 *
 * Boards print "Kota Jn"; nobody says the "Jn" out loud, and a speech
 * synthesiser reads it as two letters. Only the abbreviations are dropped —
 * "Central" and "Cantt" stay, because they distinguish real stations.
 */
export function spokenStationName(name) {
  if (!name) return null
  return name.replace(/\s+(jn|junction)\.?$/i, '').trim() || name
}

const HINDI_DAY_PARTS = [
  { until: 4 * 60, word: 'रात' },
  { until: 12 * 60, word: 'सुबह' },
  { until: 16 * 60, word: 'दोपहर' },
  { until: 19 * 60, word: 'शाम' },
  { until: 24 * 60, word: 'रात' },
]

/**
 * An absolute simulated minute as a spoken time of day.
 *
 * English gets "8:42 PM". Hindi does not use AM/PM in speech — the part of the
 * day carries it — so it gets "रात 8:42 बजे", which is what an announcement
 * actually sounds like. Returns null for a missing or non-finite minute so
 * callers fall back to a sentence that does not quote a time at all, rather
 * than announcing "NaN".
 */
export function speakableClock(absoluteMinute, language) {
  if (!isFiniteNumber(absoluteMinute)) return null

  const minuteOfDay = ((Math.round(absoluteMinute) % 1440) + 1440) % 1440
  const hour24 = Math.floor(minuteOfDay / 60)
  const minute = String(minuteOfDay % 60).padStart(2, '0')
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12

  if (language === 'hi') {
    const part = HINDI_DAY_PARTS.find((entry) => minuteOfDay < entry.until)?.word ?? 'रात'
    return `${part} ${hour12}:${minute} बजे`
  }

  return `${hour12}:${minute} ${hour24 < 12 ? 'AM' : 'PM'}`
}

/** Is this train moving between calls, or sitting at one? */
const isMoving = (train) =>
  train.phase !== 'dwell' && train.phase !== 'origin' && train.phase !== 'arrived'

/**
 * What the service is doing, at announcement resolution.
 *
 * `phase` distinguishes accelerating from cruising from braking, which the map
 * needs and an announcement does not: all three produce the identical
 * sentence, so tracking the raw phase would announce the same words three
 * times per section. Only running / standing / finished is a real change.
 */
const motionOf = (train) => {
  if (train.phase === 'arrived') return 'arrived'
  return isMoving(train) ? 'running' : 'standing'
}

/**
 * The facts an announcement is about, reduced to comparable values.
 *
 * Deliberately rounded to whole minutes: that is the resolution announcements
 * are made at, and comparing rounded values is what makes "nothing has
 * changed" a stable answer across ticks of the clock.
 */
export function announcementSignal(train, minutes) {
  if (!train) return null

  const nextEtaMin = isFiniteNumber(train.nextStationEtaMin)
    ? Math.round(train.nextStationEtaMin)
    : null

  return {
    number: train.number,
    motion: motionOf(train),
    status: train.status,
    stationCode: isMoving(train)
      ? (train.nextStation?.code ?? null)
      : (train.atStation?.code ?? train.prevStation?.code ?? null),
    nextEtaMin,
    delayMin: isFiniteNumber(train.delayMin) ? Math.round(train.delayMin) : 0,
    destinationDelay: isFiniteNumber(train.destinationDelay)
      ? Math.round(train.destinationDelay)
      : 0,
    // Carried so an announcement can report a time relative to "now" without
    // reaching for a second clock.
    simMinute: SIM_START_MINUTES + (isFiniteNumber(minutes) ? minutes : 0),
  }
}

/**
 * Decide what — if anything — is worth announcing between two signals.
 *
 * Returns a kind, or null when nothing has moved far enough to be worth
 * saying. The order is the order of importance to a passenger: which station
 * comes next, then whether the service's status has changed, then a revised
 * time, then a materially different delay.
 */
export function announcementKindFor(previous, current) {
  if (!current) return null
  if (!previous || previous.number !== current.number) return 'station'

  if (previous.stationCode !== current.stationCode) return 'station'
  if (previous.motion !== current.motion) return 'station'
  if (previous.status !== current.status) return 'status'

  if (
    isFiniteNumber(previous.nextEtaMin) &&
    isFiniteNumber(current.nextEtaMin) &&
    Math.abs(current.nextEtaMin - previous.nextEtaMin) >= ETA_CHANGE_MIN
  ) {
    return 'eta-change'
  }

  if (Math.abs(current.delayMin - previous.delayMin) >= DELAY_CHANGE_MIN) return 'status'

  return null
}

/** `{ key, params }` for where the train is and when it is expected there. */
function stationAnnouncement(train, language) {
  const trainNumber = train.number

  if (train.phase === 'arrived') {
    return {
      key: 'announce.terminated',
      params: {
        train: trainNumber,
        station: spokenStationName(train.destination?.name ?? train.atStation?.name),
      },
    }
  }

  if (!isMoving(train)) {
    const station = spokenStationName(train.atStation?.name ?? train.prevStation?.name)
    const time = speakableClock(train.nextStationEtaMin, language)
    if (!station || !time) return { key: 'announce.unavailable', params: {} }

    return train.delayMin > 0
      ? {
          key: 'announce.standingLate',
          params: { train: trainNumber, station, time, minutes: train.delayMin },
        }
      : { key: 'announce.standing', params: { train: trainNumber, station, time } }
  }

  const station = spokenStationName(train.nextStation?.name)
  const time = speakableClock(train.nextStationEtaMin, language)
  if (!station || !time) return { key: 'announce.unavailable', params: {} }

  // The delay carried into the next call is the figure the screen shows beside
  // it, so the two always agree.
  const stop = train.timeline?.find((item) => item.code === train.nextStation?.code)
  const delay = isFiniteNumber(stop?.delayMin) ? Math.round(stop.delayMin) : train.delayMin

  if (delay > 0) {
    return {
      key: 'announce.arrival',
      params: { train: trainNumber, station, time, minutes: delay },
    }
  }
  if (delay < 0) {
    return {
      key: 'announce.arrivalEarly',
      params: { train: trainNumber, station, time, minutes: Math.abs(delay) },
    }
  }
  return { key: 'announce.arrivalOnTime', params: { train: trainNumber, station, time } }
}

/** `{ key, params }` for how the service is running overall. */
function statusAnnouncement(train) {
  const delay = isFiniteNumber(train.delayMin) ? Math.round(train.delayMin) : 0
  if (delay > 0) {
    return { key: 'announce.statusLate', params: { train: train.number, minutes: delay } }
  }
  if (delay < 0) {
    return {
      key: 'announce.statusEarly',
      params: { train: train.number, minutes: Math.abs(delay) },
    }
  }
  return { key: 'announce.statusOnTime', params: { train: train.number } }
}

/** `{ key, params }` for the predicted arrival at the end of the run. */
function destinationAnnouncement(train, language) {
  const station = spokenStationName(train.destination?.name)
  const time = speakableClock(train.etaMinutes, language)
  if (!station || !time) return { key: 'announce.unavailable', params: {} }

  const delay = isFiniteNumber(train.destinationDelay) ? Math.round(train.destinationDelay) : 0
  return delay > 0
    ? {
        key: 'announce.destination',
        params: { train: train.number, station, time, minutes: delay },
      }
    : { key: 'announce.destinationOnTime', params: { train: train.number, station, time } }
}

/** `{ key, params }` for a materially revised time at the next call. */
function etaChangeAnnouncement(train, language, previousEtaMin) {
  const station = spokenStationName(train.nextStation?.name ?? train.atStation?.name)
  const time = speakableClock(train.nextStationEtaMin, language)
  if (!station || !time || !isFiniteNumber(previousEtaMin)) {
    return stationAnnouncement(train, language)
  }

  const shift = Math.round(train.nextStationEtaMin - previousEtaMin)
  if (shift === 0) return stationAnnouncement(train, language)

  return {
    key: shift > 0 ? 'announce.etaLater' : 'announce.etaEarlier',
    params: { train: train.number, station, time, minutes: Math.abs(shift) },
  }
}

/**
 * Build one announcement.
 *
 * `kind` is one of 'station' | 'status' | 'destination' | 'eta-change'.
 * Returns `{ kind, key, text }`, or an "information not available" line when
 * the train state cannot support the sentence — never a half-built one.
 */
export function buildAnnouncement({ train, language = 'en', kind = 'station', previousEtaMin }) {
  const safeLanguage = ANNOUNCEMENT_LANGUAGES.some((entry) => entry.code === language)
    ? language
    : 'en'

  if (!train) {
    return {
      kind,
      key: 'announce.unavailable',
      text: translate(safeLanguage, 'announce.unavailable', {}),
    }
  }

  let built
  if (kind === 'status') built = statusAnnouncement(train)
  else if (kind === 'destination') built = destinationAnnouncement(train, safeLanguage)
  else if (kind === 'eta-change') built = etaChangeAnnouncement(train, safeLanguage, previousEtaMin)
  else built = stationAnnouncement(train, safeLanguage)

  return {
    kind,
    key: built.key,
    text: translate(safeLanguage, built.key, built.params),
  }
}
