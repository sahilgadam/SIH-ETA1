/**
 * Thin wrappers over the browser speech APIs.
 *
 * Both are optional platform features: recognition only exists in Chromium
 * browsers today, and synthesis can be present with no voices installed. Every
 * function here reports absence rather than throwing, so the caller can fall
 * back to typed search instead of breaking the page (§6, §35).
 */

const Recognition =
  typeof window !== 'undefined'
    ? (window.SpeechRecognition ?? window.webkitSpeechRecognition ?? null)
    : null

export const isRecognitionSupported = () => Recognition !== null

export const isSpeechSupported = () =>
  typeof window !== 'undefined' && 'speechSynthesis' in window

/**
 * Starts one round of listening. Returns a stop function, or null when the
 * platform has no recognition engine at all.
 */
export function listenOnce({ lang, onResult, onError, onEnd }) {
  if (!Recognition) return null

  const recognition = new Recognition()
  recognition.lang = lang
  recognition.interimResults = false
  recognition.maxAlternatives = 1
  recognition.continuous = false

  recognition.onresult = (event) => {
    const transcript = event.results?.[0]?.[0]?.transcript ?? ''
    onResult(transcript.trim())
  }
  // 'not-allowed' and 'service-not-allowed' are the permission refusals; the
  // caller maps them to the "use typed search instead" message.
  recognition.onerror = (event) => onError(event.error ?? 'unknown')
  recognition.onend = () => onEnd()

  try {
    recognition.start()
  } catch {
    onError('start-failed')
    return null
  }

  return () => {
    try {
      recognition.abort()
    } catch {
      /* already stopped */
    }
  }
}

/** Speaks a string, resolving immediately when synthesis is unavailable. */
export function speak(text, lang) {
  if (!isSpeechSupported() || !text) return

  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = lang
  utterance.rate = 0.98
  window.speechSynthesis.speak(utterance)
}

export function stopSpeaking() {
  if (isSpeechSupported()) window.speechSynthesis.cancel()
}
