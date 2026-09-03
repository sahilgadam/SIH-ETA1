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

    'hero.title': 'Know when your train will actually arrive.',
    'hero.subtitle':
      'RailSense predicts arrival times from how your train is running now, what is happening on the line ahead, and how this service usually behaves.',
    'hero.note': 'Covering coaching trains across the Indian Railways network.',

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

    'journey.back': 'Back to results',
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

    'hero.title': 'जानिए आपकी ट्रेन असल में कब पहुँचेगी।',
    'hero.subtitle':
      'RailSense आपकी ट्रेन की मौजूदा चाल, आगे की लाइन की स्थिति और इस सेवा के सामान्य व्यवहार से आगमन का समय बताता है।',
    'hero.note': 'भारतीय रेल नेटवर्क की कोचिंग ट्रेनों के लिए।',

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

    'journey.back': 'परिणामों पर वापस',
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
