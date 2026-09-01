import { useId } from 'react'
import { fieldIcon, fieldInput, fieldLabel } from './fieldStyles'

/** Labelled single-line input with an optional leading icon. */
export function TextField({
  label,
  icon: Icon,
  invalid = false,
  describedBy,
  id,
  inputRef,
  className,
  ...inputProps
}) {
  const generatedId = useId()
  const inputId = id ?? generatedId

  return (
    <div className={className}>
      <label htmlFor={inputId} className={fieldLabel}>
        {label}
      </label>
      <div className="relative mt-1.5">
        {Icon ? <Icon className={fieldIcon} aria-hidden="true" /> : null}
        <input
          id={inputId}
          ref={inputRef}
          type="text"
          autoComplete="off"
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
          className={fieldInput({ invalid, hasIcon: Boolean(Icon) })}
          {...inputProps}
        />
      </div>
    </div>
  )
}
