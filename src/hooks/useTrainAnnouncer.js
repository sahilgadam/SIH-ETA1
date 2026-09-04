import { useCallback, useEffect, useRef, useState } from 'react'
import {
  announcementKindFor,
  announcementSignal,
  buildAnnouncement,
  cooldownFor,
  speechLangFor,
} from '../lib/announcements'
import {
  isSpeaking,
  isSpeechSupported,
  onVoicesChanged,
  speak,
  stopSpeaking,
  voiceFor,
} from '../lib/speech'

/**
 * Turns a running train into spoken announcements.
 *
 * THE PROBLEM THIS SOLVES
 *
 * The simulation hands React a fresh snapshot every second, and every one of
 * those snapshots is a *new object* — so "announce when the train state
 * changes" would announce once a second forever, and would announce again on
 * any unrelated re-render. What matters is not that the object changed but
 * that a *fact a passenger cares about* changed: a different station is next,
 * the service has moved between running and standing, its status band has
 * moved, or the predicted time has shifted by more than a rounding error.
 *
 * So the hook keeps the last signal it actually announced from, compares each
 * new one against it, and speaks only on a real difference — with a cooldown
 * underneath, and never over the top of an announcement still being read. A
 * hundred re-renders between two identical signals produce silence.
 *
 * Everything is read from the train state the screen is already rendering, so
 * an announcement cannot quote a time the page is not showing.
 */
export function useTrainAnnouncer({ train, minutes, language = 'en', enabled = false }) {
  const [latest, setLatest] = useState(null)
  // False when the text was produced but the browser could not read it out —
  // the cue for the panel to show it instead (§accessibility).
  const [spokenAloud, setSpokenAloud] = useState(true)

  // The signal the last announcement was made from, and when. Refs, not state:
  // they must survive re-renders without causing them, and must be read at the
  // moment of the decision rather than from a stale closure.
  const lastSignalRef = useRef(null)
  const lastSpokenAtRef = useRef(0)
  // The exact words last announced. Two different signals can still produce
  // the same sentence — a train changes phase without changing what there is
  // to say — and saying it twice is the thing that makes announcements grating.
  const lastTextRef = useRef('')
  // Whether this hook has actually put something on the synthesiser. Only then
  // is it ours to cancel — calling cancel() otherwise would cut off an answer
  // the assistant beside this panel is in the middle of reading back.
  const startedSpeechRef = useRef(false)

  // Freshest inputs for the manual button, which fires outside the effect.
  const trainRef = useRef(train)
  const minutesRef = useRef(minutes)
  useEffect(() => {
    trainRef.current = train
    minutesRef.current = minutes
  }, [train, minutes])

  const speechLang = speechLangFor(language)

  // Voices load asynchronously: Chrome's first `getVoices()` after load returns
  // an empty list and fires `voiceschanged` afterwards. Bumping this state on
  // that event re-renders, and the lookup below settles on the right answer
  // instead of being stuck on "no Hindi voice installed".
  const [, notifyVoicesChanged] = useState(0)
  useEffect(() => onVoicesChanged(() => notifyVoicesChanged((v) => v + 1)), [])

  /** Can this language actually be spoken here, or is it text only? */
  const canSpeak = isSpeechSupported() && voiceFor(speechLang) !== null

  /**
   * Build one announcement, say it if we can, and always surface the text.
   *
   * `force` is the manual button: it repeats on request even when the words
   * have not changed. Automatic announcements pass through the duplicate
   * guard instead and stay silent.
   */
  const emit = useCallback(
    (kind, previousEtaMin, { interrupt = false, force = false } = {}) => {
      const announcement = buildAnnouncement({
        train: trainRef.current,
        language,
        kind,
        previousEtaMin,
      })

      if (!force && announcement.text === lastTextRef.current) return null
      lastTextRef.current = announcement.text

      const spoken = speak(announcement.text, speechLang, { interrupt })
      if (spoken) startedSpeechRef.current = true
      setSpokenAloud(spoken)
      setLatest({ ...announcement, at: Date.now() })
      return announcement
    },
    [language, speechLang],
  )

  // Switching announcements on starts a fresh conversation: forget what was
  // said before so the first thing the passenger hears is where their train is
  // now, rather than silence until something happens to change.
  //
  // Switching them off silences the voice, if the voice is one we started.
  useEffect(() => {
    if (enabled) {
      lastSignalRef.current = null
      lastSpokenAtRef.current = 0
      lastTextRef.current = ''
    } else if (startedSpeechRef.current) {
      stopSpeaking()
    }
  }, [enabled])

  // The announcement decision, re-evaluated on every simulation snapshot.
  useEffect(() => {
    if (!enabled) return

    const current = announcementSignal(train, minutes)
    if (!current) return

    const previous = lastSignalRef.current
    const kind = announcementKindFor(previous, current)
    if (!kind) return

    const now = Date.now()
    if (previous && now - lastSpokenAtRef.current < cooldownFor(kind)) return
    // Wait our turn rather than talking over the previous announcement. The
    // signal is left unrecorded, so the next snapshot reconsiders it.
    if (isSpeaking()) return

    lastSignalRef.current = current
    lastSpokenAtRef.current = now
    emit(kind, previous?.nextEtaMin)
  }, [enabled, train, minutes, emit])

  /** The panel's "announce now" button — always speaks, whatever has changed. */
  const announceNow = useCallback(
    (kind = 'station') => {
      const current = announcementSignal(trainRef.current, minutesRef.current)
      const previous = lastSignalRef.current
      lastSignalRef.current = current
      lastSpokenAtRef.current = Date.now()
      return emit(kind, previous?.nextEtaMin, { interrupt: true, force: true })
    },
    [emit],
  )

  const stop = useCallback(() => stopSpeaking(), [])

  // Never leave a voice talking to an unmounted screen.
  useEffect(
    () => () => {
      if (startedSpeechRef.current) stopSpeaking()
    },
    [],
  )

  return { latest, spokenAloud, canSpeak, announceNow, stop }
}
