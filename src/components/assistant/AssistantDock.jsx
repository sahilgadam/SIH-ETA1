import { useEffect, useRef, useState } from 'react'
import { Mic, X } from 'lucide-react'
import { useLanguage } from '../../context/LanguageProvider'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { AskRailSense } from './AskRailSense'

/**
 * The persistent Ask RailSense control (§11).
 *
 * The previous version was a quiet outlined button that read as a footer
 * utility and was easy to miss. This one is filled in the brand green with a
 * live microphone glyph, so it is unmistakably an interactive control — but it
 * is still a square-cornered instrument, not a circular chat bubble, because
 * it belongs to this product rather than to a generic assistant widget.
 *
 * Desktop opens a panel anchored bottom-right; small screens get a bottom
 * sheet that can use the full width (§18).
 */
export function AssistantDock() {
  const { t } = useLanguage()
  const prefersReducedMotion = usePrefersReducedMotion()
  const [open, setOpen] = useState(false)

  const panelRef = useRef(null)
  const buttonRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setOpen(false)
        buttonRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open])

  useEffect(() => {
    if (open) panelRef.current?.focus()
  }, [open])

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-end p-3 sm:p-5">
      {open ? (
        <div
          ref={panelRef}
          tabIndex={-1}
          role="dialog"
          aria-modal="false"
          aria-label={t('ask.title')}
          className={`pointer-events-auto w-full border border-line-strong bg-surface shadow-[var(--shadow-warm-md)] outline-none sm:w-[24rem] ${
            prefersReducedMotion ? '' : 'motion-safe:animate-[dock-in_220ms_var(--ease-rail)]'
          }`}
        >
          <div className="flex items-center justify-between gap-3 border-b border-line bg-brand px-3 py-2">
            <p className="flex items-center gap-2 font-mono text-[0.6875rem] font-semibold uppercase tracking-[var(--tracking-rail)] text-brand-fg">
              <Mic className="size-3.5" aria-hidden="true" />
              {t('ask.title')}
            </p>
            <button
              type="button"
              onClick={() => {
                setOpen(false)
                buttonRef.current?.focus()
              }}
              aria-label={t('assistant.close')}
              className="text-brand-fg/70 transition-colors hover:text-brand-fg"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="max-h-[70vh] overflow-y-auto p-3">
            <AskRailSense />
          </div>
        </div>
      ) : (
        <button
          ref={buttonRef}
          type="button"
          onClick={() => setOpen(true)}
          className="pointer-events-auto flex w-full items-center justify-center gap-2.5 border border-brand bg-brand px-4 py-3 text-brand-fg shadow-[var(--shadow-warm-md)] transition-colors hover:bg-brand-hover sm:w-auto sm:py-2.5"
        >
          {/* A steady dot, not a pinging one: the expanding disc was drawn in
              the same near-white as the label and scaled straight across it,
              washing the text out on every cycle. */}
          <span className="size-1.5 rounded-full bg-brand-fg" aria-hidden="true" />
          <Mic className="size-4" aria-hidden="true" />
          <span className="font-mono text-[0.6875rem] font-semibold uppercase tracking-[var(--tracking-rail)]">
            {t('ask.title')}
          </span>
          <span className="hidden border-l border-brand-fg/30 pl-2.5 text-xs sm:inline">
            {t('assistant.prompt')}
          </span>
        </button>
      )}
    </div>
  )
}
