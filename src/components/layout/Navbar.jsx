import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { navItems } from '../../data/content'
import { useLanguage } from '../../context/LanguageProvider'
import { cn } from '../../lib/cn'
import { IconButton } from '../ui/IconButton'
import { LanguageSelect } from '../ui/LanguageSelect'
import { Logo } from '../ui/Logo'
import { ThemeToggle } from '../ui/ThemeToggle'
import { SimClock } from './SimClock'

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
    const onScroll = () => setIsScrolled(window.scrollY > 8)
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
    // `#live` names a view rather than a section, so it is always handled by
    // the app shell — letting the browser treat it as an anchor would simply
    // find no element and do nothing.
    if (isHome && href !== '#live') return
    // The section anchors only exist on the landing page.
    event.preventDefault()
    onNavigateHome?.(href)
  }

  const linkClass = (href) =>
    cn(
      'relative inline-flex h-full items-center px-3 text-[0.8125rem] font-semibold uppercase tracking-[0.06em] transition-colors duration-150',
      'after:absolute after:inset-x-3 after:bottom-0 after:h-[2px] after:scale-x-0 after:bg-brand after:transition-transform after:duration-200 after:ease-[var(--ease-snap)]',
      activeHref === href
        ? 'text-fg after:scale-x-100'
        : 'text-fg-muted hover:text-fg hover:after:scale-x-75',
    )

  return (
    <header
      className={cn(
        'sticky top-0 z-40 border-b border-line transition-[background-color,box-shadow] duration-200',
        isScrolled
          ? 'bg-[color-mix(in_srgb,var(--surface)_92%,transparent)] shadow-sm backdrop-blur-sm'
          : 'bg-surface',
      )}
    >
      <div
        className={cn(
          'mx-auto flex max-w-[1240px] items-center gap-1 px-4 transition-[height] duration-200 sm:px-6',
          isScrolled ? 'h-14' : 'h-16',
        )}
      >
        <a
          href="#top"
          onClick={(event) => handleNavClick(event, '#top')}
          className="mr-2 shrink-0"
        >
          <Logo />
          <span className="sr-only">RailSense — home</span>
        </a>

        <span className="hidden h-6 w-px shrink-0 bg-line lg:block" aria-hidden="true" />

        <nav aria-label={t('nav.primary')} className="hidden h-full flex-1 lg:block">
          <ul className="flex h-full items-stretch">
            {navItems.map((item) => (
              <li key={item.id} className="h-full">
                <a
                  href={item.href}
                  aria-current={activeHref === item.href ? 'page' : undefined}
                  onClick={(event) => handleNavClick(event, item.href)}
                  className={linkClass(item.href)}
                >
                  {t(item.labelKey)}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <SimClock className="ml-auto lg:ml-4" />

        <div className="ml-auto flex items-center gap-2 lg:ml-4">
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
          className="border-t border-line bg-surface lg:hidden"
        >
          <ul className="mx-auto flex max-w-[1240px] flex-col px-4 py-2 sm:px-6">
            {navItems.map((item) => (
              <li key={item.id}>
                <a
                  href={item.href}
                  aria-current={activeHref === item.href ? 'page' : undefined}
                  onClick={(event) => {
                    handleNavClick(event, item.href)
                    setIsMenuOpen(false)
                  }}
                  className={cn(
                    'block border-l-2 py-2.5 pl-3 text-sm font-semibold uppercase tracking-[0.06em]',
                    activeHref === item.href
                      ? 'border-brand text-fg'
                      : 'border-transparent text-fg-muted',
                  )}
                >
                  {t(item.labelKey)}
                </a>
              </li>
            ))}
            <li className="mt-2 border-t border-line pt-3 sm:hidden">
              <LanguageSelect />
            </li>
          </ul>
        </nav>
      ) : null}
    </header>
  )
}
