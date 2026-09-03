import { BellRing, Radio, ShieldCheck, Timer } from 'lucide-react'

/**
 * Primary navigation. Every entry points at a real section of this page for
 * now; each will become its own route once those screens are built.
 */
/**
 * Nav entries whose href names a whole VIEW rather than a section of the
 * landing page. The navbar must always intercept these — letting the browser
 * treat them as anchors would simply find no element and do nothing — and the
 * app shell resolves them to a page.
 */
export const viewHrefs = new Set(['#live', '#trains', '#stations', '#alerts'])

export const navItems = [
  { id: 'home', href: '#top', labelKey: 'nav.home' },
  { id: 'live-status', href: '#live', labelKey: 'nav.liveStatus' },
  { id: 'trains', href: '#trains', labelKey: 'nav.trains' },
  { id: 'stations', href: '#stations', labelKey: 'nav.stations' },
  { id: 'alerts', href: '#alerts', labelKey: 'nav.alerts' },
  { id: 'about', href: '#about', labelKey: 'nav.about' },
]

/** The four things RailSense actually does. */
export const valueProps = [
  { id: 'live-tracking', icon: Radio, titleKey: 'value.live.title', bodyKey: 'value.live.body' },
  { id: 'dynamic-eta', icon: Timer, titleKey: 'value.eta.title', bodyKey: 'value.eta.body' },
  { id: 'alerts', icon: BellRing, titleKey: 'value.alerts.title', bodyKey: 'value.alerts.body' },
  {
    id: 'reliable',
    icon: ShieldCheck,
    titleKey: 'value.reliable.title',
    bodyKey: 'value.reliable.body',
  },
]

/** Quick-fill shortcuts for the route search. */
export const quickRoutes = [
  { from: 'NDLS', to: 'BCT' },
  { from: 'HWH', to: 'NDLS' },
  { from: 'MAS', to: 'SBC' },
]

/** Quick-fill shortcuts for the departure board. */
export const quickStations = ['NDLS', 'CSMT', 'HWH', 'MAS', 'SC']

export const footerSections = [
  {
    id: 'product',
    titleKey: 'footer.product',
    links: [
      { labelKey: 'nav.liveStatus', href: '#live' },
      { labelKey: 'nav.stations', href: '#stations' },
      { labelKey: 'nav.trains', href: '#trains' },
    ],
  },
  {
    id: 'company',
    titleKey: 'footer.company',
    links: [
      { labelKey: 'footer.about', href: '#about' },
      { labelKey: 'footer.contact', href: 'mailto:hello@railsense.app' },
    ],
  },
]
