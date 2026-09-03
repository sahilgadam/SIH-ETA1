/**
 * The operations bulletin — the copy behind the Alerts newspaper.
 *
 * DEMO / SIMULATED. These read like real notices because a bulletin that
 * reads like lorem ipsum tells you nothing about whether the layout works,
 * but none of it describes a real engineering possession or restriction. The
 * page says so in the masthead and the footer rule.
 *
 * Two kinds of story appear on the pages:
 *   - authored notices (below), the slow operational news
 *   - live stories, built at render time from the running simulation, so the
 *     front page reports the delays the map is actually showing (§10)
 */

export const SEVERITY = {
  critical: { id: 'critical', label: 'Disruption', tone: 'danger' },
  major: { id: 'major', label: 'Major delay', tone: 'danger' },
  warning: { id: 'warning', label: 'Caution', tone: 'caution' },
  works: { id: 'works', label: 'Engineering', tone: 'brass' },
  info: { id: 'info', label: 'Notice', tone: 'ink' },
}

/** Authored operational notices. `weight` drives the typographic hierarchy. */
export const bulletins = [
  {
    id: 'brc-rtm-congestion',
    severity: 'critical',
    section: 'Section control',
    headline: 'Vadodara–Ratlam running heavy through the evening peak',
    standfirst:
      'Sustained congestion between Vadodara Junction and Ratlam has added six to eleven minutes to every path through the section since 16:00.',
    body: [
      'Controllers have been looping slower goods traffic at Godhra and Dahod to protect the passenger paths, but the recovery margin built into the evening timetable has been absorbed almost entirely.',
      'Services routed via Kota are expected to hold their booked arrival; those continuing to Ratlam are being re-timed section by section.',
    ],
    place: 'BRC–RTM',
    weight: 'lead',
    image: 'converging-tracks',
  },
  {
    id: 'tsr-section-4b',
    severity: 'warning',
    section: 'Speed restriction',
    headline: 'Temporary restriction of 45 km/h imposed on Section 4B',
    standfirst:
      'A precautionary restriction is in force following track-circuit irregularities reported by two consecutive services.',
    body: [
      'Permanent way staff attended the site overnight. The restriction remains until the section is passed fit, expected within 48 hours.',
      'Expect an additional three to four minutes on all traffic through the affected length.',
    ],
    place: 'Section 4B',
    weight: 'standard',
  },
  {
    id: 'cnb-engineering',
    severity: 'works',
    section: 'Engineering work',
    headline: 'Night possession at Kanpur Central, platforms 7 and 8',
    standfirst:
      'Relaying work takes both platforms out of use between 01:00 and 05:00 for four consecutive nights.',
    body: [
      'Overnight services will be platformed on 1 to 4. Passengers should allow additional time for the longer walk from the concourse.',
    ],
    place: 'CNB',
    weight: 'standard',
  },
  {
    id: 'signal-p21',
    severity: 'critical',
    section: 'Signalling',
    headline: 'Signal P-21 held at caution after intermittent aspect fault',
    standfirst:
      'Trains are being cautioned past the signal under written authority while the S&T team investigate.',
    body: [
      'The fault was first reported at 14:12 and has recurred twice since. Until it is cleared, every service must stop and proceed, which is adding roughly four minutes per train.',
      'A relief signalling team is on site.',
    ],
    place: 'P-21',
    weight: 'feature',
    image: 'signal-lamp',
  },
  {
    id: 'diversion-jhs',
    severity: 'info',
    section: 'Diversion',
    headline: 'Two services diverted via Bina to clear the Jhansi approach',
    standfirst:
      'The diversion adds roughly 40 minutes but avoids a queue that had grown to five trains at the outer home signal.',
    body: [
      'Passengers booked to intermediate stations on the original route are being advised at the previous halt.',
    ],
    place: 'JHS',
    weight: 'standard',
  },
  {
    id: 'platform-change-ndls',
    severity: 'info',
    section: 'Platform',
    headline: 'Platform alterations at New Delhi during the evening departures',
    standfirst:
      'Four departures have been re-platformed to balance loading across the concourse.',
    body: [
      'Indicator boards carry the current allocation. Where a change is made inside twenty minutes of departure, staff will announce it on the platform as well as the concourse.',
    ],
    place: 'NDLS',
    weight: 'brief',
  },
  {
    id: 'weather-ghats',
    severity: 'warning',
    section: 'Weather',
    headline: 'Reduced visibility through the Ghats overnight',
    standfirst:
      'Fog patches are expected between 23:00 and 06:00, with visibility falling below the threshold for normal running in places.',
    body: [
      'Where fog signalling is in force, expect speeds to be reduced and additional time to be taken over the affected length.',
    ],
    place: 'IGP–MMR',
    weight: 'brief',
  },
  {
    id: 'cancellation-shuttle',
    severity: 'critical',
    section: 'Cancellation',
    headline: 'Two shuttle services cancelled for stock reasons',
    standfirst:
      'The rake has been withheld for examination after a brake defect was found on arrival.',
    body: [
      'Tickets are being accepted on the next available service. A replacement rake is expected to be available from tomorrow morning.',
    ],
    place: 'BPL',
    weight: 'brief',
  },
  {
    id: 'construction-bza',
    severity: 'works',
    section: 'Construction',
    headline: 'Third-line construction continues south of Vijayawada',
    standfirst:
      'Piling for the new up line is under way alongside the existing formation, with a 30 km/h restriction over the worksite.',
    body: [
      'The restriction applies in both directions and is expected to remain in place for the duration of the current phase.',
    ],
    place: 'BZA',
    weight: 'standard',
    image: 'platform-day',
  },
  {
    id: 'control-note',
    severity: 'info',
    section: 'From control',
    headline: 'How these forecasts are produced',
    standfirst:
      'Every time on this page is generated by the RailSense simulation, not received from a live feed.',
    body: [
      'Positions, delays and predicted arrivals come from one simulated network state shared by every screen in this application. Where a notice quotes a delay, that figure is the same one the live map is drawing at that moment.',
      'Nothing here should be used to plan a real journey.',
    ],
    place: 'RailSense',
    weight: 'standard',
    image: 'control-room',
  },
]

/**
 * Stories generated from the running fleet, so the bulletin's front page
 * reports the network as it actually is right now.
 */
export function liveStories(trains, formatClock) {
  const worst = [...trains].sort((a, b) => b.delayMin - a.delayMin).slice(0, 3)

  return worst
    .filter((train) => train.delayMin > 5)
    .map((train) => ({
      id: `live-${train.number}`,
      severity: train.delayMin > 25 ? 'critical' : 'major',
      section: 'Running late',
      headline: `${train.number} ${train.delayMin} minutes down at ${train.nextStation.code}`,
      standfirst: `${train.name} is running ${train.delayMin} minutes behind its booked time, with a revised arrival into ${train.destination.name} of ${formatClock(train.etaMinutes)}.`,
      body: [
        train.section
          ? `The service is currently between ${train.section.from.code} and ${train.section.to.code}, booked at ${train.section.bookedRunMin} minutes and running at ${train.section.currentRunMin}.`
          : `The service is standing at ${train.atStation?.name ?? train.prevStation.name}.`,
      ],
      place: `${train.origin.code}–${train.destination.code}`,
      weight: 'standard',
      live: true,
    }))
}
