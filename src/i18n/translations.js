/**
 * Landing-page copy. Station and train names stay in English because that is
 * how Indian Railways publishes them on boards and tickets.
 */
export const languages = [
  { code: 'en', label: 'English', shortLabel: 'EN' },
  { code: 'hi', label: 'हिन्दी', shortLabel: 'हिं' },
]

export const defaultLanguage = 'en'

export const translations = {
  en: {
    'brand.tagline': 'Dynamic ETA for coaching trains',

    'common.or': 'or',

    'nav.home': 'Home',
    'nav.liveStatus': 'Live Status',
    'nav.trains': 'Trains',
    'nav.stations': 'Stations',
    'nav.alerts': 'Alerts',
    'nav.about': 'About',
    'nav.openMenu': 'Open navigation menu',
    'nav.closeMenu': 'Close navigation menu',
    'nav.primary': 'Primary',
    'nav.skip': 'Skip to main content',

    'theme.toLight': 'Switch to light theme',
    'theme.toDark': 'Switch to dark theme',
    'language.label': 'Language',

    'hero.eyebrow': 'Real-time railway intelligence',
    'hero.findTitle': 'Find your train',
    'hero.title': 'Know when your train will actually arrive.',
    'hero.subtitle':
      'RailSense predicts arrival times from how your train is running now, what is happening on the line ahead, and how this service usually behaves.',
    'hero.note': 'Covering coaching trains across the Indian Railways network.',

    'nav.simulationActive': 'Simulation active',

    'ask.unknown': 'I did not catch a train or station in that. Try “Where is 12952?” or “Is 12301 delayed?”',
    'ask.noTrain': 'I have no running data for train {train} in this demo network.',
    'ask.noServices': 'No service in the demo fleet runs from {from} to {to}.',
    'ask.noArrivals': 'Nothing further is booked into {station} in this simulation.',
    'ask.noneDelayed': 'Every service in the demo network is running to time.',
    'ask.noSection': 'I have no service running directly between {from} and {to}.',
    'ask.delayedList': '{count} services are running late. {train} is worst, {minutes} minutes behind.',
    'ask.between': '{count} services run from {from} to {to}.',
    'ask.arrivals': '{count} services are due into {station}. Next is {train} at {time}.',
    'ask.section': 'Services are losing about {minutes} minutes between {from} and {to}.',
    'ask.next': '{train} calls next at {station}, estimated {time}.',
    'ask.etaStation': '{train} is estimated into {station} at {time}, booked {booked} — {minutes} minutes late.',
    'ask.etaStation.one': '{train} is estimated into {station} at {time}, booked {booked} — 1 minute late.',
    'ask.etaPassed': '{train} already called at {station}, at {time}.',
    'ask.etaDestination': '{train} is estimated into {station} at {time}, {minutes} minutes behind booked time.',
    'ask.etaDestination.one': '{train} is estimated into {station} at {time}, 1 minute behind booked time.',
    'ask.delay': '{train} is running {minutes} minutes late. It is estimated into {destination} at {time}.',
    'ask.delay.one': '{train} is running 1 minute late. It is estimated into {destination} at {time}.',
    'ask.onTime': '{train} is running to time, estimated into {destination} at {time}.',
    'ask.locateRunning': '{train} is between {from} and {to}, running at {speed} km/h, {minutes} minutes behind. Next stop {next}, estimated {time}.',
    'ask.locateRunning.one': '{train} is between {from} and {to}, running at {speed} km/h, 1 minute behind. Next stop {next}, estimated {time}.',
    'ask.locateStopped': '{train} is standing at {station}, {minutes} minutes behind. It departs for {next} at {time}.',
    'ask.locateStopped.one': '{train} is standing at {station}, 1 minute behind. It departs for {next} at {time}.',

    'ask.connectList': '{count} services are due to call at {station}.',
    'ask.noConnections': 'I have no onward service from {station} that connects with {train}.',
    'ask.connectOk': 'You should make it. {train} is into {station} at {arrival} and {connecting} leaves at {departure} — a {minutes} minute change.',
    'ask.connectRisk': 'That is very tight. {train} arrives {station} at {arrival}, {connecting} leaves at {departure} — only {minutes} minutes.',
    'ask.connectMissed': 'On current running you would miss {connecting} by about {minutes} minutes. {train} is into {station} at {arrival}, after the {departure} departure.',

    'ask.title': 'Ask RailSense',
    'ask.placeholder': 'Ask about a train or station…',
    'ask.listening': 'Listening…',
    'ask.processing': 'Checking the network…',
    'ask.heard': 'Heard',
    'ask.send': 'Ask',
    'ask.mic': 'Ask by voice',
    'ask.micStop': 'Stop listening',
    'ask.micDenied': 'Microphone blocked. Type your question instead.',
    'ask.micUnsupported': 'This browser has no speech recognition. Type your question instead.',
    'ask.micNoSpeech': 'I did not hear anything. Try again, or type your question.',
    'ask.micError': 'The microphone stopped unexpectedly. Try again, or type your question.',
    'ask.retry': 'Try again',
    'ask.viewTrain': 'View train',
    'ask.traceRoute': 'Trace route',
    'ask.showStations': 'Show stations',
    'ask.examples': 'Try asking',
    'ask.simulated': 'Answers come from the demo simulation, not a live feed.',

    'common.simulated': 'Simulated demo data',

    'home.classesEyebrow': 'Service classes',
    'home.classesTitle': 'Start with the kind of train you are looking for.',
    'home.classesCta': 'All trains',

    'cta.eyebrow': 'Dynamic ETA for coaching trains',
    'cta.title': 'A timetable is a plan. RailSense tracks the outcome.',
    'cta.body': 'One simulated network state drives every screen here — the map, the timetable, the station boards and the bulletin. A delay picked up in one is a delay everywhere.',
    'cta.live': 'Open live status',
    'cta.trains': 'Browse trains',
    'cta.note': 'Prototype · simulated data · not affiliated with Indian Railways or CRIS',

    'trains.eyebrow': 'Train discovery',
    'trains.title': 'Every class, and what is running in it.',
    'trains.lead': 'Browse by service class or search by number, name or station. Selecting a service traces it on the live map.',
    'trains.searchPlaceholder': 'Number, name, origin or destination…',
    'trains.searchLabel': 'Search trains',
    'trains.clearSearch': 'Clear search',
    'trains.allClasses': 'All',
    'trains.servicesRunning': 'services running',
    'trains.emptyTitle': 'No services match',
    'trains.emptyBody': 'Try another number, service name or station.',

    'stations.eyebrow': 'Station intelligence',
    'stations.servicesCall': 'services call',
    'stations.connected': 'direct connections',
    'stations.searchPlaceholder': 'Station name or code…',
    'stations.searchLabel': 'Search stations',
    'stations.busiest': 'Busiest',
    'stations.networkTitle': 'What this station connects to',
    'stations.networkLead': 'Each spoke is the immediate previous or next call of a service that stops here. Bearing and distance are taken from the real positions, so the diagram is a schematic of genuine relationships.',
    'stations.atPlatform': 'At platform',
    'stations.arriving': 'Arriving',
    'stations.departed': 'Recently departed',
    'stations.noArrivals': 'Nothing further due here.',
    'stations.noDepartures': 'Nothing has departed yet.',

    'connect.eyebrow': "I'm travelling",
    'connect.title': 'Will I make my connection?',
    'connect.lead': 'Pick the train you are on and the one you need to catch. The arrival side of the sum is the live predicted ETA, so the transfer window narrows on its own as your train loses time.',
    'connect.step1': 'My train',
    'connect.step2': 'I change at',
    'connect.step3': 'Connecting train',
    'connect.choose': 'Choose a service…',
    'connect.chooseFirst': 'Pick your train first',
    'connect.verdictOk': 'You should make {train}. There is a {minutes} minute window between arrival and departure.',
    'connect.verdictRisk': 'Very tight. Only {minutes} minutes to change, against a realistic minimum of about {min}.',
    'connect.verdictMissed': 'You are likely to miss {train} by about {minutes} minutes on current running.',
    'connect.arrives': 'arrives',
    'connect.booked': 'booked',
    'connect.departs': 'departs',
    'connect.altSame': 'Next services to the same destination',
    'connect.altOnward': 'Next usable onward services',
    'connect.wait': 'wait',
    'connect.into': 'into',
    'connect.empty': 'Choose your train and a connecting service to see the prediction.',
    'connect.note': 'Predicted from simulated running data · not a booking guarantee',

    'alerts.eyebrow': 'Operations bulletin',
    'alerts.title': 'What the network is doing, in print.',
    'alerts.lead': 'Congestion, restrictions, engineering work and the services running worst — published as a bulletin rather than a notification feed.',
    'alerts.mastheadKicker': 'RailSense operations bulletin · simulated edition',
    'alerts.mastheadTitle': 'The Section Control',
    'alerts.edition': 'Evening edition',
    'alerts.simulated': 'Demo data',
    'alerts.footerNote': 'Simulated bulletin · not an operational notice',
    'alerts.open': 'Open the bulletin',
    'alerts.openHint': 'Unfolds to a readable spread · turn pages to read on',
    'alerts.prev': 'Previous',
    'alerts.next': 'Next page',
    'alerts.pageOf': 'Page {a} of {b}',
    'alerts.fold': 'Fold it away',

    'search.byRoute': 'Route',
    'search.byTrain': 'Train no.',

    'focus.between': 'Currently between',
    'focus.at': 'Currently at',
    'focus.standing': 'At a stand',
    'focus.ofJourney': 'of the journey run',
    'focus.nextStop': 'Next stop',
    'focus.arrives': 'Arrives',
    'focus.running': 'Running',
    'focus.booked': 'Booked',
    'focus.toBookedTime': 'To booked time',
    'focus.in': 'in',
    'focus.backToNetwork': 'Back to network',
    'focus.viewDetails': 'View full train details',
    'focus.summary': 'Train summary',
    'focus.journey': 'Journey',
    'focus.follow': 'Follow',
    'focus.resetView': 'Reset view',
    'focus.paneInfo': 'Train',
    'focus.paneMap': 'Map',

    'detail.route': 'Route',
    'detail.whyThisEta': 'Why this arrival time',
    'detail.factorsNote': 'Terms in the simulated propagation · not model feature importances',
    'detail.delayProfile': 'Delay along the route',
    'detail.delayProfileLead': 'How far behind the service is expected to be at each call. A bar that shrinks further down the route is time the forecast expects it to recover.',
    'detail.stationTimings': 'Station timings',
    'detail.colStation': 'Station',
    'detail.colBookedArr': 'Booked arr',
    'detail.colPredArr': 'Predicted arr',
    'detail.colBookedDep': 'Booked dep',
    'detail.colPredDep': 'Predicted dep',
    'detail.colVariance': 'Var',
    'detail.performance': 'Running performance',
    'detail.covered': 'Distance run',
    'detail.remaining': 'Remaining',
    'detail.avgSpeed': 'Average speed',
    'detail.bookedCruise': 'Booked, this section',
    'detail.running': 'Running for',
    'detail.progress': 'Journey complete',
    'detail.summary': 'In short',

    'detail.number': 'Train number',
    'detail.name': 'Service',
    'detail.category': 'Class',
    'detail.origin': 'Origin',
    'detail.destination': 'Destination',
    'detail.calls': 'Route',
    'detail.stops': 'booked calls',
    'detail.section': 'Current section',
    'detail.standingAt': 'Standing at',
    'detail.runningTime': 'Section running time',
    'detail.booked': 'booked',
    'detail.actual': 'actual',
    'detail.signal': 'Section signal',
    'detail.speed': 'Current speed',
    'detail.bookedArrival': 'Booked arrival',
    'detail.predictedArrival': 'Predicted arrival',
    'detail.variance': 'Variance',

    'live.searchPlaceholder': 'Train, name or station…',
    'live.searchLabel': 'Search services',
    'live.sort': 'Sort',
    'live.nextCol': 'Next',

    'live.title': 'Live network',
    'live.subtitle': '{count} services running on the trunk corridors, simulated in real time.',
    'live.running': 'Running',
    'live.avgDelay': 'Mean delay',
    'live.avgSpeed': 'Mean speed',
    'live.selectHint': 'Select a service to trace its route.',
    'live.clear': 'Clear selection',

    'net.play': 'Play simulation',
    'net.pause': 'Pause simulation',
    'net.speed': 'Simulation speed',

    'section.activeTrains': 'Active services',
    'section.activeTrainsLead': 'Live running order across the trunk routes. Select a service for its full journey.',
    'section.whyEta': 'Why the forecast changes',
    'section.whyEtaLead': 'A timetable states the plan. These are the things that move the outcome away from it.',
    'section.editorial': 'The physical railway',

    'assistant.open': 'Ask RailSense',
    'assistant.close': 'Close assistant',
    'assistant.prompt': "Where's my train?",

    'instrument.current': 'Current',
    'instrument.next': 'Next',
    'instrument.eta': 'ETA',
    'instrument.demo': 'Demo data',

    'route.legend': 'Search trains between two stations',
    'route.from': 'From station',
    'route.to': 'To station',
    'route.fromPlaceholder': 'Station name or code',
    'route.toPlaceholder': 'Station name or code',
    'route.swap': 'Swap From and To stations',
    'route.submit': 'Find Trains',
    'route.quick': 'Popular routes',
    'route.errorFrom': 'Enter the station you are travelling from.',
    'route.errorTo': 'Enter the station you are travelling to.',
    'route.errorSame': 'From and To stations must be different.',

    'train.legend': 'Search a specific train',
    'train.label': 'Train number or train name',
    'train.placeholder': 'e.g. 12951 or Rajdhani Express',
    'train.submit': 'Search',
    'train.error': 'Enter a train number or train name.',

    'board.title': 'Station departure board',
    'board.description':
      'Check every train leaving a station over the next few hours, with platform and expected departure.',
    'board.label': 'Station name',
    'board.placeholder': 'Station name or code',
    'board.submit': 'Search',
    'board.quick': 'Busy stations',
    'board.error': 'Enter a station to see its departures.',

    'value.eyebrow': 'What RailSense does',
    'value.live.title': 'Live tracking',
    'value.live.body': 'Follow a train between stations instead of guessing where it is.',
    'value.eta.title': 'Dynamic ETA',
    'value.eta.body': 'Arrival times that update as delays and halts build along the route.',
    'value.alerts.title': 'Smart alerts',
    'value.alerts.body': 'A nudge before your station, not a notification after you pass it.',
    'value.reliable.title': 'Reliable information',
    'value.reliable.body': 'Schedules, halts and platforms drawn from published railway data.',

    'popular.title': 'Popular trains',
    'popular.description': 'A few of the trains passengers look up most. Select one to open its journey.',
    'popular.departs': 'Departs',
    'popular.arrives': 'Arrives',
    'popular.duration': 'Duration',
    'popular.runsOn': 'Runs',

    'strip.eyebrow': 'Network status',
    'strip.running': 'Trains running',
    'strip.delayed': 'Delayed',
    'strip.onTime': 'On time',
    'strip.congested': 'Congested sections',
    'strip.updated': 'Predictions updated',
    'strip.justNow': 'Just now',
    'strip.sample': 'sample trains',

    'demo.eyebrow': 'How it works',
    'demo.title': 'How RailSense sees a journey',
    'demo.body':
      'A timetable fixes six times before the train leaves the yard. RailSense keeps revising them, station by station, as the run actually happens.',
    'demo.scheduled': 'Timetable',
    'demo.predicted': 'RailSense',

    'propagation.eyebrow': 'Why forecasts move',
    'propagation.title': 'Every delay starts somewhere.',
    'propagation.body1':
      'A signal held two minutes longer than usual. A platform still occupied at the next junction. On its own, none of it looks like much.',
    'propagation.body2':
      'RailSense follows each of those small frictions forward through the section ahead, so a delay is visible before it reaches your station, not after.',

    'stations.title': 'A station is where journeys intersect.',
    'stations.body':
      'Every arriving and departing service passes through the same handful of platforms. See what is due, and when it is actually expected.',
    'stations.liveDepartures': 'Live departures',
    'stations.time': 'Time',
    'stations.train': 'Train',
    'stations.destination': 'Destination',
    'stations.platform': 'Platform',
    'stations.searchTitle': 'Check another station',

    'alerts.body': 'What is actually happening on the network right now, and which services it touches.',
    'alerts.impact': 'Expected impact',
    'alerts.affected': '{count} of {total} sample trains',
    'alerts.demoNote':
      'Simulated events built from this preview’s three sample trains — not a live railway control-room feed.',
    'alerts.type.congestion': 'Congestion',
    'alerts.type.restriction': 'Speed restriction',
    'alerts.type.delay': 'Departure delay',

    'about.eyebrow': 'About RailSense',
    'about.title': 'A timetable tells you the plan. RailSense estimates the outcome.',
    'about.problemLabel': 'The problem',
    'about.problemBody':
      'A published timetable describes an ideal run. Once a train loses time to a signal, a restriction or a busy junction, the printed arrival stops being useful — and it never says by how much, or whether that time will come back.',
    'about.ideaLabel': 'The idea',
    'about.ideaBody':
      'Instead of asking what the timetable says, RailSense asks what is left of the journey: how the train is running now, what this line usually does next, and where it tends to make time back.',
    'about.signalsLabel': 'The signals',
    'about.signalsBody':
      'Position, current speed, sectional history, live delay, downstream congestion and operational restrictions, combined into one running estimate per station.',
    'about.loopLabel': 'The loop',
    'about.loopObserve': 'Observe',
    'about.loopPredict': 'Predict',
    'about.loopUpdate': 'Update',
    'about.loopAgain': 'Observe again',
    'about.loopBody': 'The estimate is never final. Every few minutes RailSense looks again and revises it.',

    'footer.about': 'About',
    'footer.contact': 'Contact',
    'footer.product': 'Product',
    'footer.company': 'Company',
    'footer.summary':
      'RailSense forecasts expected arrival times for Indian Railways coaching trains, so passengers know when their train will actually reach them.',
    'footer.dataTitle': 'Data and updates',
    'footer.dataBody':
      'Built on published Indian Railways timetable data. Live positions and dynamic ETA are in development and are not connected yet.',
    'footer.rights': '© {year} RailSense',
    'footer.disclaimer': 'An independent project. Not affiliated with Indian Railways or IRCTC.',

    'unit.min': 'min',
    'unit.km': 'km',
    'unit.kmph': 'km/h',

    'status.onTime': 'On time',
    'status.completed': 'Passed',
    'status.current': 'Here now',
    'status.upcoming': 'Ahead',

    'results.back': 'Back to search',
    'results.forecast': 'RailSense ETA',
    'results.routeTitle': 'Trains from {from} to {to}',
    'results.routeSubtitle': '{count} train(s) in the sample data run this route.',
    'results.trainTitle': 'Results for “{query}”',
    'results.trainSubtitle': '{count} matching train(s) in the sample data.',
    'results.stationTitle': 'Trains departing {station}',
    'results.stationSubtitle': '{count} train(s) in the sample data call here.',
    'results.emptyTitle': 'No trains in the sample data match',
    'results.emptyBody':
      'This preview carries three sample trains: 12951 Mumbai Central – New Delhi, 12301 Howrah – New Delhi and 12002 Rani Kamlapati – New Delhi.',
    'results.emptyAction': 'Try another search',
    'results.sampleNote':
      'Sample timetable data. Live running positions are not connected in this preview.',
    'results.timetableLabel': 'Timetable',
    'results.colTrain': 'Train',
    'results.colRoute': 'Route',
    'results.colForecast': 'Forecast',

    'journey.back': 'Back',
    'journey.running': 'Running',
    'journey.timelineTitle': 'Journey',
    'journey.timelineHint': 'Select the line between two stations to reveal the stops in between.',
    'journey.timelineRegion': 'Journey timeline, scrollable horizontally',
    'journey.markerLabel': 'Current position of train {train}',
    'journey.showStops': 'Show the {count} stations between {from} and {to}',
    'journey.hideStops': 'Hide the {count} stations between {from} and {to}',
    'journey.missingTitle': 'No journey data for this train',
    'journey.missingBody': 'This preview only carries journey data for the sample trains.',

    'eta.title': 'Arrival at {station}',
    'eta.scheduled': 'Scheduled ETA',
    'eta.railSense': 'RailSense ETA',
    'eta.predictedDelay': 'Predicted delay',

    'why.title': 'Why this ETA?',
    'why.currentDelay': 'Current delay now',
    'why.predictedAt': 'Predicted delay at {station}',
    'why.recovery': 'Expected recovery',
    'why.congestion': 'Downstream congestion',
    'why.restriction': 'Temporary speed restriction',
    'why.runningSpeed': 'Current running speed',
    'why.weather': 'Weather conditions',
    'why.history': 'Historical running pattern',
    'why.disclaimer':
      'Prototype prediction inputs. These figures are illustrative placeholders, not live railway data or the output of a trained model.',

    'metrics.title': 'Train performance',
    'metrics.currentSpeed': 'Current speed',
    'metrics.averageSpeed': 'Average speed',
    'metrics.currentDelay': 'Current delay',
    'metrics.distanceCovered': 'Distance covered',
    'metrics.distanceRemaining': 'Distance remaining',
    'metrics.halted': 'Halted at {station}',

    'upcoming.title': 'Upcoming stations',
    'upcoming.count': '{count} remaining',
    'upcoming.caption': 'Scheduled time against the RailSense forecast for each remaining station.',
    'upcoming.station': 'Station',
    'upcoming.scheduled': 'Scheduled',
    'upcoming.railSense': 'RailSense ETA',
    'upcoming.difference': 'Difference',
    'upcoming.status': 'Status',
    'upcoming.trend': 'change from previous station:',

    // Inline, lowercase forms of the "Why this ETA?" factor labels, for use
    // inside a sentence in the passenger summary.
    'cause.congestion': 'congestion on the line ahead',
    'cause.restriction': 'a temporary speed restriction',
    'cause.runningSpeed': 'its current running speed',
    'cause.weather': 'the weather ahead',
    'cause.history': 'how this service usually runs',
    'cause.recovery': 'the running margin ahead',



    // ----- Singular forms, picked by `t()` when {minutes} is exactly 1 -----
    'why.explain.atNow.one': 'The train is standing at {station}, {minutes} minute down.',
    'why.explain.betweenNow.one': 'The train is {minutes} minute down between {from} and {to}.',
    'why.explain.loss.one':
      'Ahead of it, {cause} is expected to add about {minutes} minute before {destination}.',
    'why.explain.gain.one':
      'Around {minutes} minute should come back on the {section} section, where the timetable leaves some margin.',
    'why.explain.resultLate.one':
      'That puts it into {destination} at {arrival}, about {minutes} minute late.',
    'why.explain.resultEarly.one':
      'That puts it into {destination} at {arrival}, roughly {minutes} minute ahead of the timetable.',
    'confidence.reason.driver.one':
      'Most of the uncertainty is {cause}, which could account for around {minutes} minute either way before arrival.',
    'confidence.reason.recovery.one':
      'The forecast leans on making up about {minutes} minute on the {section} section, which needs a clear path to happen.',
    'recovery.explain.one':
      'The train is expected to make up about {minutes} minute on the {section} section, where there is enough running margin in the timetable.',
    'confidence.margin.one':
      'RailSense allows about {minutes} minute either side of this arrival when judging whether a connection is safe.',
    'connection.explainHeld.one':
      'The forecast has not eaten into the change-over time: {minutes} minute still stand between the two trains.',
    'connection.body.safe.one':
      'Train {train} leaves {minutes} minute after RailSense expects you to arrive — comfortably more than the {transfer} minutes it takes to change.',
    'connection.body.at-risk.one':
      'Train {train} leaves {minutes} minute after RailSense expects you to arrive. That covers the {transfer} minutes needed to change, but only just.',
    'connection.body.high-risk.one':
      'Train {train} leaves only {minutes} minute after RailSense expects you to arrive — less than the {transfer} minutes it takes to change trains.',
    'connection.body.missed.one':
      'Train {train} is scheduled to leave {minutes} minute before RailSense expects you to arrive.',
    'summary.atLate.one': 'Your train is standing at {station}, {minutes} minute late.',
    'summary.betweenLate.one':
      'Your train is between {from} and {to}, running {minutes} minute late.',
    'summary.forecastWorse.one':
      'RailSense expects the delay to grow to about {minutes} minute by {destination} — mainly {cause} — putting arrival at {arrival}.',
    'summary.forecastBetter.one':
      'RailSense expects it to make up around {recovery} minutes on the way, arriving {destination} at {arrival}, about {minutes} minute late.',
    'summary.connection.safe.one':
      'Your {departure} connection on train {train} should be comfortable, with about {minutes} minute to change.',
    'summary.connection.at-risk.one':
      'That leaves only about {minutes} minute for your {departure} connection on train {train}, so it is worth having a fallback.',
    'summary.connection.high-risk.one':
      'Your {departure} connection on train {train} is at high risk — roughly {minutes} minute is not enough to change trains.',
    'voice.answerAt.one':
      'Train {train} is standing at {station}, {minutes} minute late. RailSense predicts arrival at {destination} at {arrival}.',
    'voice.answerBetween.one':
      'Train {train} is between {from} and {to}, running {minutes} minute late. RailSense predicts arrival at {destination} at {arrival}.',
    'voice.answerEta.one':
      'RailSense predicts train {train} will reach {station} at {time}. It is scheduled for {scheduled}, so about {minutes} minute late.',
    'voice.answerEtaPassed.one':
      'Train {train} has already passed {station}. It called there at {time}, {minutes} minute late.',
    'voice.answerEtaDestination.one':
      'RailSense predicts train {train} will reach {station} at {time}, about {minutes} minute late.',
    'voice.answerDelay.one':
      'Train {train} is running {minutes} minute late right now. RailSense predicts {predicted} minutes late on arrival at {destination}.',
    // ----- Demo simulation (§3) -----
    'sim.title': 'Demo simulation',
    'sim.start': 'Start',
    'sim.pause': 'Pause',
    'sim.reset': 'Reset',
    'sim.speedLabel': 'Simulation speed',
    'sim.idle': 'Play to watch the forecast change as the train runs.',
    'sim.elapsed': '{clock} of running simulated',
    'sim.arrived': 'The train has reached its destination.',

    // ----- Why this ETA, generated from the live forecast (§7) -----
    'why.explain.atNow': 'The train is standing at {station}, {minutes} minutes down.',
    'why.explain.betweenNow': 'The train is {minutes} minutes down between {from} and {to}.',
    'why.explain.loss': 'Ahead of it, {cause} is expected to add about {minutes} minutes before {destination}.',
    'why.explain.gain': 'Around {minutes} minutes should come back on the {section} section, where the timetable leaves some margin.',
    'why.explain.resultLate': 'That puts it into {destination} at {arrival}, about {minutes} minutes late.',
    'why.explain.resultEarly': 'That puts it into {destination} at {arrival}, roughly {minutes} minutes ahead of the timetable.',
    'why.explain.resultOnTime': 'That puts it into {destination} at {arrival}, back on time.',

    // ----- Confidence reasons, derived from the prediction state (§13) -----
    'confidence.reason.stable':
      'Little is still in play on the run ahead and conditions are steady, so this arrival should hold.',
    'confidence.reason.driver':
      'Most of the uncertainty is {cause}, which could account for around {minutes} minutes either way before arrival.',
    'confidence.reason.recovery':
      'The forecast leans on making up about {minutes} minutes on the {section} section, which needs a clear path to happen.',
    'confidence.reason.volatile':
      'Conditions on the sections ahead are changing quickly at the moment, so this arrival could still move either way.',
    // ----- Data trust (§29) -----
    'trust.confirmed': 'Confirmed',
    'trust.predicted': 'Predicted',
    'trust.simulated': 'Simulated',
    'trust.unavailable': 'Not available',

    // ----- Geographic map -----
    'map.title': 'Where the train is',
    'map.legendCovered': 'Route covered',
    'map.legendAhead': 'Route ahead (forecast)',
    'map.loading': 'Loading map…',
    'map.disclaimer':
      'Station positions are approximate and the train position is simulated for this prototype.',
    'map.region': 'Map of the route of train {train}',
    'map.zoomIn': 'Zoom in',
    'map.zoomOut': 'Zoom out',
    'map.locateTrain': 'Centre on the train',
    'map.fitRoute': 'Fit the whole route',
    'map.actual': 'Actual',
    'map.observedDelay': 'Delay',
    'map.predictedDelay': 'Predicted delay',
    'map.location': 'Current location',
    'map.standingAt': 'Standing at {station}',
    'map.betweenStations': 'Between {from} and {to}',

    // ----- Delay recovery (§18) -----
    'recovery.title': 'Delay recovery',
    'recovery.currentDelay': 'Delay now',
    'recovery.additional': 'Expected additional delay',
    'recovery.expected': 'Expected recovery',
    'recovery.atDestination': 'Predicted delay at {station}',
    'recovery.explain':
      'The train is expected to make up about {minutes} minutes on the {section} section, where there is enough running margin in the timetable.',
    'recovery.none':
      'No recovery is expected on the remaining sections — the timetable leaves little running margin ahead.',
    'recovery.section12951': 'Bharatpur–Mathura',
    'recovery.section12301': 'Kanpur–Tundla main line',
    'recovery.section12002': 'Gwalior–Agra',

    // ----- Confidence (§19) -----
    'confidence.title': 'ETA confidence',
    'confidence.high': 'High confidence',
    'confidence.medium': 'Medium confidence',
    'confidence.low': 'Low confidence',
    'confidence.margin':
      'RailSense allows about {minutes} minutes either side of this arrival when judging whether a connection is safe.',

    // ----- Weather (§24) -----
    'weather.title': 'Weather affecting this run',
    'weather.body': '{condition} is expected near {station} on the section ahead.',
    'weather.impact': 'Estimated impact on arrival',
    'weather.rain': 'Rain',

    // ----- Historical reliability (§25) -----
    'history.title': 'How this train usually runs',
    'history.typical': 'Typical arrival delay',
    'history.variation': 'Typical variation',
    'history.lastRuns': 'Arrival delay on the last {count} runs, most recent first',

    // ----- Connection protection (§20, §21) -----
    'connection.title': 'Connection protection',
    'connection.intro':
      'Changing to another train? Enter its number and RailSense will check it against the predicted arrival, not the scheduled one.',
    'connection.label': 'Connecting train number',
    'connection.placeholder': 'e.g. 12045',
    'connection.submit': 'Check connection',
    'connection.sampleHint': 'Onward departures in this prototype:',
    'connection.unavailable':
      'We hold no onward departure for train {train} at this station, so we cannot assess that connection.',
    'connection.whyTitle': 'Why',
    'connection.predictedArrival': 'Predicted arrival {station}',
    'connection.departure': 'Connection departs',
    'connection.buffer': 'Predicted buffer',
    'connection.scheduledBuffer': 'Scheduled buffer',
    'connection.transfer': 'Time to change trains',
    'connection.confidence': 'ETA confidence',
    'connection.explainLost':
      'The timetable gives you {scheduled} minutes to change, but the forecast has already taken {lost} of them, leaving {buffer}.',
    'connection.explainHeld':
      'The forecast has not eaten into the change-over time: {minutes} minutes still stand between the two trains.',
    'connection.explainConfidence.high':
      'Conditions are stable, so RailSense only allows {margin} minutes of slack around this arrival.',
    'connection.explainConfidence.medium':
      'Conditions ahead may still change, so RailSense allows {margin} minutes of slack around this arrival.',
    'connection.explainConfidence.low':
      'Conditions ahead are unsettled, so RailSense allows {margin} minutes of slack around this arrival.',
    'connection.onward': '{name} · towards {to}',
    'connection.verdict.safe': 'Connection looks safe',
    'connection.verdict.at-risk': 'Connection at risk',
    'connection.verdict.high-risk': 'High risk of missing this connection',
    'connection.verdict.missed': 'This connection will have left',
    'connection.body.safe':
      'Train {train} leaves {minutes} minutes after RailSense expects you to arrive — comfortably more than the {transfer} minutes it takes to change.',
    'connection.body.at-risk':
      'Train {train} leaves {minutes} minutes after RailSense expects you to arrive. That covers the {transfer} minutes needed to change, but only just.',
    'connection.body.high-risk':
      'Train {train} leaves only {minutes} minutes after RailSense expects you to arrive — less than the {transfer} minutes it takes to change trains.',
    'connection.body.missed':
      'Train {train} is scheduled to leave {minutes} minutes before RailSense expects you to arrive.',

    // ----- What this means for me (§22) -----
    'summary.title': 'What this means for you',
    'summary.atLate': 'Your train is standing at {station}, {minutes} minutes late.',
    'summary.atOnTime': 'Your train is standing at {station}, on time.',
    'summary.betweenLate': 'Your train is between {from} and {to}, running {minutes} minutes late.',
    'summary.betweenOnTime': 'Your train is between {from} and {to}, running on time.',
    'summary.forecastWorse':
      'RailSense expects the delay to grow to about {minutes} minutes by {destination} — mainly {cause} — putting arrival at {arrival}.',
    'summary.forecastBetter':
      'RailSense expects it to make up around {recovery} minutes on the way, arriving {destination} at {arrival}, about {minutes} minutes late.',
    'summary.forecastSteady':
      'RailSense expects that to hold to {destination}, putting arrival at {arrival}.',
    'summary.connection.safe':
      'Your {departure} connection on train {train} should be comfortable, with about {minutes} minutes to change.',
    'summary.connection.at-risk':
      'That leaves only about {minutes} minutes for your {departure} connection on train {train}, so it is worth having a fallback.',
    'summary.connection.high-risk':
      'Your {departure} connection on train {train} is at high risk — roughly {minutes} minutes is not enough to change trains.',
    'summary.connection.missed':
      'Train {train} at {departure} will already have left, so you will need a later connection.',

    // ----- Voice (§6) -----
    'voice.title': "Where's my train?",
    'voice.hint': 'Tap the microphone and ask about your train.',
    'voice.unsupportedHint':
      'Voice search needs a browser with speech recognition, such as Chrome. Use the search above instead.',
    'voice.tapToSpeak': 'Tap to speak',
    'voice.stop': 'Stop listening',
    'voice.listening': 'Listening…',
    'voice.thinking': 'Working that out…',
    'voice.idle': 'Ask about any train in this preview.',
    'voice.youSaid': 'You said',
    'voice.noSpeechOutput': 'Your browser cannot read this answer aloud, so it is shown here instead.',
    'voice.fallback': 'You can still search by train number or route using the form above.',
    'voice.examples':
      'Try: “Where is train 12951?” · “When will my train reach Kota?” · “How late is 12301?”',
    'voice.errorNoSpeech': "We didn't catch that.",
    'voice.errorDenied': 'Microphone access was declined.',
    'voice.errorGeneric': 'Voice search could not run just now.',
    'voice.errorUnsupported': 'This browser does not support voice search.',
    'voice.answerUnknown':
      "I can tell you where a train is, when it reaches a station, or how late it is running. Try asking where train 12951 is.",
    'voice.answerNoJourney':
      'This preview has no journey data for train {train}. It carries 12951, 12301 and 12002.',
    'voice.answerNoTrain':
      'Which train? Say, for example, where is train 12951.',
    'voice.answerAt':
      'Train {train} is standing at {station}, {minutes} minutes late. RailSense predicts arrival at {destination} at {arrival}.',
    'voice.answerBetween':
      'Train {train} is between {from} and {to}, running {minutes} minutes late. RailSense predicts arrival at {destination} at {arrival}.',
    'voice.answerEta':
      'RailSense predicts train {train} will reach {station} at {time}. It is scheduled for {scheduled}, so about {minutes} minutes late.',
    'voice.answerEtaPassed':
      'Train {train} has already passed {station}. It called there at {time}, {minutes} minutes late.',
    'voice.answerEtaDestination':
      'RailSense predicts train {train} will reach {station} at {time}, about {minutes} minutes late.',
    'voice.answerDelay':
      'Train {train} is running {minutes} minutes late right now. RailSense predicts {predicted} minutes late on arrival at {destination}.',
  },

  hi: {
    'brand.tagline': 'कोचिंग ट्रेनों के लिए डायनामिक ETA',

    'common.or': 'या',

    'nav.home': 'होम',
    'nav.liveStatus': 'लाइव स्टेटस',
    'nav.trains': 'ट्रेनें',
    'nav.stations': 'स्टेशन',
    'nav.alerts': 'अलर्ट',
    'nav.about': 'परिचय',
    'nav.openMenu': 'मेन्यू खोलें',
    'nav.closeMenu': 'मेन्यू बंद करें',
    'nav.primary': 'मुख्य',
    'nav.skip': 'मुख्य सामग्री पर जाएँ',

    'theme.toLight': 'लाइट थीम पर जाएँ',
    'theme.toDark': 'डार्क थीम पर जाएँ',
    'language.label': 'भाषा',

    'hero.eyebrow': 'रीयल-टाइम रेलवे इंटेलिजेंस',
    'hero.findTitle': 'अपनी ट्रेन खोजें',
    'hero.title': 'जानिए आपकी ट्रेन असल में कब पहुँचेगी।',
    'hero.subtitle':
      'RailSense आपकी ट्रेन की मौजूदा चाल, आगे की लाइन की स्थिति और इस सेवा के सामान्य व्यवहार से आगमन का समय बताता है।',
    'hero.note': 'भारतीय रेल नेटवर्क की कोचिंग ट्रेनों के लिए।',

    'nav.simulationActive': 'सिमुलेशन सक्रिय',

    'ask.unknown': 'इसमें कोई ट्रेन या स्टेशन नहीं मिला। पूछिए: “12952 कहाँ है?”',
    'ask.noTrain': 'इस डेमो नेटवर्क में ट्रेन {train} का डेटा नहीं है।',
    'ask.noServices': '{from} से {to} के लिए कोई सेवा नहीं है।',
    'ask.noArrivals': '{station} के लिए आगे कोई आगमन नहीं है।',
    'ask.noneDelayed': 'सभी सेवाएँ समय पर चल रही हैं।',
    'ask.noSection': '{from} और {to} के बीच कोई सीधी सेवा नहीं है।',
    'ask.delayedList': '{count} सेवाएँ लेट हैं। {train} सबसे अधिक, {minutes} मिनट।',
    'ask.between': '{from} से {to} के लिए {count} सेवाएँ हैं।',
    'ask.arrivals': '{station} पर {count} सेवाएँ आने वाली हैं। अगली {train}, {time}।',
    'ask.section': '{from} और {to} के बीच लगभग {minutes} मिनट का नुकसान हो रहा है।',
    'ask.next': '{train} का अगला ठहराव {station}, अनुमानित {time}।',
    'ask.etaStation': '{train} {station} पर {time} पर पहुँचेगी, निर्धारित {booked} — {minutes} मिनट लेट।',
    'ask.etaPassed': '{train} {station} से {time} पर गुजर चुकी है।',
    'ask.etaDestination': '{train} {station} पर {time} पर पहुँचेगी, {minutes} मिनट लेट।',
    'ask.delay': '{train} {minutes} मिनट लेट चल रही है। {destination} पर {time} पर पहुँचने का अनुमान है।',
    'ask.onTime': '{train} समय पर है, {destination} पर {time} पर पहुँचेगी।',
    'ask.locateRunning': '{train} {from} और {to} के बीच {speed} किमी/घंटा से चल रही है, {minutes} मिनट लेट। अगला ठहराव {next}, {time}।',
    'ask.locateStopped': '{train} {station} पर खड़ी है, {minutes} मिनट लेट। {next} के लिए {time} पर रवाना होगी।',

    'ask.connectList': '{station} पर {count} सेवाएँ आने वाली हैं।',
    'ask.noConnections': '{station} से {train} के लिए कोई आगे की सेवा नहीं है।',
    'ask.connectOk': 'आप पकड़ लेंगे। {train} {station} पर {arrival} पर पहुँचती है और {connecting} {departure} पर चलती है — {minutes} मिनट।',
    'ask.connectRisk': 'बहुत कम समय। {train} {arrival} पर पहुँचती है, {connecting} {departure} पर चलती है — केवल {minutes} मिनट।',
    'ask.connectMissed': 'मौजूदा चाल पर आप {connecting} को लगभग {minutes} मिनट से चूक जाएँगे।',

    'ask.title': 'RailSense से पूछें',
    'ask.placeholder': 'ट्रेन या स्टेशन के बारे में पूछें…',
    'ask.listening': 'सुन रहा है…',
    'ask.processing': 'नेटवर्क जाँच रहा है…',
    'ask.heard': 'सुना',
    'ask.send': 'पूछें',
    'ask.mic': 'बोलकर पूछें',
    'ask.micStop': 'सुनना बंद करें',
    'ask.micDenied': 'माइक ब्लॉक है। कृपया टाइप करें।',
    'ask.micUnsupported': 'इस ब्राउज़र में वॉयस सपोर्ट नहीं है। कृपया टाइप करें।',
    'ask.micNoSpeech': 'कुछ सुनाई नहीं दिया। फिर से प्रयास करें।',
    'ask.micError': 'माइक बंद हो गया। फिर से प्रयास करें।',
    'ask.retry': 'फिर से',
    'ask.viewTrain': 'ट्रेन देखें',
    'ask.traceRoute': 'मार्ग देखें',
    'ask.showStations': 'स्टेशन देखें',
    'ask.examples': 'ये पूछकर देखें',
    'ask.simulated': 'उत्तर डेमो सिमुलेशन से आते हैं।',

    'common.simulated': 'सिमुलेटेड डेमो डेटा',

    'home.classesEyebrow': 'सेवा श्रेणियाँ',
    'home.classesTitle': 'पहले तय करें कि आप किस तरह की ट्रेन खोज रहे हैं।',
    'home.classesCta': 'सभी ट्रेनें',

    'cta.eyebrow': 'कोचिंग ट्रेनों के लिए डायनेमिक ETA',
    'cta.title': 'समय-सारणी एक योजना है। RailSense परिणाम पर नज़र रखता है।',
    'cta.body': 'एक ही सिमुलेटेड नेटवर्क स्थिति हर स्क्रीन को चलाती है — मानचित्र, समय-सारणी, स्टेशन बोर्ड और बुलेटिन।',
    'cta.live': 'लाइव स्टेटस खोलें',
    'cta.trains': 'ट्रेनें देखें',
    'cta.note': 'प्रोटोटाइप · सिमुलेटेड डेटा · भारतीय रेल से संबद्ध नहीं',

    'trains.eyebrow': 'ट्रेन खोज',
    'trains.title': 'हर श्रेणी, और उसमें जो चल रहा है।',
    'trains.lead': 'श्रेणी से ब्राउज़ करें या नंबर, नाम या स्टेशन से खोजें।',
    'trains.searchPlaceholder': 'नंबर, नाम या स्टेशन…',
    'trains.searchLabel': 'ट्रेन खोजें',
    'trains.clearSearch': 'खोज हटाएँ',
    'trains.allClasses': 'सभी',
    'trains.servicesRunning': 'सेवाएँ चल रही हैं',
    'trains.emptyTitle': 'कोई सेवा नहीं मिली',
    'trains.emptyBody': 'कोई दूसरा नंबर, नाम या स्टेशन आज़माएँ।',

    'stations.eyebrow': 'स्टेशन इंटेलिजेंस',
    'stations.servicesCall': 'सेवाएँ रुकती हैं',
    'stations.connected': 'सीधे संपर्क',
    'stations.searchPlaceholder': 'स्टेशन नाम या कोड…',
    'stations.searchLabel': 'स्टेशन खोजें',
    'stations.busiest': 'व्यस्ततम',
    'stations.networkTitle': 'यह स्टेशन किनसे जुड़ा है',
    'stations.networkLead': 'हर रेखा यहाँ रुकने वाली किसी सेवा का अगला या पिछला ठहराव है।',
    'stations.atPlatform': 'प्लेटफ़ॉर्म पर',
    'stations.arriving': 'आ रही हैं',
    'stations.departed': 'हाल में रवाना',
    'stations.noArrivals': 'आगे कुछ नहीं है।',
    'stations.noDepartures': 'अभी कोई रवाना नहीं हुई।',

    'connect.eyebrow': 'मैं यात्रा में हूँ',
    'connect.title': 'क्या मैं कनेक्शन पकड़ पाऊँगा?',
    'connect.lead': 'अपनी ट्रेन और आगे की ट्रेन चुनें। आगमन का समय लाइव पूर्वानुमान से आता है।',
    'connect.step1': 'मेरी ट्रेन',
    'connect.step2': 'बदलना है',
    'connect.step3': 'आगे की ट्रेन',
    'connect.choose': 'सेवा चुनें…',
    'connect.chooseFirst': 'पहले अपनी ट्रेन चुनें',
    'connect.verdictOk': 'आप {train} पकड़ लेंगे। {minutes} मिनट का अंतराल है।',
    'connect.verdictRisk': 'बहुत कम समय। केवल {minutes} मिनट, जबकि कम से कम {min} चाहिए।',
    'connect.verdictMissed': 'आप {train} को लगभग {minutes} मिनट से चूक सकते हैं।',
    'connect.arrives': 'पहुँचती है',
    'connect.booked': 'निर्धारित',
    'connect.departs': 'चलती है',
    'connect.altSame': 'उसी गंतव्य की अगली सेवाएँ',
    'connect.altOnward': 'आगे की उपयोगी सेवाएँ',
    'connect.wait': 'प्रतीक्षा',
    'connect.into': 'तक',
    'connect.empty': 'पूर्वानुमान देखने के लिए दोनों ट्रेनें चुनें।',
    'connect.note': 'सिमुलेटेड डेटा से पूर्वानुमान · गारंटी नहीं',

    'alerts.eyebrow': 'संचालन बुलेटिन',
    'alerts.title': 'नेटवर्क की स्थिति, छपी हुई।',
    'alerts.lead': 'भीड़, गति प्रतिबंध, इंजीनियरिंग कार्य और सबसे अधिक लेट सेवाएँ।',
    'alerts.mastheadKicker': 'RailSense संचालन बुलेटिन · सिमुलेटेड',
    'alerts.mastheadTitle': 'द सेक्शन कंट्रोल',
    'alerts.edition': 'सायं संस्करण',
    'alerts.simulated': 'डेमो डेटा',
    'alerts.footerNote': 'सिमुलेटेड बुलेटिन · आधिकारिक सूचना नहीं',
    'alerts.open': 'बुलेटिन खोलें',
    'alerts.openHint': 'खुलकर पढ़ने योग्य होता है · पन्ने पलटें',
    'alerts.prev': 'पिछला',
    'alerts.next': 'अगला पन्ना',
    'alerts.pageOf': 'पन्ना {a} / {b}',
    'alerts.fold': 'बंद करें',

    'search.byRoute': 'मार्ग',
    'search.byTrain': 'ट्रेन नं.',

    'focus.between': 'इस समय बीच में',
    'focus.at': 'इस समय',
    'focus.standing': 'खड़ी है',
    'focus.ofJourney': 'यात्रा पूरी',
    'focus.nextStop': 'अगला ठहराव',
    'focus.arrives': 'पहुँचेगी',
    'focus.running': 'स्थिति',
    'focus.booked': 'निर्धारित',
    'focus.toBookedTime': 'निर्धारित समय पर',
    'focus.in': 'में',
    'focus.backToNetwork': 'नेटवर्क पर वापस',
    'focus.viewDetails': 'पूरा ट्रेन विवरण देखें',
    'focus.summary': 'ट्रेन सारांश',
    'focus.journey': 'यात्रा',
    'focus.follow': 'पीछा करें',
    'focus.resetView': 'व्यू रीसेट',
    'focus.paneInfo': 'ट्रेन',
    'focus.paneMap': 'मानचित्र',

    'detail.route': 'मार्ग',
    'detail.whyThisEta': 'यह आगमन समय क्यों',
    'detail.factorsNote': 'सिमुलेटेड गणना के घटक',
    'detail.delayProfile': 'मार्ग पर विलंब',
    'detail.delayProfileLead': 'हर ठहराव पर अनुमानित विलंब। घटती बार का अर्थ है समय की भरपाई।',
    'detail.stationTimings': 'स्टेशन समय',
    'detail.colStation': 'स्टेशन',
    'detail.colBookedArr': 'निर्धारित आगमन',
    'detail.colPredArr': 'अनुमानित आगमन',
    'detail.colBookedDep': 'निर्धारित प्रस्थान',
    'detail.colPredDep': 'अनुमानित प्रस्थान',
    'detail.colVariance': 'अंतर',
    'detail.performance': 'संचालन प्रदर्शन',
    'detail.covered': 'तय दूरी',
    'detail.remaining': 'शेष',
    'detail.avgSpeed': 'औसत गति',
    'detail.bookedCruise': 'निर्धारित, यह खंड',
    'detail.running': 'चल रही है',
    'detail.progress': 'यात्रा पूर्ण',
    'detail.summary': 'संक्षेप में',

    'detail.number': 'ट्रेन नंबर',
    'detail.name': 'सेवा',
    'detail.category': 'श्रेणी',
    'detail.origin': 'प्रारंभ',
    'detail.destination': 'गंतव्य',
    'detail.calls': 'मार्ग',
    'detail.stops': 'ठहराव',
    'detail.section': 'वर्तमान खंड',
    'detail.standingAt': 'खड़ी है',
    'detail.runningTime': 'खंड समय',
    'detail.booked': 'निर्धारित',
    'detail.actual': 'वास्तविक',
    'detail.signal': 'खंड सिग्नल',
    'detail.speed': 'वर्तमान गति',
    'detail.bookedArrival': 'निर्धारित आगमन',
    'detail.predictedArrival': 'अनुमानित आगमन',
    'detail.variance': 'अंतर',

    'live.searchPlaceholder': 'ट्रेन, नाम या स्टेशन…',
    'live.searchLabel': 'सेवाएँ खोजें',
    'live.sort': 'क्रम',
    'live.nextCol': 'अगला',

    'live.title': 'लाइव नेटवर्क',
    'live.subtitle': 'मुख्य गलियारों पर {count} सेवाएँ, रीयल-टाइम सिमुलेशन में।',
    'live.running': 'चल रहीं',
    'live.avgDelay': 'औसत विलंब',
    'live.avgSpeed': 'औसत गति',
    'live.selectHint': 'मार्ग देखने के लिए कोई सेवा चुनें।',
    'live.clear': 'चयन हटाएँ',

    'net.play': 'सिमुलेशन चलाएँ',
    'net.pause': 'सिमुलेशन रोकें',
    'net.speed': 'सिमुलेशन गति',

    'section.activeTrains': 'सक्रिय सेवाएँ',
    'section.activeTrainsLead': 'मुख्य मार्गों पर चल रही सेवाएँ। पूरी यात्रा देखने के लिए चुनें।',
    'section.whyEta': 'पूर्वानुमान क्यों बदलता है',
    'section.whyEtaLead': 'समय-सारणी योजना बताती है। ये वे कारण हैं जो परिणाम बदल देते हैं।',
    'section.editorial': 'वास्तविक रेलवे',

    'assistant.open': 'RailSense से पूछें',
    'assistant.close': 'सहायक बंद करें',
    'assistant.prompt': 'मेरी ट्रेन कहाँ है?',

    'instrument.current': 'अभी',
    'instrument.next': 'अगला',
    'instrument.eta': 'ETA',
    'instrument.demo': 'डेमो डेटा',

    'route.legend': 'दो स्टेशनों के बीच ट्रेनें खोजें',
    'route.from': 'कहाँ से',
    'route.to': 'कहाँ तक',
    'route.fromPlaceholder': 'स्टेशन नाम या कोड',
    'route.toPlaceholder': 'स्टेशन नाम या कोड',
    'route.swap': 'दोनों स्टेशन आपस में बदलें',
    'route.submit': 'ट्रेनें खोजें',
    'route.quick': 'लोकप्रिय रूट',
    'route.errorFrom': 'प्रस्थान स्टेशन दर्ज करें।',
    'route.errorTo': 'गंतव्य स्टेशन दर्ज करें।',
    'route.errorSame': 'दोनों स्टेशन अलग-अलग होने चाहिए।',

    'train.legend': 'कोई विशेष ट्रेन खोजें',
    'train.label': 'ट्रेन नंबर या ट्रेन का नाम',
    'train.placeholder': 'जैसे 12951 या राजधानी एक्सप्रेस',
    'train.submit': 'खोजें',
    'train.error': 'ट्रेन नंबर या नाम दर्ज करें।',

    'board.title': 'स्टेशन प्रस्थान बोर्ड',
    'board.description':
      'किसी स्टेशन से अगले कुछ घंटों में जाने वाली सभी ट्रेनें, प्लेटफ़ॉर्म और संभावित प्रस्थान समय के साथ देखें।',
    'board.label': 'स्टेशन का नाम',
    'board.placeholder': 'स्टेशन नाम या कोड',
    'board.submit': 'खोजें',
    'board.quick': 'व्यस्त स्टेशन',
    'board.error': 'प्रस्थान देखने के लिए स्टेशन दर्ज करें।',

    'value.eyebrow': 'RailSense क्या करता है',
    'value.live.title': 'लाइव ट्रैकिंग',
    'value.live.body': 'अंदाज़ा लगाने के बजाय ट्रेन को स्टेशनों के बीच वास्तव में देखें।',
    'value.eta.title': 'डायनामिक ETA',
    'value.eta.body': 'रास्ते में देरी और ठहराव के साथ अपडेट होता आगमन समय।',
    'value.alerts.title': 'स्मार्ट अलर्ट',
    'value.alerts.body': 'स्टेशन आने से पहले सूचना, गुज़र जाने के बाद नहीं।',
    'value.reliable.title': 'भरोसेमंद जानकारी',
    'value.reliable.body': 'प्रकाशित रेलवे डेटा से लिया गया समय, ठहराव और प्लेटफ़ॉर्म।',

    'popular.title': 'लोकप्रिय ट्रेनें',
    'popular.description': 'सबसे अधिक खोजी जाने वाली कुछ ट्रेनें। यात्रा देखने के लिए चुनें।',
    'popular.departs': 'प्रस्थान',
    'popular.arrives': 'आगमन',
    'popular.duration': 'अवधि',
    'popular.runsOn': 'चलती है',

    'strip.eyebrow': 'नेटवर्क स्थिति',
    'strip.running': 'चल रही ट्रेनें',
    'strip.delayed': 'देरी से',
    'strip.onTime': 'समय पर',
    'strip.congested': 'भीड़भाड़ वाले सेक्शन',
    'strip.updated': 'पूर्वानुमान अपडेट किया गया',
    'strip.justNow': 'अभी-अभी',
    'strip.sample': 'सैंपल ट्रेनें',

    'demo.eyebrow': 'यह कैसे काम करता है',
    'demo.title': 'RailSense एक यात्रा को कैसे देखता है',
    'demo.body':
      'ट्रेन यार्ड से निकलने से पहले समय-सारणी छह समय तय कर देती है। RailSense हर स्टेशन पर, यात्रा के असल चलने के साथ, उन्हें फिर से बनाता रहता है।',
    'demo.scheduled': 'समय-सारणी',
    'demo.predicted': 'RailSense',

    'propagation.eyebrow': 'पूर्वानुमान क्यों बदलते हैं',
    'propagation.title': 'हर देरी कहीं न कहीं से शुरू होती है।',
    'propagation.body1':
      'कोई सिग्नल सामान्य से दो मिनट ज़्यादा रोके रखा गया। अगले जंक्शन पर प्लेटफ़ॉर्म अभी भी खाली नहीं हुआ। अकेले देखने पर इनमें से कुछ भी बड़ा नहीं लगता।',
    'propagation.body2':
      'RailSense इन छोटी बाधाओं को आगे के सेक्शन में ट्रैक करता है, ताकि देरी आपके स्टेशन पर पहुँचने के बाद नहीं, बल्कि पहले ही दिख जाए।',

    'stations.title': 'स्टेशन वह जगह है जहाँ यात्राएँ मिलती हैं।',
    'stations.body':
      'हर आने-जाने वाली ट्रेन उन्हीं कुछ प्लेटफ़ॉर्म से गुज़रती है। देखें क्या आने वाला है, और वह असल में कब अपेक्षित है।',
    'stations.liveDepartures': 'लाइव प्रस्थान',
    'stations.time': 'समय',
    'stations.train': 'ट्रेन',
    'stations.destination': 'गंतव्य',
    'stations.platform': 'प्लेटफ़ॉर्म',
    'stations.searchTitle': 'दूसरा स्टेशन देखें',

    'alerts.body': 'नेटवर्क पर अभी वास्तव में क्या हो रहा है, और यह किन ट्रेनों को प्रभावित करता है।',
    'alerts.impact': 'अपेक्षित असर',
    'alerts.affected': '{total} में से {count} सैंपल ट्रेनें',
    'alerts.demoNote':
      'इस प्रीव्यू की तीन सैंपल ट्रेनों से बनाई गई सिम्युलेटेड घटनाएँ — यह कोई लाइव रेलवे कंट्रोल-रूम फ़ीड नहीं है।',
    'alerts.type.congestion': 'भीड़भाड़',
    'alerts.type.restriction': 'गति प्रतिबंध',
    'alerts.type.delay': 'प्रस्थान में देरी',

    'about.eyebrow': 'RailSense के बारे में',
    'about.title': 'समय-सारणी योजना बताती है। RailSense नतीजे का अनुमान लगाता है।',
    'about.problemLabel': 'समस्या',
    'about.problemBody':
      'प्रकाशित समय-सारणी एक आदर्श यात्रा बताती है। जैसे ही ट्रेन किसी सिग्नल, प्रतिबंध या व्यस्त जंक्शन पर समय गँवाती है, छपा हुआ आगमन समय बेकार हो जाता है — और यह कभी नहीं बताता कि कितना समय गँवाया, या वह वापस मिलेगा भी या नहीं।',
    'about.ideaLabel': 'विचार',
    'about.ideaBody':
      'समय-सारणी से पूछने के बजाय, RailSense पूछता है कि यात्रा में असल में क्या बचा है: ट्रेन अभी कैसे चल रही है, यह लाइन आमतौर पर आगे क्या करती है, और वह आमतौर पर समय कहाँ वापस पाती है।',
    'about.signalsLabel': 'संकेत',
    'about.signalsBody':
      'स्थिति, मौजूदा गति, ऐतिहासिक सेक्शन समय, मौजूदा देरी, आगे की भीड़भाड़ और परिचालन प्रतिबंध — सबको मिलाकर हर स्टेशन के लिए एक अनुमान।',
    'about.loopLabel': 'चक्र',
    'about.loopObserve': 'निरीक्षण',
    'about.loopPredict': 'अनुमान',
    'about.loopUpdate': 'अपडेट',
    'about.loopAgain': 'फिर निरीक्षण',
    'about.loopBody': 'यह अनुमान कभी अंतिम नहीं होता। RailSense हर कुछ मिनट में इसे फिर देखता और सुधारता है।',


    'footer.about': 'परिचय',
    'footer.contact': 'संपर्क',
    'footer.product': 'प्रोडक्ट',
    'footer.company': 'कंपनी',
    'footer.summary':
      'RailSense भारतीय रेल की कोचिंग ट्रेनों के लिए संभावित आगमन समय का अनुमान लगाता है, ताकि यात्रियों को पता रहे कि ट्रेन वास्तव में कब पहुँचेगी।',
    'footer.dataTitle': 'डेटा और अपडेट',
    'footer.dataBody':
      'प्रकाशित भारतीय रेल समय-सारणी पर आधारित। लाइव पोज़िशन और डायनामिक ETA अभी विकास में हैं और जुड़े नहीं हैं।',
    'footer.rights': '© {year} RailSense',
    'footer.disclaimer': 'एक स्वतंत्र प्रोजेक्ट। भारतीय रेल या IRCTC से संबद्ध नहीं।',

    'unit.min': 'मिनट',
    'unit.km': 'किमी',
    'unit.kmph': 'किमी/घंटा',

    'status.onTime': 'समय पर',
    'status.completed': 'गुज़र चुका',
    'status.current': 'अभी यहाँ',
    'status.upcoming': 'आगे',

    'results.back': 'खोज पर वापस',
    'results.forecast': 'RailSense ETA',
    'results.routeTitle': '{from} से {to} तक की ट्रेनें',
    'results.routeSubtitle': 'सैंपल डेटा में इस रूट पर {count} ट्रेन हैं।',
    'results.trainTitle': '“{query}” के परिणाम',
    'results.trainSubtitle': 'सैंपल डेटा में {count} ट्रेन मिलीं।',
    'results.stationTitle': '{station} से जाने वाली ट्रेनें',
    'results.stationSubtitle': 'सैंपल डेटा में {count} ट्रेन यहाँ रुकती हैं।',
    'results.emptyTitle': 'सैंपल डेटा में कोई ट्रेन नहीं मिली',
    'results.emptyBody':
      'इस प्रीव्यू में तीन सैंपल ट्रेनें हैं: 12951 मुंबई सेंट्रल – नई दिल्ली, 12301 हावड़ा – नई दिल्ली और 12002 रानी कमलापति – नई दिल्ली।',
    'results.emptyAction': 'दूसरी खोज करें',
    'results.sampleNote':
      'सैंपल समय-सारणी डेटा। इस प्रीव्यू में लाइव पोज़िशन जुड़ी नहीं हैं।',
    'results.timetableLabel': 'समय-सारणी',
    'results.colTrain': 'ट्रेन',
    'results.colRoute': 'मार्ग',
    'results.colForecast': 'पूर्वानुमान',

    'journey.back': 'वापस',
    'journey.running': 'चल रही है',
    'journey.timelineTitle': 'यात्रा',
    'journey.timelineHint': 'बीच के स्टेशन देखने के लिए दो स्टेशनों के बीच की लाइन चुनें।',
    'journey.timelineRegion': 'यात्रा टाइमलाइन, क्षैतिज रूप से स्क्रॉल करें',
    'journey.markerLabel': 'ट्रेन {train} की वर्तमान स्थिति',
    'journey.showStops': '{from} और {to} के बीच के {count} स्टेशन दिखाएँ',
    'journey.hideStops': '{from} और {to} के बीच के {count} स्टेशन छिपाएँ',
    'journey.missingTitle': 'इस ट्रेन का यात्रा डेटा नहीं है',
    'journey.missingBody': 'इस प्रीव्यू में केवल सैंपल ट्रेनों का यात्रा डेटा है।',

    'eta.title': '{station} पर आगमन',
    'eta.scheduled': 'निर्धारित ETA',
    'eta.railSense': 'RailSense ETA',
    'eta.predictedDelay': 'अनुमानित देरी',

    'why.title': 'यह ETA क्यों?',
    'why.currentDelay': 'अभी की देरी',
    'why.predictedAt': '{station} पर अनुमानित देरी',
    'why.recovery': 'संभावित रिकवरी',
    'why.congestion': 'आगे के सेक्शन में भीड़',
    'why.restriction': 'अस्थायी गति प्रतिबंध',
    'why.runningSpeed': 'वर्तमान गति',
    'why.weather': 'मौसम की स्थिति',
    'why.history': 'ऐतिहासिक चलने का पैटर्न',
    'why.disclaimer':
      'प्रोटोटाइप अनुमान इनपुट। ये आँकड़े केवल उदाहरण हैं — न लाइव रेलवे डेटा, न किसी प्रशिक्षित मॉडल का परिणाम।',

    'metrics.title': 'ट्रेन प्रदर्शन',
    'metrics.currentSpeed': 'वर्तमान गति',
    'metrics.averageSpeed': 'औसत गति',
    'metrics.currentDelay': 'वर्तमान देरी',
    'metrics.distanceCovered': 'तय दूरी',
    'metrics.distanceRemaining': 'शेष दूरी',
    'metrics.halted': '{station} पर रुकी है',

    'upcoming.title': 'आगामी स्टेशन',
    'upcoming.count': '{count} शेष',
    'upcoming.caption': 'हर शेष स्टेशन के लिए निर्धारित समय बनाम RailSense अनुमान।',
    'upcoming.station': 'स्टेशन',
    'upcoming.scheduled': 'निर्धारित',
    'upcoming.railSense': 'RailSense ETA',
    'upcoming.difference': 'अंतर',
    'upcoming.status': 'स्थिति',
    'upcoming.trend': 'पिछले स्टेशन से बदलाव:',

    // वाक्य के भीतर उपयोग के लिए कारकों के छोटे रूप।
    'cause.congestion': 'आगे की लाइन पर भीड़',
    'cause.restriction': 'अस्थायी गति सीमा',
    'cause.runningSpeed': 'इसकी मौजूदा चाल',
    'cause.weather': 'आगे का मौसम',
    'cause.history': 'इस ट्रेन का सामान्य प्रदर्शन',
    'cause.recovery': 'आगे उपलब्ध मार्जिन',



    // ----- एकवचन रूप: `t()` इन्हें तब चुनता है जब {minutes} एक हो -----
    'why.explain.atNow.one': 'ट्रेन {station} पर खड़ी है, {minutes} मिनट लेट।',
    'why.explain.betweenNow.one': 'ट्रेन {from} और {to} के बीच है, {minutes} मिनट लेट।',
    'why.explain.loss.one':
      'आगे {cause} से {destination} तक लगभग {minutes} मिनट और जुड़ने की संभावना है।',
    'why.explain.gain.one':
      '{section} सेक्शन पर करीब {minutes} मिनट वापस मिलने चाहिए, जहाँ समय-सारणी में कुछ मार्जिन है।',
    'why.explain.resultLate.one':
      'इससे {destination} पर आगमन {arrival} पर होगा, यानी करीब {minutes} मिनट लेट।',
    'why.explain.resultEarly.one':
      'इससे {destination} पर आगमन {arrival} पर होगा, समय-सारणी से करीब {minutes} मिनट पहले।',
    'confidence.reason.driver.one':
      'सबसे ज़्यादा अनिश्चितता {cause} से है, जिससे आगमन तक करीब {minutes} मिनट इधर-उधर हो सकते हैं।',
    'confidence.reason.recovery.one':
      'अनुमान {section} सेक्शन पर करीब {minutes} मिनट की भरपाई पर टिका है, जिसके लिए खाली रास्ता चाहिए।',
    'recovery.explain.one':
      '{section} सेक्शन पर ट्रेन के लगभग {minutes} मिनट की भरपाई करने की उम्मीद है, जहाँ समय-सारणी में पर्याप्त मार्जिन है।',
    'confidence.margin.one':
      'कनेक्शन सुरक्षित है या नहीं, यह तय करते समय RailSense इस समय के आगे-पीछे लगभग {minutes} मिनट का मार्जिन रखता है।',
    'connection.explainHeld.one':
      'अनुमान ने ट्रेन बदलने के समय में कटौती नहीं की है: दोनों ट्रेनों के बीच {minutes} मिनट अब भी हैं।',
    'connection.body.safe.one':
      'RailSense के अनुमानित आगमन के {minutes} मिनट बाद ट्रेन {train} चलती है — ट्रेन बदलने के लिए ज़रूरी {transfer} मिनट से काफी ज़्यादा।',
    'connection.body.at-risk.one':
      'RailSense के अनुमानित आगमन के {minutes} मिनट बाद ट्रेन {train} चलती है। ट्रेन बदलने के {transfer} मिनट निकल तो जाते हैं, पर बस मुश्किल से।',
    'connection.body.high-risk.one':
      'RailSense के अनुमानित आगमन के केवल {minutes} मिनट बाद ट्रेन {train} चलती है — ट्रेन बदलने में लगने वाले {transfer} मिनट से भी कम।',
    'connection.body.missed.one':
      'RailSense के अनुमानित आगमन से {minutes} मिनट पहले ही ट्रेन {train} रवाना हो जाएगी।',
    'summary.atLate.one': 'आपकी ट्रेन {station} पर खड़ी है, {minutes} मिनट लेट।',
    'summary.betweenLate.one':
      'आपकी ट्रेन {from} और {to} के बीच है, {minutes} मिनट लेट चल रही है।',
    'summary.forecastWorse.one':
      'RailSense के अनुमान में {destination} तक देरी बढ़कर लगभग {minutes} मिनट हो सकती है — मुख्य वजह {cause} — और आगमन {arrival} पर होगा।',
    'summary.forecastBetter.one':
      'RailSense के अनुमान में रास्ते में लगभग {recovery} मिनट की भरपाई होगी और {destination} पर आगमन {arrival} पर, यानी करीब {minutes} मिनट लेट।',
    'summary.connection.safe.one':
      'ट्रेन {train} का {departure} वाला कनेक्शन आराम से मिल जाना चाहिए — बदलने के लिए करीब {minutes} मिनट हैं।',
    'summary.connection.at-risk.one':
      'ट्रेन {train} के {departure} वाले कनेक्शन के लिए सिर्फ़ {minutes} मिनट बचते हैं, इसलिए कोई विकल्प सोच रखें।',
    'summary.connection.high-risk.one':
      'ट्रेन {train} का {departure} वाला कनेक्शन बड़े जोखिम में है — ट्रेन बदलने के लिए {minutes} मिनट काफी नहीं हैं।',
    'voice.answerAt.one':
      'ट्रेन {train} {station} पर खड़ी है, {minutes} मिनट लेट। RailSense के अनुसार {destination} पर आगमन {arrival} पर होगा।',
    'voice.answerBetween.one':
      'ट्रेन {train} {from} और {to} के बीच है, {minutes} मिनट लेट चल रही है। RailSense के अनुसार {destination} पर आगमन {arrival} पर होगा।',
    'voice.answerEta.one':
      'RailSense के अनुसार ट्रेन {train} {station} पर {time} बजे पहुँचेगी। निर्धारित समय {scheduled} है, यानी करीब {minutes} मिनट लेट।',
    'voice.answerEtaPassed.one':
      'ट्रेन {train} {station} से आगे निकल चुकी है। वहाँ वह {time} बजे पहुँची थी, {minutes} मिनट लेट।',
    'voice.answerEtaDestination.one':
      'RailSense के अनुसार ट्रेन {train} {station} पर {time} बजे पहुँचेगी, करीब {minutes} मिनट लेट।',
    'voice.answerDelay.one':
      'ट्रेन {train} इस समय {minutes} मिनट लेट चल रही है। RailSense के अनुसार {destination} पर आगमन के समय {predicted} मिनट की देरी होगी।',
    // ----- डेमो सिमुलेशन (§3) -----
    'sim.title': 'डेमो सिमुलेशन',
    'sim.start': 'चलाएँ',
    'sim.pause': 'रोकें',
    'sim.reset': 'रीसेट',
    'sim.speedLabel': 'सिमुलेशन गति',
    'sim.idle': 'ट्रेन चलने के साथ अनुमान कैसे बदलता है, देखने के लिए चलाएँ।',
    'sim.elapsed': '{clock} की यात्रा सिम्युलेट हुई',
    'sim.arrived': 'ट्रेन अपने गंतव्य पर पहुँच चुकी है।',

    // ----- यह ETA क्यों — मौजूदा अनुमान से बना पाठ (§7) -----
    'why.explain.atNow': 'ट्रेन {station} पर खड़ी है, {minutes} मिनट लेट।',
    'why.explain.betweenNow': 'ट्रेन {from} और {to} के बीच है, {minutes} मिनट लेट।',
    'why.explain.loss': 'आगे {cause} से {destination} तक लगभग {minutes} मिनट और जुड़ने की संभावना है।',
    'why.explain.gain': '{section} सेक्शन पर करीब {minutes} मिनट वापस मिलने चाहिए, जहाँ समय-सारणी में कुछ मार्जिन है।',
    'why.explain.resultLate': 'इससे {destination} पर आगमन {arrival} पर होगा, यानी करीब {minutes} मिनट लेट।',
    'why.explain.resultEarly': 'इससे {destination} पर आगमन {arrival} पर होगा, समय-सारणी से करीब {minutes} मिनट पहले।',
    'why.explain.resultOnTime': 'इससे {destination} पर आगमन {arrival} पर होगा, यानी समय पर।',

    // ----- भरोसे के कारण, अनुमान की स्थिति से निकाले गए (§13) -----
    'confidence.reason.stable':
      'आगे की यात्रा में बहुत कम बदलाव बाकी है और स्थितियाँ स्थिर हैं, इसलिए यह आगमन समय टिकना चाहिए।',
    'confidence.reason.driver':
      'सबसे ज़्यादा अनिश्चितता {cause} से है, जिससे आगमन तक करीब {minutes} मिनट इधर-उधर हो सकते हैं।',
    'confidence.reason.recovery':
      'अनुमान {section} सेक्शन पर करीब {minutes} मिनट की भरपाई पर टिका है, जिसके लिए खाली रास्ता चाहिए।',
    'confidence.reason.volatile':
      'आगे के सेक्शनों की स्थितियाँ इस समय तेज़ी से बदल रही हैं, इसलिए यह आगमन समय अभी दोनों ओर खिसक सकता है।',
    // ----- डेटा भरोसा (§29) -----
    'trust.confirmed': 'पुष्ट',
    'trust.predicted': 'अनुमानित',
    'trust.simulated': 'सिम्युलेटेड',
    'trust.unavailable': 'उपलब्ध नहीं',

    // ----- नक्शा -----
    'map.title': 'ट्रेन कहाँ है',
    'map.legendCovered': 'तय किया रास्ता',
    'map.legendAhead': 'आगे का रास्ता (अनुमान)',
    'map.loading': 'नक्शा लोड हो रहा है…',
    'map.disclaimer':
      'स्टेशनों की स्थिति अनुमानित है और ट्रेन की स्थिति इस प्रोटोटाइप के लिए सिम्युलेटेड है।',
    'map.region': 'ट्रेन {train} के रूट का नक्शा',
    'map.zoomIn': 'ज़ूम इन',
    'map.zoomOut': 'ज़ूम आउट',
    'map.locateTrain': 'ट्रेन पर केंद्रित करें',
    'map.fitRoute': 'पूरा रूट दिखाएँ',
    'map.actual': 'वास्तविक',
    'map.observedDelay': 'देरी',
    'map.predictedDelay': 'अनुमानित देरी',
    'map.location': 'वर्तमान स्थिति',
    'map.standingAt': '{station} पर खड़ी है',
    'map.betweenStations': '{from} और {to} के बीच',

    // ----- देरी की भरपाई (§18) -----
    'recovery.title': 'देरी की भरपाई',
    'recovery.currentDelay': 'अभी की देरी',
    'recovery.additional': 'संभावित अतिरिक्त देरी',
    'recovery.expected': 'संभावित भरपाई',
    'recovery.atDestination': '{station} पर अनुमानित देरी',
    'recovery.explain':
      '{section} सेक्शन पर ट्रेन के लगभग {minutes} मिनट की भरपाई करने की उम्मीद है, जहाँ समय-सारणी में पर्याप्त मार्जिन है।',
    'recovery.none':
      'बचे हुए सेक्शनों में भरपाई की उम्मीद नहीं है — आगे समय-सारणी में मार्जिन बहुत कम है।',
    'recovery.section12951': 'भरतपुर–मथुरा',
    'recovery.section12301': 'कानपुर–टूंडला मुख्य लाइन',
    'recovery.section12002': 'ग्वालियर–आगरा',

    // ----- भरोसा (§19) -----
    'confidence.title': 'ETA पर भरोसा',
    'confidence.high': 'उच्च भरोसा',
    'confidence.medium': 'मध्यम भरोसा',
    'confidence.low': 'कम भरोसा',
    'confidence.margin':
      'कनेक्शन सुरक्षित है या नहीं, यह तय करते समय RailSense इस समय के आगे-पीछे लगभग {minutes} मिनट का मार्जिन रखता है।',

    // ----- मौसम (§24) -----
    'weather.title': 'इस यात्रा पर मौसम का असर',
    'weather.body': 'आगे के सेक्शन में {station} के पास {condition} की संभावना है।',
    'weather.impact': 'पहुँचने के समय पर अनुमानित असर',
    'weather.rain': 'बारिश',

    // ----- पिछला प्रदर्शन (§25) -----
    'history.title': 'यह ट्रेन आमतौर पर कैसी चलती है',
    'history.typical': 'सामान्य आगमन देरी',
    'history.variation': 'सामान्य उतार-चढ़ाव',
    'history.lastRuns': 'पिछली {count} यात्राओं की आगमन देरी, नवीनतम पहले',

    // ----- कनेक्शन सुरक्षा (§20, §21) -----
    'connection.title': 'कनेक्शन सुरक्षा',
    'connection.intro':
      'आगे दूसरी ट्रेन पकड़नी है? उसका नंबर डालें — RailSense उसे निर्धारित समय से नहीं, अनुमानित आगमन समय से जाँचेगा।',
    'connection.label': 'कनेक्टिंग ट्रेन नंबर',
    'connection.placeholder': 'जैसे 12045',
    'connection.submit': 'कनेक्शन जाँचें',
    'connection.sampleHint': 'इस प्रोटोटाइप में आगे की ट्रेनें:',
    'connection.unavailable':
      'इस स्टेशन से ट्रेन {train} का कोई प्रस्थान हमारे पास नहीं है, इसलिए हम वह कनेक्शन नहीं जाँच सकते।',
    'connection.whyTitle': 'क्यों',
    'connection.predictedArrival': '{station} अनुमानित आगमन',
    'connection.departure': 'कनेक्शन प्रस्थान',
    'connection.buffer': 'अनुमानित अंतर',
    'connection.scheduledBuffer': 'निर्धारित अंतर',
    'connection.transfer': 'ट्रेन बदलने का समय',
    'connection.confidence': 'ETA पर भरोसा',
    'connection.explainLost':
      'समय-सारणी में ट्रेन बदलने के लिए {scheduled} मिनट थे, पर अनुमान उनमें से {lost} मिनट ले चुका है — अब {buffer} मिनट बचे हैं।',
    'connection.explainHeld':
      'अनुमान ने ट्रेन बदलने के समय में कटौती नहीं की है: दोनों ट्रेनों के बीच {minutes} मिनट अब भी हैं।',
    'connection.explainConfidence.high':
      'स्थितियाँ स्थिर हैं, इसलिए RailSense इस आगमन पर केवल {margin} मिनट का मार्जिन रखता है।',
    'connection.explainConfidence.medium':
      'आगे की स्थितियाँ बदल सकती हैं, इसलिए RailSense इस आगमन पर {margin} मिनट का मार्जिन रखता है।',
    'connection.explainConfidence.low':
      'आगे की स्थितियाँ अनिश्चित हैं, इसलिए RailSense इस आगमन पर {margin} मिनट का मार्जिन रखता है।',
    'connection.onward': '{name} · {to} की ओर',
    'connection.verdict.safe': 'कनेक्शन सुरक्षित लग रहा है',
    'connection.verdict.at-risk': 'कनेक्शन पर जोखिम है',
    'connection.verdict.high-risk': 'यह कनेक्शन छूटने का बड़ा जोखिम है',
    'connection.verdict.missed': 'यह कनेक्शन तब तक जा चुका होगा',
    'connection.body.safe':
      'RailSense के अनुमानित आगमन के {minutes} मिनट बाद ट्रेन {train} चलती है — ट्रेन बदलने के लिए ज़रूरी {transfer} मिनट से काफी ज़्यादा।',
    'connection.body.at-risk':
      'RailSense के अनुमानित आगमन के {minutes} मिनट बाद ट्रेन {train} चलती है। ट्रेन बदलने के {transfer} मिनट निकल तो जाते हैं, पर बस मुश्किल से।',
    'connection.body.high-risk':
      'RailSense के अनुमानित आगमन के केवल {minutes} मिनट बाद ट्रेन {train} चलती है — ट्रेन बदलने में लगने वाले {transfer} मिनट से भी कम।',
    'connection.body.missed':
      'RailSense के अनुमानित आगमन से {minutes} मिनट पहले ही ट्रेन {train} रवाना हो जाएगी।',

    // ----- आपके लिए इसका मतलब (§22) -----
    'summary.title': 'आपके लिए इसका मतलब',
    'summary.atLate': 'आपकी ट्रेन {station} पर खड़ी है, {minutes} मिनट लेट।',
    'summary.atOnTime': 'आपकी ट्रेन {station} पर खड़ी है, समय पर।',
    'summary.betweenLate': 'आपकी ट्रेन {from} और {to} के बीच है, {minutes} मिनट लेट चल रही है।',
    'summary.betweenOnTime': 'आपकी ट्रेन {from} और {to} के बीच है, समय पर चल रही है।',
    'summary.forecastWorse':
      'RailSense के अनुमान में {destination} तक देरी बढ़कर लगभग {minutes} मिनट हो सकती है — मुख्य वजह {cause} — और आगमन {arrival} पर होगा।',
    'summary.forecastBetter':
      'RailSense के अनुमान में रास्ते में लगभग {recovery} मिनट की भरपाई होगी और {destination} पर आगमन {arrival} पर, यानी करीब {minutes} मिनट लेट।',
    'summary.forecastSteady':
      'RailSense के अनुमान में यह {destination} तक ऐसा ही रहेगा और आगमन {arrival} पर होगा।',
    'summary.connection.safe':
      'ट्रेन {train} का {departure} वाला कनेक्शन आराम से मिल जाना चाहिए — बदलने के लिए करीब {minutes} मिनट हैं।',
    'summary.connection.at-risk':
      'ट्रेन {train} के {departure} वाले कनेक्शन के लिए सिर्फ़ {minutes} मिनट बचते हैं, इसलिए कोई विकल्प सोच रखें।',
    'summary.connection.high-risk':
      'ट्रेन {train} का {departure} वाला कनेक्शन बड़े जोखिम में है — ट्रेन बदलने के लिए {minutes} मिनट काफी नहीं हैं।',
    'summary.connection.missed':
      '{departure} वाली ट्रेन {train} तब तक जा चुकी होगी, इसलिए आपको बाद का कनेक्शन लेना होगा।',

    // ----- आवाज़ (§6) -----
    'voice.title': 'मेरी ट्रेन कहाँ है?',
    'voice.hint': 'माइक दबाएँ और अपनी ट्रेन के बारे में पूछें।',
    'voice.unsupportedHint':
      'आवाज़ से खोज के लिए स्पीच पहचान वाला ब्राउज़र चाहिए, जैसे Chrome। तब तक ऊपर दी गई खोज का उपयोग करें।',
    'voice.tapToSpeak': 'बोलने के लिए दबाएँ',
    'voice.stop': 'सुनना बंद करें',
    'voice.listening': 'सुन रहे हैं…',
    'voice.thinking': 'पता लगा रहे हैं…',
    'voice.idle': 'इस प्रीव्यू की किसी भी ट्रेन के बारे में पूछें।',
    'voice.youSaid': 'आपने कहा',
    'voice.noSpeechOutput': 'आपका ब्राउज़र यह जवाब बोल नहीं सकता, इसलिए यहाँ दिखाया गया है।',
    'voice.fallback': 'आप ऊपर दिए फ़ॉर्म से ट्रेन नंबर या रूट लिखकर भी खोज सकते हैं।',
    'voice.examples':
      'जैसे: “ट्रेन 12951 कहाँ है?” · “मेरी ट्रेन कोटा कब पहुँचेगी?” · “12301 कितनी लेट है?”',
    'voice.errorNoSpeech': 'हम सुन नहीं पाए।',
    'voice.errorDenied': 'माइक्रोफ़ोन की अनुमति नहीं मिली।',
    'voice.errorGeneric': 'आवाज़ से खोज अभी नहीं चल पाई।',
    'voice.errorUnsupported': 'यह ब्राउज़र आवाज़ से खोज नहीं करता।',
    'voice.answerUnknown':
      'मैं बता सकता हूँ कि ट्रेन कहाँ है, किसी स्टेशन पर कब पहुँचेगी, या कितनी लेट है। पूछकर देखें कि ट्रेन 12951 कहाँ है।',
    'voice.answerNoJourney':
      'इस प्रीव्यू में ट्रेन {train} का यात्रा डेटा नहीं है। इसमें 12951, 12301 और 12002 हैं।',
    'voice.answerNoTrain': 'कौन सी ट्रेन? जैसे कहें, ट्रेन 12951 कहाँ है।',
    'voice.answerAt':
      'ट्रेन {train} {station} पर खड़ी है, {minutes} मिनट लेट। RailSense के अनुसार {destination} पर आगमन {arrival} पर होगा।',
    'voice.answerBetween':
      'ट्रेन {train} {from} और {to} के बीच है, {minutes} मिनट लेट चल रही है। RailSense के अनुसार {destination} पर आगमन {arrival} पर होगा।',
    'voice.answerEta':
      'RailSense के अनुसार ट्रेन {train} {station} पर {time} बजे पहुँचेगी। निर्धारित समय {scheduled} है, यानी करीब {minutes} मिनट लेट।',
    'voice.answerEtaPassed':
      'ट्रेन {train} {station} से आगे निकल चुकी है। वहाँ वह {time} बजे पहुँची थी, {minutes} मिनट लेट।',
    'voice.answerEtaDestination':
      'RailSense के अनुसार ट्रेन {train} {station} पर {time} बजे पहुँचेगी, करीब {minutes} मिनट लेट।',
    'voice.answerDelay':
      'ट्रेन {train} इस समय {minutes} मिनट लेट चल रही है। RailSense के अनुसार {destination} पर आगमन के समय {predicted} मिनट की देरी होगी।',
  },
}
