import { Mic, MicOff, Square, Volume2 } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useLanguage } from '../../context/LanguageProvider'
import { getJourney } from '../../data/journeys'
import { cn } from '../../lib/cn'
import { isRecognitionSupported, isSpeechSupported, listenOnce, speak, stopSpeaking } from '../../lib/speech'
import { answerVoiceQuery, parseIntent } from '../../lib/voiceIntent'

const RECOGNITION_LANG = { en: 'en-IN', hi: 'hi-IN' }

/** Permission refusals, as distinct from "it just didn't hear anything". */
const PERMISSION_ERRORS = new Set(['not-allowed', 'service-not-allowed'])

/**
 * "Where's my train?" (§6).
 *
 * A microphone button, five states, and a spoken answer read from the same
 * journey data the rest of the app renders — `answerVoiceQuery` returns a
 * translation key, and the identical string is both displayed and spoken.
 *
 * Not a page and not a chatbot. When the platform has no recognition engine, or
 * the user refuses the microphone, the panel says so and points at the typed
 * search that is already on the page.
 *
 * `bare` drops the card chrome for use inside the landing page's search card,
 * where another bordered box would just be a card inside a card.
 */
export function VoiceSearch({ journey = null, onOpenTrain, bare = false, className }) {
  const { t, language } = useLanguage()

  const [state, setState] = useState('idle') // idle | listening | thinking | answered | error
  const [transcript, setTranscript] = useState('')
  const [answer, setAnswer] = useState('')
  const [errorKey, setErrorKey] = useState(null)

  const stopRef = useRef(null)
  const supported = isRecognitionSupported()
  const lang = RECOGNITION_LANG[language] ?? RECOGNITION_LANG.en

  // Never leave the microphone or a spoken answer running past unmount.
  useEffect(() => () => {
    stopRef.current?.()
    stopSpeaking()
  }, [])

  const respond = useCallback(
    (heard) => {
      setTranscript(heard)

      if (!heard) {
        setState('error')
        setErrorKey('voice.errorNoSpeech')
        return
      }

      const intent = parseIntent(heard)
      // A number in the request wins; otherwise answer about the train on
      // screen. Asking about the train already open answers from the journey
      // this render is showing — the simulated one — so the spoken reply and
      // the visible ETA are always the same forecast.
      const target =
        !intent.trainNumber || intent.trainNumber === journey?.trainNumber
          ? journey
          : getJourney(intent.trainNumber)
      const reply = answerVoiceQuery({ intent, transcript: heard, journey: target })
      const text = t(reply.key, reply.params)

      setAnswer(text)
      setState('answered')
      speak(text, lang)

      // Asked about a different train we do hold — take them to it.
      if (target && intent.trainNumber && target.trainNumber !== journey?.trainNumber) {
        onOpenTrain?.(target.trainNumber)
      }
    },
    [journey, lang, onOpenTrain, t],
  )

  const start = useCallback(() => {
    stopSpeaking()
    setTranscript('')
    setAnswer('')
    setErrorKey(null)
    setState('listening')

    stopRef.current = listenOnce({
      lang,
      onResult: (heard) => {
        setState('thinking')
        respond(heard)
      },
      onError: (error) => {
        setErrorKey(PERMISSION_ERRORS.has(error) ? 'voice.errorDenied' : 'voice.errorGeneric')
        setState('error')
      },
      onEnd: () => {
        stopRef.current = null
        // Ended without a result and without an error: nothing was heard.
        setState((current) => (current === 'listening' ? 'idle' : current))
      },
    })

    if (!stopRef.current) {
      setErrorKey('voice.errorUnsupported')
      setState('error')
    }
  }, [lang, respond])

  const stop = useCallback(() => {
    stopRef.current?.()
    stopRef.current = null
    setState('idle')
  }, [])

  const isListening = state === 'listening'

  return (
    <section
      aria-labelledby="voice-title"
      className={cn(!bare && 'rounded-lg border border-line bg-surface p-5', className)}
    >
      <h2 id="voice-title" className="text-base font-bold text-fg">
        {t('voice.title')}
      </h2>
      <p className="mt-1.5 text-sm leading-6 text-fg-muted">
        {supported ? t('voice.hint') : t('voice.unsupportedHint')}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={isListening ? stop : start}
          disabled={!supported}
          aria-pressed={isListening}
          className={cn(
            'inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold',
            'transition-colors duration-150',
            'disabled:pointer-events-none disabled:opacity-50',
            isListening
              ? 'bg-danger text-white'
              : 'bg-brand text-brand-fg hover:bg-brand-hover',
          )}
        >
          {!supported ? (
            <MicOff className="size-4" aria-hidden="true" />
          ) : isListening ? (
            <Square className="size-4 fill-current" aria-hidden="true" />
          ) : (
            <Mic className="size-4" aria-hidden="true" />
          )}
          {isListening ? t('voice.stop') : t('voice.tapToSpeak')}
        </button>

        {/* One live region for every state change, so a screen reader hears the
            same progression a sighted user sees. */}
        <p role="status" aria-live="polite" className="text-sm text-fg-muted">
          {isListening ? t('voice.listening') : null}
          {state === 'thinking' ? t('voice.thinking') : null}
          {state === 'idle' && !answer ? t('voice.idle') : null}
        </p>
      </div>

      {transcript ? (
        <p className="mt-4 text-sm text-fg-muted">
          <span className="font-medium text-fg-subtle">{t('voice.youSaid')}</span>{' '}
          <span className="italic">“{transcript}”</span>
        </p>
      ) : null}

      {/* The answer is announced as well as spoken, so the reply reaches a
          screen-reader user even when synthesis is unavailable. */}
      {answer ? (
        <div role="status" className="mt-3 rounded-md border border-line bg-sunken p-3.5">
          <p className="flex items-start gap-2 text-[0.9375rem] leading-7 text-fg">
            <Volume2
              className="mt-1.5 size-4 shrink-0 text-brand"
              aria-hidden="true"
            />
            <span>{answer}</span>
          </p>
          {!isSpeechSupported() ? (
            <p className="mt-2 text-xs text-fg-subtle">{t('voice.noSpeechOutput')}</p>
          ) : null}
        </div>
      ) : null}

      {errorKey ? (
        <div role="alert" className="mt-4 rounded-md border border-line bg-sunken p-3.5">
          <p className="text-sm font-medium text-danger">{t(errorKey)}</p>
          <p className="mt-1 text-sm leading-6 text-fg-muted">{t('voice.fallback')}</p>
        </div>
      ) : null}

      <p className="mt-4 text-xs leading-5 text-fg-subtle">{t('voice.examples')}</p>
    </section>
  )
}
