/**
 * Browser speech input and output.
 *
 * WHY THIS IS NOT A ONE-LINER
 *
 * The obvious implementation — `continuous = false`, `interimResults = false`,
 * read `event.results[0][0]` — is what this file used to do, and it is wrong.
 * With those settings Chrome ends the session at the first pause and hands
 * back only the first phrase, so "where is train one two nine five two"
 * arrives as "where is train". The user asks a complete question and the
 * assistant answers a fragment.
 *
 * What actually works:
 *
 *   continuous = true      keep the session open across natural pauses
 *   interimResults = true  so the UI can show words as they are recognised
 *   accumulate             append every `isFinal` result to a buffer instead
 *                          of replacing it; the recogniser emits a question in
 *                          several chunks and only the concatenation is the
 *                          question
 *   silence timer          end the turn after a real pause, not at the first
 *                          one, and submit the whole buffer
 *
 * Everything reports absence rather than throwing: recognition exists only in
 * Chromium today, and synthesis can be present with no voices installed, so
 * callers can always fall back to the text box.
 */

const Recognition =
  typeof window !== 'undefined'
    ? (window.SpeechRecognition ?? window.webkitSpeechRecognition ?? null)
    : null

export const isRecognitionSupported = () => Recognition !== null

export const isSpeechSupported = () =>
  typeof window !== 'undefined' && 'speechSynthesis' in window

/** Permission refusals, as distinct from "it just didn't hear anything". */
export const PERMISSION_ERRORS = new Set(['not-allowed', 'service-not-allowed'])

/**
 * Listen for one complete spoken question.
 *
 * `onInterim` fires continuously with the best current text (finalised words
 * plus whatever is still being recognised) so the user can see what was heard.
 * `onFinal` fires exactly once, with the accumulated question, when the user
 * stops speaking, presses stop, or the cap is reached.
 *
 * Returns a controller, or null when the platform has no recogniser.
 */
export function startListening({
  lang,
  onInterim,
  onFinal,
  onError,
  onEnd,
  silenceMs = 2000,
  maxMs = 15000,
}) {
  if (!Recognition) return null

  const recognition = new Recognition()
  recognition.lang = lang
  recognition.continuous = true
  recognition.interimResults = true
  recognition.maxAlternatives = 1

  let finalText = ''
  let settled = false
  let silenceTimer = null
  let capTimer = null

  const clearTimers = () => {
    clearTimeout(silenceTimer)
    clearTimeout(capTimer)
  }

  /** Finish the turn exactly once, whatever ended it. */
  const settle = (reason) => {
    if (settled) return
    settled = true
    clearTimers()
    try {
      recognition.stop()
    } catch {
      /* already stopped */
    }
    const text = finalText.trim()
    if (text) onFinal?.(text, reason)
    else onError?.('no-speech')
  }

  const armSilence = () => {
    clearTimeout(silenceTimer)
    silenceTimer = setTimeout(() => settle('silence'), silenceMs)
  }

  recognition.onresult = (event) => {
    let interim = ''
    // Only walk from resultIndex: earlier results are already in finalText.
    for (let i = event.resultIndex; i < event.results.length; i += 1) {
      const result = event.results[i]
      const chunk = result[0]?.transcript ?? ''
      if (result.isFinal) finalText += `${chunk} `
      else interim += chunk
    }
    onInterim?.(`${finalText}${interim}`.trim())
    armSilence()
  }

  recognition.onspeechstart = armSilence

  recognition.onerror = (event) => {
    const code = event.error ?? 'unknown'
    // 'no-speech' and 'aborted' are ordinary ends of a turn, not failures —
    // if we already have words, use them.
    if ((code === 'no-speech' || code === 'aborted') && finalText.trim()) {
      settle(code)
      return
    }
    if (settled) return
    settled = true
    clearTimers()
    onError?.(code)
  }

  recognition.onend = () => {
    // Chrome can end the session on its own mid-question; if we still have a
    // buffer and nothing has settled, treat it as the end of the turn.
    if (!settled) settle('ended')
    onEnd?.()
  }

  try {
    recognition.start()
  } catch {
    onError?.('start-failed')
    return null
  }

  capTimer = setTimeout(() => settle('timeout'), maxMs)
  armSilence()

  return {
    /** User pressed stop: finalise with whatever has been heard so far. */
    stop: () => settle('manual'),
    /** Abandon without answering. */
    cancel: () => {
      settled = true
      clearTimers()
      try {
        recognition.abort()
      } catch {
        /* already stopped */
      }
    },
  }
}

/**
 * The best installed voice for a language tag, or null.
 *
 * Setting `utterance.lang` alone is only a hint: Chrome honours it, Safari
 * frequently reads Hindi text in the default English voice regardless. Naming
 * the voice explicitly is what actually makes a Hindi announcement sound like
 * Hindi, and returning null tells the caller there is no such voice — which is
 * the cue to keep showing the text instead of pretending it was spoken.
 */
export function voiceFor(lang) {
  if (!isSpeechSupported() || !lang) return null

  let voices = []
  try {
    voices = window.speechSynthesis.getVoices() ?? []
  } catch {
    return null
  }

  const wanted = lang.toLowerCase()
  const base = wanted.split('-')[0]
  return (
    voices.find((voice) => voice.lang?.toLowerCase() === wanted) ??
    voices.find((voice) => voice.lang?.toLowerCase().replace('_', '-') === wanted) ??
    voices.find((voice) => voice.lang?.toLowerCase().startsWith(base)) ??
    null
  )
}

/**
 * Voices arrive asynchronously in Chrome: the first `getVoices()` after load
 * returns an empty list and a `voiceschanged` event follows. Callers that want
 * to know whether a language can actually be spoken have to wait for it.
 * Returns an unsubscribe function, so the listener dies with the component.
 */
export function onVoicesChanged(handler) {
  if (!isSpeechSupported() || typeof handler !== 'function') return () => {}
  const synth = window.speechSynthesis
  synth.addEventListener('voiceschanged', handler)
  return () => synth.removeEventListener('voiceschanged', handler)
}

/** True while something is being spoken, so a caller can wait its turn. */
export function isSpeaking() {
  if (!isSpeechSupported()) return false
  return window.speechSynthesis.speaking || window.speechSynthesis.pending
}

/**
 * Speak a string.
 *
 * Returns true only if the utterance was actually handed to the synthesiser,
 * so a caller can fall back to showing the text when it was not. `interrupt`
 * is the existing behaviour for an answer being read back — the newest answer
 * replaces whatever was being said. Announcements pass false and queue instead,
 * because cutting one announcement off mid-sentence with the next is worse
 * than letting them follow one another.
 */
export function speak(text, lang, { interrupt = true, rate = 0.98 } = {}) {
  if (!isSpeechSupported() || !text) return false

  try {
    if (interrupt) window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = lang
    utterance.rate = rate
    const voice = voiceFor(lang)
    if (voice) utterance.voice = voice
    window.speechSynthesis.speak(utterance)
    return true
  } catch {
    // Synthesis can be present and still refuse (no voices, autoplay policy).
    return false
  }
}

export function stopSpeaking() {
  if (isSpeechSupported()) window.speechSynthesis.cancel()
}
