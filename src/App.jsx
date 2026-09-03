import { useCallback, useEffect, useState } from 'react'
import { Footer } from './components/layout/Footer'
import { Navbar } from './components/layout/Navbar'
import { SkipLink } from './components/layout/SkipLink'
import { LanguageProvider } from './context/LanguageProvider'
import { ThemeProvider } from './context/ThemeProvider'
import { Home } from './pages/Home'
import { Journey } from './pages/Journey'
import { Results } from './pages/Results'

const HOME_VIEW = { name: 'home' }

/**
 * Three views, held in component state and mirrored into the history stack so
 * the browser's back button works. The URL is left alone: the landing page uses
 * hash anchors for its sections, and a static host has no routes to serve.
 */
export default function App() {
  const [view, setView] = useState(HOME_VIEW)

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

  const goHome = useCallback(
    (hash) => {
      navigate(HOME_VIEW)
      if (hash) {
        requestAnimationFrame(() => {
          document.getElementById(hash.slice(1))?.scrollIntoView({ block: 'start' })
        })
      }
    },
    [navigate],
  )

  const openTrain = useCallback(
    (trainNumber) => navigate({ name: 'journey', trainNumber }),
    [navigate],
  )

  const openResults = useCallback((criteria) => navigate({ name: 'results', criteria }), [navigate])

  return (
    <ThemeProvider>
      <LanguageProvider>
        <div className="flex min-h-dvh flex-col bg-page">
          <SkipLink />
          <Navbar isHome={view.name === 'home'} onNavigateHome={goHome} />

          <main id="main" tabIndex={-1} className="flex-1 outline-none">
            {view.name === 'home' ? (
              <Home onSearch={openResults} onOpenTrain={openTrain} />
            ) : null}

            {view.name === 'results' ? (
              <Results
                criteria={view.criteria}
                onSelectTrain={openTrain}
                onBack={() => goHome()}
              />
            ) : null}

            {view.name === 'journey' ? (
              <Journey
                trainNumber={view.trainNumber}
                onBack={() => window.history.back()}
                onOpenTrain={openTrain}
              />
            ) : null}
          </main>

          <Footer />
        </div>
      </LanguageProvider>
    </ThemeProvider>
  )
}
