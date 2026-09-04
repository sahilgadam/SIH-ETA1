import { useCallback, useEffect, useRef, useState } from 'react'
import { Mic, Search, Send, Square } from 'lucide-react'
import { useLanguage } from '../../context/LanguageProvider'
import { useNetwork } from '../../context/NetworkProvider'
import { useSelection } from '../../context/SelectionProvider'
import { ask, SAMPLE_QUESTIONS } from '../../lib/queryEngine'
import {
  isRecognitionSupported,
  PERMISSION_ERRORS,
  speak,
  startListening,
  stopSpeaking,
} from '../../lib/speech'
import { Mono } from '../ui/Mono'
import { TrainAnnouncements } from './TrainAnnouncements'

/**
 * Ask RailSense.
 *
 * Typing and speaking run the *same* pipeline (§14): whatever produced the
 * text, it goes transcript → parser → simulation → answer → map action. The
 * only thing the microphone adds is a way of producing the text, which is why
 * a spoken question and a typed one can never be answered differently.
 *
 * Answers are computed from the live simulation, so this is not a scripted
 * chatbot; and every answer carries actions that actually drive the map and
 * the timeline rather than only describing them.
 *
 * Voice Mode also *speaks* — see `TrainAnnouncements` below the ask box, which
 * reads station-style announcements for the train in view in English or Hindi.
 * Asking and announcing are separate concerns sharing one panel: the question
 * pipeline below is untouched by it.
 */

const RECOGNITION_LANG = { en: 'en-IN', hi: 'hi-IN' }

const ERROR_KEYS = {
  'no-speech': 'ask.micNoSpeech',
  'audio-capture': 'ask.micError',
  network: 'ask.micError',
  'start-failed': 'ask.micError',
  unknown: 'ask.micError',
}

