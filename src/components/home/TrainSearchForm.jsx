import { useRef, useState } from 'react'
import { Search, TrainFront } from 'lucide-react'
import { useLanguage } from '../../context/LanguageProvider'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { shake } from '../../lib/motion'
import { Button } from '../ui/Button'
import { FieldMessage } from '../ui/FieldMessage'
import { TextField } from '../ui/TextField'

/** Look up one train directly by number or name. */
export function TrainSearchForm({ onSearch }) {
  const { t } = useLanguage()
  const prefersReducedMotion = usePrefersReducedMotion()

  const [query, setQuery] = useState('')
  const [error, setError] = useState(false)
  const formRef = useRef(null)
  const inputRef = useRef(null)

  const handleSubmit = (event) => {
    event.preventDefault()
    const trimmed = query.trim()

    if (!trimmed) {
      setError(true)
      inputRef.current?.focus()
      if (!prefersReducedMotion) shake(formRef.current)
      return
    }

    setError(false)
    onSearch({ kind: 'train', query: trimmed })
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate>
      <h2 className="sr-only">{t('train.legend')}</h2>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <TextField
          id="train-query"
          inputRef={inputRef}
          label={t('train.label')}
          placeholder={t('train.placeholder')}
          icon={TrainFront}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value)
            setError(false)
          }}
          invalid={error}
          describedBy="train-feedback"
          className="flex-1"
        />

        <Button type="submit" size="lg" variant="secondary" className="w-full sm:w-auto">
          <Search className="size-4" aria-hidden="true" />
          {t('train.submit')}
        </Button>
      </div>

      <div id="train-feedback" className="mt-3 empty:mt-0">
        {error ? <FieldMessage tone="error">{t('train.error')}</FieldMessage> : null}
      </div>
    </form>
  )
}
