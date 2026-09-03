import { useCallback, useEffect, useState } from 'react'
import { AssistantDock } from './components/assistant/AssistantDock'
import { Footer } from './components/layout/Footer'
import { Navbar } from './components/layout/Navbar'
import { SkipLink } from './components/layout/SkipLink'
import { LanguageProvider } from './context/LanguageProvider'
import { NetworkProvider } from './context/NetworkProvider'
import { SelectionProvider, useSelection } from './context/SelectionProvider'
import { ThemeProvider } from './context/ThemeProvider'
import { Home } from './pages/Home'
import { Journey } from './pages/Journey'
import { LiveStatus } from './pages/LiveStatus'
import { Results } from './pages/Results'

const HOME_VIEW = { name: 'home' }
const LIVE_VIEW = { name: 'live' }

/**
 * Four views, held in component state and mirrored into the history stack so
 * the browser's back button works. The URL is left alone: the landing page
 * uses hash anchors for its sections, and a static host has no routes to serve.
 *
 * `#live` is treated as a view rather than an anchor, so the navbar's LIVE
 * STATUS entry opens the map screen while every other entry still scrolls the
 * landing page.
 */
function Shell() {
  // A direct hit on /#live should land on the map, so the navbar entry is a
  // shareable link rather than only an in-page action.
  const [view, setView] = useState(() =>
    typeof window !== 'undefined' && window.location.hash === '#live' ? LIVE_VIEW : HOME_VIEW,
  )
  const { registerNavigate } = useSelection()

  useEffect(() => {
    const onPopState = (event) => setView(event.state?.railsenseView ?? HOME_VIEW)
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  const navigate = useCallback((next) => {
    window.history.pushState({ railsenseView: next }, '')
    setView(next)
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [])

  const openLive = useCallback(() => navigate(LIVE_VIEW), [navigate])

  // The assistant can answer from anywhere, so it needs a way to bring the
  // user to the map it has just acted on.
  useEffect(() => {
    registerNavigate(() => setView((current) => {
      if (current.name === 'live') return current
      window.history.pushState({ railsenseView: LIVE_VIEW }, '')
      window.scrollTo({ top: 0, behavior: 'instant' })
      return LIVE_VIEW
    }))
  }, [registerNavigate])

  const goHome = useCallback(
    (hash) => {
      if (hash === '#live') {
        openLive()
        return
      }
      navigate(HOME_VIEW)
      if (hash) {
        requestAnimationFrame(() => {
          document.getElementById(hash.slice(1))?.scrollIntoView({ block: 'start' })
        })
      }
    },
    [navigate, openLive],
  )

  const openTrain = useCallback(
    (trainNumber) => navigate({ name: 'journey', trainNumber }),
    [navigate],
  )

  const openResults = useCallback((criteria) => navigate({ name: 'results', criteria }), [navigate])

  return (
    <div className="flex min-h-dvh flex-col bg-page">
      <SkipLink />
      <Navbar
        isHome={view.name === 'home'}
        currentHref={view.name === 'live' ? '#live' : view.name === 'home' ? undefined : null}
        onNavigateHome={goHome}
      />

      <main id="main" tabIndex={-1} className="flex-1 outline-none">
        {view.name === 'home' ? (
          <Home onSearch={openResults} onOpenTrain={openTrain} onOpenLive={openLive} />
        ) : null}

        {view.name === 'live' ? <LiveStatus /> : null}

        {view.name === 'results' ? (
          <Results criteria={view.criteria} onSelectTrain={openTrain} onBack={() => goHome()} />
        ) : null}

        {view.name === 'journey' ? (
          <Journey trainNumber={view.trainNumber} onBack={() => window.history.back()} />
        ) : null}
      </main>

      <Footer />

      {/* The dock is fixed to the bottom edge; on small screens it spans the
          width, so the shell reserves that height to keep it off the end of
          the page rather than floating over the footer. */}
      <div aria-hidden="true" className="h-16 sm:h-0" />

      {/* Reachable from every view, never in the content's way. */}
      <AssistantDock />
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <NetworkProvider>
          <SelectionProvider>
            <Shell />
          </SelectionProvider>
        </NetworkProvider>
      </LanguageProvider>
    </ThemeProvider>
  )
}
