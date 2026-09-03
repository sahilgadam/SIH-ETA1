import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'

/**
 * What the interface is currently pointed at.
 *
 * This exists so the assistant can *do* things rather than only say them
 * (§16). When it answers "12952 is between Kanpur and New Delhi", it also
 * dispatches `selectTrain`, and the map — which is a different subtree
 * entirely — selects that service, draws its route and flies to it. The
 * service list and the station timeline read the same state, so everything
 * agrees without any of them knowing about each other.
 */

const SelectionContext = createContext(null)

export function SelectionProvider({ children }) {
  const [selectedTrain, setSelectedTrain] = useState(null)
  const [selectedStation, setSelectedStation] = useState(null)
  const [highlightedStop, setHighlightedStop] = useState(null)
  const [followSelected, setFollowSelected] = useState(false)

  // App registers how to reach the live map, so an answer given from the
  // landing page can still take the user to the thing it is describing.
  const navigateRef = useRef(null)
  const registerNavigate = useCallback((fn) => {
    navigateRef.current = fn
  }, [])

  const selectTrain = useCallback((number, { navigate = false } = {}) => {
    setSelectedTrain(number)
    setSelectedStation(null)
    if (navigate) navigateRef.current?.()
  }, [])

  const focusStation = useCallback((code, { navigate = false } = {}) => {
    setSelectedStation(code)
    setSelectedTrain(null)
    if (navigate) navigateRef.current?.()
  }, [])

  const highlightStop = useCallback((code) => setHighlightedStop(code), [])

  const clear = useCallback(() => {
    setSelectedTrain(null)
    setSelectedStation(null)
    setHighlightedStop(null)
  }, [])

  /** Apply the action list an assistant answer came back with. */
  const applyActions = useCallback(
    (actions = [], { navigate = true } = {}) => {
      for (const action of actions) {
        if (action.type === 'selectTrain') selectTrain(action.number, { navigate })
        if (action.type === 'focusStation') focusStation(action.code, { navigate })
        if (action.type === 'highlightStop') highlightStop(action.code)
      }
    },
    [selectTrain, focusStation, highlightStop],
  )

  const value = useMemo(
    () => ({
      selectedTrain,
      selectedStation,
      highlightedStop,
      followSelected,
      setFollowSelected,
      selectTrain,
      focusStation,
      highlightStop,
      applyActions,
      clear,
      registerNavigate,
    }),
    [
      selectedTrain,
      selectedStation,
      highlightedStop,
      followSelected,
      selectTrain,
      focusStation,
      highlightStop,
      applyActions,
      clear,
      registerNavigate,
    ],
  )

  return <SelectionContext.Provider value={value}>{children}</SelectionContext.Provider>
}

export function useSelection() {
  const context = useContext(SelectionContext)
  if (!context) throw new Error('useSelection must be used inside <SelectionProvider>')
  return context
}
