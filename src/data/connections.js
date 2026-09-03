/**
 * Onward departures used by Connection Protection.
 *
 * SIMULATED DATA. The train numbers and names are real services, but the
 * departure times here are authored for the prototype and are not a timetable.
 * Everything that renders these rows carries the 'simulated' trust label from
 * `src/lib/trust.js` so the screen never implies a live IRCTC feed.
 *
 * Keyed by the station the passenger changes at. The journey screen looks up
 * the key for its own destination, so a train terminating somewhere other than
 * New Delhi simply has no connections and shows the unavailable state.
 */
const conn = (trainNumber, trainName, scheduledDeparture, toStation, platform = null) => ({
  trainNumber,
  trainName,
  scheduledDeparture,
  toStation,
  platform,
})

export const connectionsByStation = {
  NDLS: [
    conn('12017', 'New Delhi – Dehradun Shatabdi Express', '06:50', 'Dehradun', '16'),
    conn('12029', 'New Delhi – Amritsar Swarna Shatabdi', '07:20', 'Amritsar Jn', '12'),
    conn('12045', 'New Delhi – Chandigarh Shatabdi Express', '08:50', 'Chandigarh', '3'),
    conn('12015', 'New Delhi – Ajmer Shatabdi Express', '08:58', 'Ajmer Jn', '9'),
    conn('12057', 'New Delhi – Una Himachal Jan Shatabdi', '09:15', 'Una Himachal', '11'),
    conn('12459', 'New Delhi – Amritsar Intercity Express', '10:25', 'Amritsar Jn', '5'),
    conn('12005', 'New Delhi – Kalka Shatabdi Express', '11:05', 'Kalka', '2'),
    conn('12013', 'New Delhi – Amritsar Shatabdi Express', '13:32', 'Amritsar Jn', '12'),
    conn('22470', 'New Delhi – Bikaner Vande Bharat Express', '14:35', 'Bikaner Jn', '4'),
    conn('12313', 'New Delhi – Sealdah Rajdhani Express', '16:10', 'Sealdah', '14'),
  ],
}

/** Every onward departure from a station, or an empty list when none are held. */
export const getConnectionsAt = (stationCode) => connectionsByStation[stationCode] ?? []

/**
 * Find one onward departure by the number the passenger typed.
 *
 * Returns `null` for a number we hold no departure for — the caller must show
 * the "connection data unavailable" state rather than inventing a risk.
 */
export function findConnection(stationCode, trainNumber) {
  const query = String(trainNumber ?? '').trim()
  if (!query) return null
  return getConnectionsAt(stationCode).find((train) => train.trainNumber === query) ?? null
}
