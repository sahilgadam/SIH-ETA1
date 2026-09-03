/**
 * Data-trust vocabulary (§29).
 *
 * Every figure on the journey screen is one of four things, and the screen says
 * which. This prototype is not connected to Indian Railways or NTES, so nothing
 * is allowed to render as "confirmed" unless it is a scheduled timetable value
 * or a position the prototype treats as observed.
 */
export const SOURCES = {
  /** Timetable and already-observed values. */
  confirmed: { tone: 'confirmed', labelKey: 'trust.confirmed' },
  /** Output of the rule-based forecast in `src/lib/prediction.js`. */
  predicted: { tone: 'predicted', labelKey: 'trust.predicted' },
  /** Mock data authored for the prototype: positions, speeds, onward departures. */
  simulated: { tone: 'simulated', labelKey: 'trust.simulated' },
  /** Deliberately absent — shown instead of inventing a value. */
  unavailable: { tone: 'unavailable', labelKey: 'trust.unavailable' },
}

export const getSource = (name) => SOURCES[name] ?? SOURCES.unavailable
