/**
 * Understands a spoken request and answers it from the journey data.
 *
 * This is deliberately not a chatbot. It recognises three things — where a
 * train is, when it reaches a named station, and how late it will be — and
 * answers each by reading the very same forecast the journey screen renders.
 * Anything it does not recognise returns `unknown` and the UI says so; it never
 * invents a reply.
 */

import { getForecast, resolveStation } from './eta'
import { getRouteStations } from './geo'
import { getCurrentLocation } from './prediction'

/** Words that mean "when does it get there", in either supported language. */
const ETA_HINTS = [
  'reach', 'arrive', 'arrival', 'when', 'eta', 'get to', 'reaching',
  'कब', 'पहुंच', 'पहुँच', 'आएगी',
]

const DELAY_HINTS = ['late', 'delay', 'delayed', 'behind', 'देरी', 'लेट']

const includesAny = (text, hints) => hints.some((hint) => text.includes(hint))

/**
 * Pulls a train number out of a transcript.
 *
 * Recognisers return "12951", "1 2 9 5 1" and "129 51" for the same utterance,
 * so digits are collected across the whole string and accepted at the 4–5
 * length Indian Railways actually uses.
 */
export function extractTrainNumber(transcript) {
  const digits = transcript.replace(/\D/g, '')
  return digits.length >= 4 && digits.length <= 5 ? digits : null
}

/** Finds a station on this journey whose name the transcript mentions. */
export function matchStation(journey, transcript) {
  const text = transcript.toLowerCase()

  // Longest name first, so "New Delhi" wins over "Delhi" inside the same phrase.
  const candidates = [...getRouteStations(journey)].sort(
    (a, b) => b.station.length - a.station.length,
  )

  return (
    candidates.find((station) => {
      const name = station.station.toLowerCase()
      // Match on the distinguishing part: "Kota Jn" should match "kota".
      const bare = name.replace(/\s+(jn|junction|central|cantt)\.?$/, '')
      return text.includes(name) || (bare.length >= 4 && text.includes(bare))
    }) ?? null
  )
}

/** Classifies a transcript into one of the intents this feature supports. */
export function parseIntent(transcript) {
  const text = transcript.toLowerCase().trim()
  if (!text) return { intent: 'unknown', trainNumber: null }

  const trainNumber = extractTrainNumber(text)

  if (includesAny(text, ETA_HINTS)) return { intent: 'eta', trainNumber, text }
  if (includesAny(text, DELAY_HINTS)) return { intent: 'delay', trainNumber, text }
  if (text.includes('where') || text.includes('कहाँ') || text.includes('कहां')) {
    return { intent: 'locate', trainNumber, text }
  }
  // A bare train number is a reasonable "tell me about this train".
  if (trainNumber) return { intent: 'locate', trainNumber, text }

  return { intent: 'unknown', trainNumber, text }
}

/**
 * Builds the answer for a parsed request.
 *
 * Returns `{ key, params, trainNumber }`; the caller runs `key` through `t()`
 * to get both the text on screen and the text that is spoken, so the two are
 * always identical.
 *
 * `journey` is the train the request resolved to, or null when we hold no
 * journey for it — in which case the reply says exactly that.
 */
export function answerVoiceQuery({ intent, transcript, journey }) {
  if (intent.intent === 'unknown') return { key: 'voice.answerUnknown', params: {} }

  if (!journey) {
    return intent.trainNumber
      ? { key: 'voice.answerNoJourney', params: { train: intent.trainNumber } }
      : { key: 'voice.answerNoTrain', params: {} }
  }

  const forecast = getForecast(journey)
  const location = getCurrentLocation(journey)
  const delay = journey.current.delayMinutes

  // "When will my train reach Kota?" — answer for that station if it is on
  // this route and still ahead; otherwise fall back to the destination.
  if (intent.intent === 'eta') {
    const station = matchStation(journey, transcript)

    if (station) {
      const resolved = resolveStation(station)
      return {
        key: station.status === 'completed' ? 'voice.answerEtaPassed' : 'voice.answerEta',
        params: {
          train: journey.trainNumber,
          station: station.station,
          time: resolved.predictedTime,
          scheduled: resolved.scheduledTime,
          minutes: Math.abs(station.predictedDelayMinutes),
        },
      }
    }

    return {
      key: 'voice.answerEtaDestination',
      params: {
        train: journey.trainNumber,
        station: forecast.destinationName,
        time: forecast.predicted,
        minutes: Math.abs(forecast.delayMinutes),
      },
    }
  }

  if (intent.intent === 'delay') {
    return {
      key: 'voice.answerDelay',
      params: {
        train: journey.trainNumber,
        minutes: delay,
        destination: forecast.destinationName,
        predicted: forecast.delayMinutes,
      },
    }
  }

  // 'locate' — where it is now, plus the next thing the passenger will want.
  return {
    key: location.kind === 'at' ? 'voice.answerAt' : 'voice.answerBetween',
    params: {
      train: journey.trainNumber,
      station: location.station,
      from: location.fromStation,
      to: location.toStation,
      minutes: delay,
      destination: forecast.destinationName,
      arrival: forecast.predicted,
    },
  }
}
