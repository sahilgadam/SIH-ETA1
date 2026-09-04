import { useMemo, useState } from 'react'
import { Megaphone, Square, Volume2 } from 'lucide-react'
import { useLanguage } from '../../context/LanguageProvider'
import { useNetwork } from '../../context/NetworkProvider'
import { useSelection } from '../../context/SelectionProvider'
import { useTrainAnnouncer } from '../../hooks/useTrainAnnouncer'
import { ANNOUNCEMENT_LANGUAGES } from '../../lib/announcements'

/**
 * Bilingual station announcements, inside Voice Mode.
 *
 * The same panel that takes a spoken question also reads the journey back —
 * "Train 12951 is expected to arrive at Kota at 8:42 PM, approximately 12
 * minutes late" — in English or Hindi.
 *
 * The announcement language is *its own* choice, deliberately separate from
 * the interface language: a passenger may want the screen in English and the
 * announcement in Hindi, which is exactly what a real platform does. It starts
 * on whatever the interface is set to, and then follows the user.
 *
 * Every sentence is built from the train state this screen is already
 * rendering (see `lib/announcements`), on the one simulation clock, so an
 * announcement can never quote a time the page is not showing. When the
 * browser cannot speak — no synthesis, or no voice installed for the chosen
 * language — the text is shown here instead and the panel says why.
 */
export function TrainAnnouncements({ trainNumber }) {
  const { t, language } = useLanguage()
  const { trains, minutes, controls, prefersReducedMotion } = useNetwork()
  const { selectedTrain } = useSelection()

  // Null until the user picks one, so the panel follows the interface language
  // by default and stops following the moment they choose for themselves.
  const [languageOverride, setLanguageOverride] = useState(null)
  const announceLanguage = languageOverride ?? language

  const [auto, setAuto] = useState(false)

  const number = trainNumber ?? selectedTrain ?? null
  const train = useMemo(
    () => (number ? (trains.find((item) => item.number === number) ?? null) : null),
    [trains, number],
  )

  // With no train there is nothing to announce, so the toggle is inert rather
  // than being reset behind the user's back.
  const autoActive = auto && Boolean(train)

  const { latest, spokenAloud, canSpeak, announceNow, stop } = useTrainAnnouncer({
    train,
    minutes,
    language: announceLanguage,
    enabled: autoActive,
  })

  const frozen = !controls.isRunning || prefersReducedMotion

  return (
    <section
      aria-label={t('announce.title')}
      className="border border-line bg-page p-2.5"
    >
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
        <p className="flex items-center gap-2 font-mono text-[0.625rem] font-semibold uppercase tracking-[var(--tracking-rail)] text-fg">
          <Megaphone className="size-3.5 shrink-0" aria-hidden="true" />
          {t('announce.title')}
        </p>

        {/* English / Hindi — the whole selector (§3). */}
        <div className="flex" role="group" aria-label={t('announce.language')}>
          {ANNOUNCEMENT_LANGUAGES.map((entry, i) => (
            <button
              key={entry.code}
              type="button"
              onClick={() => setLanguageOverride(entry.code)}
              aria-pressed={announceLanguage === entry.code}
              lang={entry.code}
              className={`border px-2 py-1 font-mono text-[0.625rem] font-semibold transition-colors ${
                announceLanguage === entry.code
                  ? 'border-fg bg-fg text-page'
                  : 'border-line text-fg-subtle hover:text-fg'
              } ${i > 0 ? '-ml-px' : ''}`}
            >
              {entry.shortLabel}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        <button
          type="button"
          onClick={() => announceNow('station')}
          disabled={!train}
          className="flex items-center gap-1.5 border border-brand bg-brand px-2.5 py-1.5 font-mono text-[0.625rem] font-semibold uppercase tracking-[var(--tracking-rail)] text-brand-fg transition-colors hover:bg-brand-hover disabled:opacity-40"
        >
          <Volume2 className="size-3.5" aria-hidden="true" />
          {t('announce.now')}
        </button>

        <button
          type="button"
          onClick={() => setAuto((value) => !value)}
          disabled={!train}
          aria-pressed={auto}
          title={t('announce.autoHint')}
          className={`flex items-center gap-1.5 border px-2.5 py-1.5 font-mono text-[0.625rem] font-semibold uppercase tracking-[var(--tracking-rail)] transition-colors disabled:opacity-40 ${
            auto
              ? 'border-brand bg-brand-soft text-brand-text'
              : 'border-line text-fg-muted hover:text-fg'
          }`}
        >
          <span
            className={`size-1.5 shrink-0 rounded-full ${auto ? 'bg-brand' : 'bg-fg-subtle'}`}
            aria-hidden="true"
          />
          {t('announce.auto')}
        </button>

        {latest ? (
          <button
            type="button"
            onClick={stop}
            className="flex items-center gap-1.5 border border-line px-2.5 py-1.5 font-mono text-[0.625rem] font-semibold uppercase tracking-[var(--tracking-rail)] text-fg-muted transition-colors hover:text-fg"
          >
            <Square className="size-3" aria-hidden="true" />
            {t('announce.stop')}
          </button>
        ) : null}
      </div>

      {/* The announcement itself, always written out — this is the text
          fallback when speech is unavailable, and the accessible record of
          what was said when it is not. */}
      <div aria-live="polite" className="mt-2">
        {latest ? (
          <div className="border-l-2 border-brand bg-sunken px-2.5 py-2">
            <p className="font-mono text-[0.5625rem] uppercase tracking-[var(--tracking-rail)] text-fg-subtle">
              {t('announce.latest')}
            </p>
            <p lang={announceLanguage} className="mt-1 text-[0.8125rem] leading-6 text-fg">
              {latest.text}
            </p>
          </div>
        ) : (
          <p className="text-[0.75rem] leading-5 text-fg-muted">
            {train ? t('announce.none') : t('announce.noTrain')}
          </p>
        )}
      </div>

      {!canSpeak || (latest && !spokenAloud) ? (
        <p className="mt-1.5 text-[0.6875rem] leading-5 text-caution">{t('announce.textOnly')}</p>
      ) : null}

      {autoActive && frozen ? (
        <p className="mt-1.5 text-[0.6875rem] leading-5 text-fg-muted">{t('announce.paused')}</p>
      ) : null}

      <p className="mt-1.5 font-mono text-[0.5625rem] uppercase tracking-[var(--tracking-rail)] text-fg-subtle">
        {t('announce.simulated')}
      </p>
    </section>
  )
}
