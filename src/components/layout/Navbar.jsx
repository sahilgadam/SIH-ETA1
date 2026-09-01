import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { navItems } from '../../data/content'
import { useLanguage } from '../../context/LanguageProvider'
import { cn } from '../../lib/cn'
import { IconButton } from '../ui/IconButton'
import { LanguageSelect } from '../ui/LanguageSelect'
import { Logo } from '../ui/Logo'
import { ThemeToggle } from '../ui/ThemeToggle'

export function Navbar({ isHome = true, onNavigateHome }) {
  const { t } = useLanguage()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeHref, setActiveHref] = useState('#top')

  useEffect(() => {
    const syncFromHash = () => setActiveHref(window.location.hash || '#top')
    window.addEventListener('hashchange', syncFromHash)
    return () => window.removeEventListener('hashchange', syncFromHash)
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
    setActiveHref(href)
    if (isHome) return
    // The section anchors only exist on the landing page.
    event.preventDefault()
    onNavigateHome?.(href)
  }

  const linkClass = (href) =>
    cn(
      'rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors duration-150',
      activeHref === href
        ? 'bg-sunken text-fg'
        : 'text-fg-muted hover:bg-sunken hover:text-fg',
    )

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center gap-4 px-4 sm:px-6">
        <a
          href="#top"
          onClick={(event) => handleNavClick(event, '#top')}
          className="shrink-0"
        >
          <Logo />
          <span className="sr-only">RailSense — home</span>
        </a>

        <nav aria-label={t('nav.primary')} className="hidden flex-1 lg:block">
          <ul className="flex items-center gap-0.5">
            {navItems.map((item) => (
              <li key={item.id}>
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

        <div className="ml-auto flex items-center gap-2 lg:ml-0">
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
          <ul className="mx-auto flex max-w-[1200px] flex-col px-4 py-2 sm:px-6">
            {navItems.map((item) => (
              <li key={item.id}>
                <a
                  href={item.href}
                  aria-current={activeHref === item.href ? 'page' : undefined}
                  onClick={(event) => {
                    handleNavClick(event, item.href)
                    setIsMenuOpen(false)
                  }}
                  className={cn('block py-2.5 text-sm font-medium', linkClass(item.href))}
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
