import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { navItems, viewHrefs } from '../../data/content'
import { useLanguage } from '../../context/LanguageProvider'
import { cn } from '../../lib/cn'
import { IconButton } from '../ui/IconButton'
import { LanguageSelect } from '../ui/LanguageSelect'
import { Logo } from '../ui/Logo'
import { ThemeToggle } from '../ui/ThemeToggle'
import { SimClock } from './SimClock'

/**
 * The primary navigation.
 *
 * Two states, driven by `data-tone` and styled in index.css:
 *
 *   tinted  at the top of the page — a full-bleed pastel light-brown plane
 *   glass   once scrolled — the bar lifts off the page into a floating pill
 *
 * Both states keep the normal ink ramp, so every child (wordmark, clock, icon
 * buttons) holds its usual contrast without needing a variant.
 */
export function Navbar({ isHome = true, currentHref, onNavigateHome }) {
  const { t } = useLanguage()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [clickedHref, setClickedHref] = useState('#top')
  const [isScrolled, setIsScrolled] = useState(false)

  // Derived, not synced: when the shell is on a view of its own (`#live`, or a
  // train/results screen where nothing in this bar applies) that wins, and the
  // clicked section only governs highlighting while on the landing page. A
  // `null` currentHref matches no item, so nothing is marked current.
  const activeHref = currentHref !== undefined ? currentHref : clickedHref

  useEffect(() => {
    const syncFromHash = () => setClickedHref(window.location.hash || '#top')
    window.addEventListener('hashchange', syncFromHash)
    return () => window.removeEventListener('hashchange', syncFromHash)
  }, [])

  useEffect(() => {
    // A threshold rather than 0, so the bar cannot flicker between its two
    // states on a one-pixel scroll or an elastic overscroll.
    const onScroll = () => setIsScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!isMenuOpen) return
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setIsMenuOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [isMenuOpen])

  const handleNavClick = (event, href) => {
    setClickedHref(href)
    // View hrefs are always handled by the app shell; only true section
    // anchors are left to the browser, and only while on the landing page.
    if (isHome && !viewHrefs.has(href)) return
    // The section anchors only exist on the landing page.
    event.preventDefault()
    onNavigateHome?.(href)
  }

  /**
   * Small, bold and widely tracked: the lettering carries the hierarchy, so
   * the current item needs only a quiet filled pill. The underline rule the
   * square bar used reads as a mistake inside a rounded one.
   */
  const itemClass = (href, shape) =>
    cn(
      'text-[0.75rem] font-semibold uppercase tracking-[0.11em] transition-colors duration-200',
      shape,
      activeHref === href
        ? 'bg-[color-mix(in_srgb,var(--fg)_11%,transparent)] text-fg'
        : 'text-fg-muted hover:bg-[color-mix(in_srgb,var(--fg)_6%,transparent)] hover:text-fg',
    )

  return (
    <header data-tone={isScrolled ? 'glass' : 'tinted'} className="nav-shell sticky top-0 z-40">
      <div
        className={cn(
          'nav-bar mx-auto flex items-center gap-1 transition-[padding] duration-300',
          // Extra inner padding in the pill so the wordmark is not flush
          // against its curve.
          isScrolled ? 'h-14 max-w-[1180px] px-5' : 'h-16 max-w-[1240px] px-3 sm:px-4',
        )}
      >
        <a href="#top" onClick={(event) => handleNavClick(event, '#top')} className="mr-2 shrink-0">
          <Logo />
          <span className="sr-only">RailSense — home</span>
        </a>

        <span className="hidden h-6 w-px shrink-0 bg-line lg:block" aria-hidden="true" />

        <nav aria-label={t('nav.primary')} className="hidden flex-1 lg:block">
          <ul className="flex items-center gap-0.5 pl-1">
            {navItems.map((item) => (
              <li key={item.id}>
                <a
                  href={item.href}
                  aria-current={activeHref === item.href ? 'page' : undefined}
                  onClick={(event) => handleNavClick(event, item.href)}
                  className={itemClass(
                    item.href,
                    'inline-flex items-center rounded-full px-3 py-1.5',
                  )}
                >
                  {t(item.labelKey)}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <SimClock className="ml-auto lg:ml-2" />

        <div className="ml-auto flex items-center gap-1.5 lg:ml-3">
          <LanguageSelect className="hidden sm:block" />
          <ThemeToggle />
          <IconButton
            label={isMenuOpen ? t('nav.closeMenu') : t('nav.openMenu')}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-nav"
            onClick={() => setIsMenuOpen((open) => !open)}
            className="lg:hidden"
          >
            {isMenuOpen ? (
              <X className="size-4" aria-hidden="true" />
            ) : (
              <Menu className="size-4" aria-hidden="true" />
            )}
          </IconButton>
        </div>
      </div>

      {isMenuOpen ? (
        <nav
          id="mobile-nav"
          aria-label={t('nav.primary')}
          className="nav-sheet border-t border-line bg-surface lg:hidden"
        >
          <ul className="mx-auto flex max-w-[1240px] flex-col gap-0.5 p-2">
            {navItems.map((item) => (
              <li key={item.id}>
                <a
                  href={item.href}
                  aria-current={activeHref === item.href ? 'page' : undefined}
                  onClick={(event) => {
                    handleNavClick(event, item.href)
                    setIsMenuOpen(false)
                  }}
                  className={itemClass(item.href, 'block rounded-full px-3.5 py-2.5')}
                >
                  {t(item.labelKey)}
                </a>
              </li>
            ))}
            <li className="mt-1 border-t border-line px-1.5 pt-2.5 sm:hidden">
              <LanguageSelect />
            </li>
          </ul>
        </nav>
      ) : null}
    </header>
  )
}
