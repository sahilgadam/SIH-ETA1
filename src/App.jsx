import { useCallback, useEffect, useState } from 'react'
import { AssistantDock } from './components/assistant/AssistantDock'
import { Footer } from './components/layout/Footer'
import { Navbar } from './components/layout/Navbar'
import { SkipLink } from './components/layout/SkipLink'
import { LanguageProvider } from './context/LanguageProvider'
import { NetworkProvider } from './context/NetworkProvider'
import { SelectionProvider, useSelection } from './context/SelectionProvider'
import { ThemeProvider } from './context/ThemeProvider'
import { Alerts } from './pages/Alerts'
import { Home } from './pages/Home'
import { LiveStatus } from './pages/LiveStatus'
import { Results } from './pages/Results'
import { TrainDetail } from './pages/TrainDetail'
import { Stations } from './pages/Stations'
import { Trains } from './pages/Trains'

const HOME_VIEW = { name: 'home' }

/**
 * Views are held in component state and mirrored into the history stack so the
 * browser's back button works. The URL is left alone beyond its hash: a static
 * host has no routes to serve.
 *
 * Four of the navbar's entries name a *view* rather than a section of the
 * landing page. They are listed here so the navbar, a deep link and the
 * assistant all resolve them the same way.
 */
const VIEW_FOR_HASH = {
  '#live': { name: 'live' },
  '#trains': { name: 'trains' },
  '#stations': { name: 'stations' },
  '#alerts': { name: 'alerts' },
}

const hashForView = (name) =>
  Object.entries(VIEW_FOR_HASH).find(([, view]) => view.name === name)?.[0]

/**
 * The canonical train record lives at its own addressable hash, so a search
 * result and "View train details" resolve to the identical URL and the page
 * can be linked and shared. `#trains` (plural) is the class explorer, so the
 * record is singular to avoid colliding with it.
 */
const TRAIN_HASH = /^#train\/(\w+)$/

function viewForHash(hash) {
  const record = TRAIN_HASH.exec(hash ?? '')
  if (record) return { name: 'train', trainNumber: record[1] }
  return VIEW_FOR_HASH[hash] ?? null
}

function Shell() {
  const [view, setView] = useState(() =>
    (typeof window !== 'undefined' ? viewForHash(window.location.hash) : null) ?? HOME_VIEW,
  )
  const { registerNavigate } = useSelection()

  useEffect(() => {
    const onPopState = (event) => setView(event.state?.railsenseView ?? HOME_VIEW)

    // A hash typed into the address bar (or a shared /#stations link followed
    // from within the app) changes the fragment without reloading, so the
    // shell has to resolve it too — otherwise the navbar highlights the new
    // section while the page still shows the old one.
    const onHashChange = () => {
      const target = viewForHash(window.location.hash)
      if (target) setView(target)
    }

    window.addEventListener('popstate', onPopState)
    window.addEventListener('hashchange', onHashChange)
    return () => {
      window.removeEventListener('popstate', onPopState)
      window.removeEventListener('hashchange', onHashChange)
    }
  }, [])

  const navigate = useCallback((next, hash) => {
    window.history.pushState({ railsenseView: next }, '', hash ?? undefined)
    setView(next)
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [])

  /**
   * The one way into the canonical train record. Both the search results and
   * Live Status's "View train details" call this, so neither can drift onto
   * its own detail screen (§8, §18).
   */
  const openTrainDetail = useCallback(
    (trainNumber) => navigate({ name: 'train', trainNumber }, `#train/${trainNumber}`),
    [navigate],
  )

  const openLive = useCallback(() => navigate({ name: 'live' }), [navigate])
  const openTrains = useCallback(
    (categoryId) => navigate({ name: 'trains', categoryId }),
    [navigate],
  )

  // The assistant answers from anywhere, so it needs a way to bring the user
  // to the map it has just acted on.
  useEffect(() => {
    registerNavigate(() =>
      setView((current) => {
        if (current.name === 'live') return current
        window.history.pushState({ railsenseView: { name: 'live' } }, '')
        window.scrollTo({ top: 0, behavior: 'instant' })
        return { name: 'live' }
      }),
    )
  }, [registerNavigate])

  const goHome = useCallback(
    (hash) => {
      const target = VIEW_FOR_HASH[hash]
      if (target) {
        navigate(target)
        return
      }
      navigate(HOME_VIEW)
      if (hash) {
        requestAnimationFrame(() => {
          document.getElementById(hash.slice(1))?.scrollIntoView({ block: 'start' })
        })
      }
    },
    [navigate],
  )

  const openResults = useCallback((criteria) => navigate({ name: 'results', criteria }), [navigate])

  return (
    <div className="flex min-h-dvh flex-col bg-page">
      <SkipLink />
      <Navbar
        isHome={view.name === 'home'}
        currentHref={view.name === 'home' ? undefined : (hashForView(view.name) ?? null)}
        onNavigateHome={goHome}
      />

      <main id="main" tabIndex={-1} className="flex-1 outline-none">
        {view.name === 'home' ? (
          <Home onSearch={openResults} onOpenLive={openLive} onOpenTrains={openTrains} />
        ) : null}

        {view.name === 'live' ? <LiveStatus onOpenTrainDetail={openTrainDetail} /> : null}
        {view.name === 'trains' ? (
          <Trains initialCategory={view.categoryId} onOpenTrainDetail={openTrainDetail} />
        ) : null}
        {view.name === 'stations' ? <Stations onOpenTrainDetail={openTrainDetail} /> : null}
        {view.name === 'alerts' ? <Alerts /> : null}

        {view.name === 'results' ? (
          <Results criteria={view.criteria} onSelectTrain={openTrainDetail} onBack={() => goHome()} />
        ) : null}

        {/* One record page, reached from search and from Live Status alike. */}
        {view.name === 'train' ? (
          <TrainDetail trainNumber={view.trainNumber} onBack={() => window.history.back()} />
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
