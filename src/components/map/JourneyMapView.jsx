import 'leaflet/dist/leaflet.css'
import { divIcon } from 'leaflet'
import { Crosshair, Maximize2, Minus, Plus } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { CircleMarker, MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from 'react-leaflet'
import { useLanguage } from '../../context/LanguageProvider'
import { useTheme } from '../../context/ThemeProvider'
import { getRouteGeometry } from '../../lib/geo'
import { DelayBadge } from '../ui/DelayBadge'
import { SourceBadge } from '../ui/SourceBadge'
import { getMapColors, TILES } from './mapTheme'

const FIT_PADDING = [36, 36]

/**
 * The four controls §11 asks for and no more.
 *
 * Rendered as ordinary buttons overlaid on the map rather than as Leaflet
 * controls, so they inherit the app's focus ring and keyboard behaviour. They
 * sit outside the Leaflet container on purpose — a plain div inside it would
 * let clicks fall through and start a map drag.
 */
function MapControls({ map, bounds, trainPosition }) {
  const { t } = useLanguage()
  if (!map) return null

  const controls = [
    { id: 'in', icon: Plus, label: t('map.zoomIn'), onClick: () => map.zoomIn() },
    { id: 'out', icon: Minus, label: t('map.zoomOut'), onClick: () => map.zoomOut() },
    {
      id: 'train',
      icon: Crosshair,
      label: t('map.locateTrain'),
      onClick: () => map.flyTo(trainPosition, Math.max(map.getZoom(), 8), { duration: 0.6 }),
    },
    {
      id: 'fit',
      icon: Maximize2,
      label: t('map.fitRoute'),
      onClick: () => map.flyToBounds(bounds, { padding: FIT_PADDING, duration: 0.6 }),
    },
  ]

  return (
    <div className="absolute right-3 top-3 z-[1000] flex flex-col gap-1 rounded-md border border-line bg-surface p-1 shadow-sm">
      {controls.map(({ id, icon: Icon, label, onClick }) => (
        <button
          key={id}
          type="button"
          onClick={onClick}
          title={label}
          aria-label={label}
          className="inline-flex size-8 items-center justify-center rounded text-fg-muted transition-colors hover:bg-sunken hover:text-fg"
        >
          <Icon className="size-4" aria-hidden="true" />
        </button>
      ))}
    </div>
  )
}

/**
 * Frames the route once per train.
 *
 * Keyed on the train number rather than the bounds array: the simulation hands
 * down a fresh journey several times a second, and refitting on every one of
 * those would yank the map back and undo whatever the viewer had panned or
 * zoomed to.
 */
function FitRoute({ bounds, fitKey }) {
  const map = useMap()
  const boundsRef = useRef(bounds)

  useEffect(() => {
    boundsRef.current = bounds
  }, [bounds])

  useEffect(() => {
    map.fitBounds(boundsRef.current, { padding: FIT_PADDING })
  }, [map, fitKey])

  return null
}

function StationPopup({ station }) {
  const { t } = useLanguage()
  const isPassed = station.status === 'completed'

  return (
    <div className="min-w-[13rem] font-sans">
      <p className="text-sm font-bold text-fg">{station.station}</p>
      <p className="font-mono text-[0.6875rem] text-fg-subtle">
        {station.code} · {station.distanceFromOriginKm} {t('unit.km')}
      </p>

      <dl className="mt-2.5 space-y-1.5 border-t border-line pt-2.5">
        <div className="flex items-baseline justify-between gap-4">
          <dt className="text-xs text-fg-muted">{t('upcoming.scheduled')}</dt>
          <dd className="font-mono text-sm tabular-nums text-fg-muted">{station.scheduledTime}</dd>
        </div>
        <div className="flex items-baseline justify-between gap-4">
          <dt className="text-xs font-medium text-brand">
            {isPassed ? t('map.actual') : t('upcoming.railSense')}
          </dt>
          <dd className="font-mono text-sm font-bold tabular-nums text-fg">{station.predictedTime}</dd>
        </div>
        <div className="flex items-baseline justify-between gap-4">
          <dt className="text-xs text-fg-muted">
            {isPassed ? t('map.observedDelay') : t('map.predictedDelay')}
          </dt>
          <dd>
            <DelayBadge minutes={station.predictedDelayMinutes} size="sm" />
          </dd>
        </div>
      </dl>

      <SourceBadge source={isPassed ? 'confirmed' : 'predicted'} className="mt-2.5" />
    </div>
  )
}

function TrainPopup({ journey, train }) {
  const { t } = useLanguage()
  const { current } = journey

  const location = train.atStation
    ? t('map.standingAt', { station: train.atStation.station })
    : t('map.betweenStations', { from: train.previous.station, to: train.next.station })

  const rows = [
    { label: t('map.location'), value: location },
    { label: t('metrics.currentSpeed'), value: `${current.speedKmph} ${t('unit.kmph')}` },
    { label: t('metrics.averageSpeed'), value: `${current.averageSpeedKmph} ${t('unit.kmph')}` },
  ]

  return (
    <div className="min-w-[14rem] font-sans">
      <p className="font-mono text-sm font-bold text-fg">{journey.trainNumber}</p>
      <p className="text-xs text-fg-muted">{journey.trainName}</p>

      <dl className="mt-2.5 space-y-1.5 border-t border-line pt-2.5">
        {rows.map((row) => (
          <div key={row.label} className="flex items-baseline justify-between gap-4">
            <dt className="shrink-0 text-xs text-fg-muted">{row.label}</dt>
            <dd className="text-right text-xs font-medium text-fg">{row.value}</dd>
          </div>
        ))}
        <div className="flex items-baseline justify-between gap-4">
          <dt className="text-xs text-fg-muted">{t('metrics.currentDelay')}</dt>
          <dd>
            <DelayBadge minutes={current.delayMinutes} size="sm" />
          </dd>
        </div>
      </dl>

      <SourceBadge source="simulated" className="mt-2.5" />
    </div>
  )
}

/**
 * The geographic view of one journey.
 *
 * Route behind the train is solid; the route ahead is dashed, because it is the
 * part the forecast is about. Station and train markers are Leaflet vector
 * shapes rather than image pins, which keeps the bundle free of icon assets and
 * lets both follow the app's theme colours.
 */
export default function JourneyMapView({ journey }) {
  const { t } = useLanguage()
  const { theme } = useTheme()
  const colors = getMapColors(theme)

  const [map, setMap] = useState(null)

  const geometry = useMemo(() => getRouteGeometry(journey), [journey])
  const tiles = TILES[theme] ?? TILES.light

  const trainIcon = useMemo(
    () =>
      divIcon({
        className: 'railsense-train-marker',
        html: `<span class="railsense-train-dot" style="--marker:${colors.train}"></span>`,
        iconSize: [22, 22],
        iconAnchor: [11, 11],
      }),
    [colors.train],
  )

  const stationRadius = useCallback((station) => (station.isMajor ? 6 : 3.5), [])

  return (
    <div className="relative h-[22rem] overflow-hidden rounded-lg border border-line sm:h-[26rem] lg:h-[30rem]">
      <MapContainer
        ref={setMap}
        bounds={geometry.bounds}
        boundsOptions={{ padding: FIT_PADDING }}
        zoomControl={false}
        scrollWheelZoom={false}
        className="size-full bg-sunken"
        aria-label={t('map.region', { train: journey.trainNumber })}
      >
        <TileLayer key={theme} url={tiles.url} attribution={tiles.attribution} />
        <FitRoute bounds={geometry.bounds} fitKey={journey.trainNumber} />

        {/* Route already run: solid. */}
        <Polyline positions={geometry.covered} pathOptions={{ color: colors.covered, weight: 4, opacity: 0.95 }} />
        {/* Route still ahead: dashed, because every time on it is a forecast. */}
        <Polyline
          positions={geometry.ahead}
          pathOptions={{ color: colors.ahead, weight: 3, opacity: 0.85, dashArray: '2 8', lineCap: 'round' }}
        />

        {geometry.stations.map((station) => (
          <CircleMarker
            key={station.code + station.distanceFromOriginKm}
            center={station.position}
            radius={stationRadius(station)}
            pathOptions={{
              color: station.status === 'completed' ? colors.major : colors.stationLine,
              weight: 2,
              fillColor: colors.station,
              fillOpacity: 1,
            }}
          >
            <Popup>
              <StationPopup station={station} />
            </Popup>
          </CircleMarker>
        ))}

        <Marker
          position={geometry.train.position}
          icon={trainIcon}
          title={t('journey.markerLabel', { train: journey.trainNumber })}
        >
          <Popup>
            <TrainPopup journey={journey} train={geometry.train} />
          </Popup>
        </Marker>
      </MapContainer>

      <MapControls map={map} bounds={geometry.bounds} trainPosition={geometry.train.position} />
    </div>
  )
}