export function AskRailSense({ onAfterAnswer, trainNumber }) {
  const { t, language } = useLanguage()
  const { trains } = useNetwork()
  const { applyActions, selectTrain } = useSelection()

  const [state, setState] = useState('idle') // idle | listening | processing | answered | error
  const [heard, setHeard] = useState('')
  const [answer, setAnswer] = useState(null)
  const [errorKey, setErrorKey] = useState(null)
  const [draft, setDraft] = useState('')

  const listenerRef = useRef(null)
  const inputRef = useRef(null)
  // Kept in a ref so `submit` can read the freshest snapshot without being
  // re-created on every simulation tick. Written in an effect rather than
  // during render, which React treats as a side effect.
  const trainsRef = useRef(trains)
  useEffect(() => {
    trainsRef.current = trains
  }, [trains])

  const supported = isRecognitionSupported()
  const lang = RECOGNITION_LANG[language] ?? RECOGNITION_LANG.en

  useEffect(
    () => () => {
      listenerRef.current?.cancel()
      stopSpeaking()
    },
    [],
  )

  /**
   * The single entry point. Voice and text both land here.
   * `spoken` controls whether the answer is read back — a typed question gets
   * a typed answer, a spoken one gets a spoken answer.
   */
  const submit = useCallback(
    (text, { spoken = false } = {}) => {
      const question = text.trim()
      if (!question) return

      setHeard(question)
      setState('processing')
      setErrorKey(null)

      // Answer against the freshest simulation snapshot, not a stale closure.
      const result = ask(question, trainsRef.current)
      const sentence = t(result.key, result.params)

      setAnswer({ ...result, sentence })
      setState('answered')

      // The answer drives the interface (§16).
      applyActions(result.actions)
      if (spoken) speak(sentence, lang)
      onAfterAnswer?.(result)
    },
    [t, applyActions, lang, onAfterAnswer],
  )

  const startVoice = useCallback(() => {
    if (!supported) {
      setErrorKey('ask.micUnsupported')
      setState('error')
      inputRef.current?.focus()
      return
    }

    stopSpeaking()
    setHeard('')
    setAnswer(null)
    setErrorKey(null)
    setState('listening')

    listenerRef.current = startListening({
      lang,
      // Interim text is shown live so the user can see what was actually heard.
      onInterim: (text) => setHeard(text),
      onFinal: (text) => {
        listenerRef.current = null
        submit(text, { spoken: true })
      },
      onError: (code) => {
        listenerRef.current = null
        setErrorKey(PERMISSION_ERRORS.has(code) ? 'ask.micDenied' : (ERROR_KEYS[code] ?? 'ask.micError'))
        setState('error')
      },
    })

    if (!listenerRef.current) {
      setErrorKey('ask.micUnsupported')
      setState('error')
    }
  }, [supported, lang, submit])

  const stopVoice = useCallback(() => {
    listenerRef.current?.stop()
    listenerRef.current = null
  }, [])

  const onSubmit = (event) => {
    event.preventDefault()
    submit(draft)
    setDraft('')
  }

  const listening = state === 'listening'

  return (
    <div className="flex flex-col gap-3">
      {/* Ask box ---------------------------------------------------------- */}
      <form onSubmit={onSubmit} className="flex items-stretch gap-1.5">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-fg-subtle"
            aria-hidden="true"
          />
          <input
            ref={inputRef}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder={t('ask.placeholder')}
            aria-label={t('ask.title')}
            className="w-full border border-line bg-page py-2 pl-8 pr-2 text-sm text-fg outline-none placeholder:text-fg-subtle focus-visible:border-brand"
          />
        </div>

        <button
          type="submit"
          disabled={!draft.trim()}
          aria-label={t('ask.send')}
          className="flex items-center justify-center border border-line px-2.5 text-fg-muted transition-colors hover:border-brand hover:text-fg disabled:opacity-40"
        >
          <Send className="size-3.5" aria-hidden="true" />
        </button>

        <button
          type="button"
          onClick={listening ? stopVoice : startVoice}
          aria-label={listening ? t('ask.micStop') : t('ask.mic')}
          aria-pressed={listening}
          className={`flex items-center justify-center border px-2.5 transition-colors ${
            listening
              ? 'border-danger bg-danger text-white'
              : 'border-line text-fg-muted hover:border-brand hover:text-fg'
          }`}
        >
          {listening ? <Square className="size-3.5" aria-hidden="true" /> : <Mic className="size-3.5" aria-hidden="true" />}
        </button>
      </form>

      {/* Live state ------------------------------------------------------- */}
      <div aria-live="polite" className="min-h-0">
        {listening ? (
          <div className="border-l-2 border-danger bg-sunken px-3 py-2">
            <p className="flex items-center gap-2 font-mono text-[0.625rem] font-semibold uppercase tracking-[var(--tracking-rail)] text-danger">
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-danger opacity-70 motion-reduce:hidden" />
                <span className="relative inline-flex size-1.5 rounded-full bg-danger" />
              </span>
              {t('ask.listening')}
            </p>
            <p className="mt-1 text-sm text-fg">
              {heard ? `"${heard}"` : <span className="text-fg-subtle">…</span>}
            </p>
          </div>
        ) : null}

        {state === 'processing' ? (
          <p className="font-mono text-[0.625rem] uppercase tracking-[var(--tracking-rail)] text-fg-subtle">
            {t('ask.processing')}
          </p>
        ) : null}

        {state === 'error' ? (
          <div className="border-l-2 border-caution bg-caution-soft px-3 py-2">
            <p className="text-sm text-fg">{t(errorKey ?? 'ask.micError')}</p>
            <button
              type="button"
              onClick={() => {
                setState('idle')
                inputRef.current?.focus()
              }}
              className="mt-1 font-mono text-[0.625rem] uppercase tracking-[var(--tracking-rail)] text-brand-text underline"
            >
              {t('ask.retry')}
            </button>
          </div>
        ) : null}

        {state === 'answered' && answer ? (
          <div className="border-l-2 border-brand bg-sunken px-3 py-2.5">
            {heard ? (
              <p className="font-mono text-[0.5625rem] uppercase tracking-[var(--tracking-rail)] text-fg-subtle">
                {t('ask.heard')}: {heard}
              </p>
            ) : null}

            <p className="mt-1.5 text-sm leading-6 text-fg">{answer.sentence}</p>

            {/* Result chips double as controls: tapping one drives the map. */}
            {answer.results?.length ? (
              <ul className="mt-2.5 flex flex-wrap gap-1.5">
                {answer.results.slice(0, 6).map((number) => (
                  <li key={number}>
                    <button
                      type="button"
                      onClick={() => selectTrain(number, { navigate: true })}
                      className="border border-line px-1.5 py-0.5 transition-colors hover:border-brand hover:bg-brand-soft"
                    >
                      <Mono className="text-[0.6875rem] font-semibold text-fg">{number}</Mono>
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : null}

        {state === 'idle' ? (
          <div>
            <p className="font-mono text-[0.5625rem] uppercase tracking-[var(--tracking-rail)] text-fg-subtle">
              {t('ask.examples')}
            </p>
            <ul className="mt-1.5 flex flex-wrap gap-1.5">
              {SAMPLE_QUESTIONS.slice(0, 3).map((question) => (
                <li key={question}>
                  <button
                    type="button"
                    onClick={() => submit(question)}
                    className="border border-line px-2 py-1 text-left text-[0.6875rem] text-fg-muted transition-colors hover:border-brand hover:text-fg"
                  >
                    {question}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>

      {/* Spoken announcements for the train in view (§3). */}
      <TrainAnnouncements trainNumber={trainNumber} />

      <p className="font-mono text-[0.5625rem] uppercase tracking-[var(--tracking-rail)] text-fg-subtle">
        {t('ask.simulated')}
      </p>
    </div>
  )
}
