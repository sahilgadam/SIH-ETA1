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

    'hero.title': 'Find your train',
    'hero.subtitle': 'Track your journey and get smarter arrival predictions.',
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
    'why.explain12951':
      'The train is eight minutes down now. Traffic through the Kota junction area is expected to push that to twelve by Sawai Madhopur, after which the fast Bharatpur–Mathura stretch should win a couple of minutes back before the Delhi approach costs them again.',
    'why.explain12301':
      'The train is twenty-two minutes down and still slipping towards Prayagraj. From Kanpur it is expected to recover: the Delhi main line gives a Rajdhani a clear path, so the forecast improves to sixteen by Aligarh before fog and the Ghaziabad approach add a little back.',
    'why.explain12002':
      'The train is standing at Jhansi only three minutes down, but the forecast climbs steadily after Agra. The busy Mathura–Palwal approach into Delhi is where almost all of the extra time is expected to go.',

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

    'hero.title': 'अपनी ट्रेन खोजें',
    'hero.subtitle': 'अपनी यात्रा ट्रैक करें और बेहतर आगमन अनुमान पाएँ।',
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
    'why.explain12951':
      'ट्रेन अभी आठ मिनट देरी से है। कोटा जंक्शन क्षेत्र की भीड़ से सवाई माधोपुर तक यह बारह मिनट होने की संभावना है; इसके बाद भरतपुर–मथुरा के तेज़ खंड में कुछ समय वापस मिलेगा, पर दिल्ली पहुँचते-पहुँचते फिर बढ़ेगा।',
    'why.explain12301':
      'ट्रेन बाईस मिनट देरी से है और प्रयागराज तक देरी थोड़ी और बढ़ेगी। कानपुर के बाद सुधार अपेक्षित है — दिल्ली मुख्य लाइन पर राजधानी को खुला रास्ता मिलता है, इसलिए अलीगढ़ तक अनुमान सोलह मिनट तक सुधरता है, फिर कोहरा और गाज़ियाबाद की भीड़ कुछ जोड़ देते हैं।',
    'why.explain12002':
      'ट्रेन झाँसी पर केवल तीन मिनट की देरी से खड़ी है, पर आगरा के बाद अनुमान लगातार बढ़ता है। दिल्ली की ओर व्यस्त मथुरा–पलवल खंड में ही अधिकांश अतिरिक्त समय लगने की संभावना है।',

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
  },
}
