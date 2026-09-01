import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { MapPin } from 'lucide-react'
import { formatStation, searchStations } from '../../data/stations'
import { cn } from '../../lib/cn'
import { fieldIcon, fieldInput, fieldLabel } from './fieldStyles'

/**
 * Station picker: a text input with a filtered suggestion list.
 * Typing is always allowed — the list is a shortcut, not a constraint.
 *
 * Keyboard: Down/Up move through suggestions, Enter picks the highlighted one,
 * Escape closes the list, Tab moves on and closes it.
 */
export function StationField({
  label,
  value,
  onChange,
  placeholder,
  invalid = false,
  describedBy,
  id,
  inputRef,
  className,
  name,
}) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const listId = `${inputId}-listbox`

  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const wrapperRef = useRef(null)

  const suggestions = useMemo(() => searchStations(value), [value])

  useEffect(() => {
    if (!isOpen) return

    const onPointerDown = (event) => {
      if (!wrapperRef.current?.contains(event.target)) setIsOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [isOpen])

  const open = () => {
    setIsOpen(true)
    setActiveIndex(-1)
  }

  const close = () => {
    setIsOpen(false)
    setActiveIndex(-1)
  }

  const select = (station) => {
    onChange(formatStation(station))
    close()
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      close()
      return
    }

    if (event.key === 'Tab') {
      close()
      return
    }

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      if (!isOpen) {
        open()
        return
      }
      if (!suggestions.length) return
      const step = event.key === 'ArrowDown' ? 1 : -1
      setActiveIndex((current) => {
        const next = current + step
        if (next < 0) return suggestions.length - 1
        if (next >= suggestions.length) return 0
        return next
      })
      return
    }

    if (event.key === 'Enter' && isOpen && activeIndex >= 0) {
      event.preventDefault()
      select(suggestions[activeIndex])
    }
  }

  const isListVisible = isOpen && suggestions.length > 0

  return (
    <div className={cn('relative', className)} ref={wrapperRef}>
      <label htmlFor={inputId} className={fieldLabel}>
        {label}
      </label>

      <div className="relative mt-1.5">
        <MapPin className={fieldIcon} aria-hidden="true" />
        <input
          id={inputId}
          ref={inputRef}
          name={name}
          type="text"
          role="combobox"
          autoComplete="off"
          spellCheck="false"
          aria-expanded={isListVisible}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={
            activeIndex >= 0 ? `${inputId}-option-${activeIndex}` : undefined
          }
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
          placeholder={placeholder}
          value={value}
          onChange={(event) => {
            onChange(event.target.value)
            setIsOpen(true)
            setActiveIndex(-1)
          }}
          onFocus={open}
          onKeyDown={handleKeyDown}
          className={fieldInput({ invalid, hasIcon: true })}
        />
      </div>

      <ul
        id={listId}
        role="listbox"
        aria-label={label}
        hidden={!isListVisible}
        className={cn(
          'absolute z-30 mt-1 max-h-72 w-full overflow-y-auto rounded-md',
          'border border-line bg-surface py-1 shadow-lg shadow-black/5',
        )}
      >
        {suggestions.map((station, index) => (
          <li key={station.code} role="none">
            <button
              type="button"
              id={`${inputId}-option-${index}`}
              role="option"
              aria-selected={index === activeIndex}
              tabIndex={-1}
              onMouseEnter={() => setActiveIndex(index)}
              onClick={() => select(station)}
              className={cn(
                'flex w-full items-baseline justify-between gap-3 px-3 py-2 text-left',
                index === activeIndex ? 'bg-sunken' : 'bg-transparent',
              )}
            >
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium text-fg">
                  {station.name}
                </span>
                <span className="block truncate text-xs text-fg-subtle">
                  {station.city}, {station.state}
                </span>
              </span>
              <span className="shrink-0 font-mono text-xs font-semibold text-fg-muted">
                {station.code}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
