import { TrainJourney } from '../components/journey/TrainJourney'
import { getJourney } from '../data/journeys'
import { useLanguage } from '../context/LanguageProvider'
import { Button } from '../components/ui/Button'

export function Journey({ trainNumber, onBack, onOpenTrain }) {
  const { t } = useLanguage()
  const journey = getJourney(trainNumber)

  if (!journey) {
    return (
      <div className="mx-auto max-w-[1200px] px-4 py-16 text-center sm:px-6">
        <p className="text-sm font-semibold text-fg">{t('journey.missingTitle')}</p>
        <p className="mx-auto mt-1.5 max-w-md text-sm text-fg-muted">{t('journey.missingBody')}</p>
        <Button variant="secondary" onClick={onBack} className="mt-5">
          {t('journey.back')}
        </Button>
      </div>
    )
  }

  return <TrainJourney journey={journey} onBack={onBack} onOpenTrain={onOpenTrain} />
}
