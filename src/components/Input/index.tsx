import type { ChangeEvent } from 'react'
import styles from './styles.module.scss'

export type InputType = 'text' | 'password' | 'number' | 'email'
export type InputTone = 'default' | 'success' | 'disabled' | 'danger' | 'warning'

export type InputProps = {
  id: string
  label: string
  name?: string
  type?: InputType
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
  autoComplete?: string
  error?: string | null
  disabled?: boolean
  min?: number
  max?: number
  step?: number
  tone?: InputTone
}

function Input({
  id,
  label,
  name,
  type = 'text',
  value,
  onChange,
  onBlur,
  autoComplete,
  error = null,
  disabled = false,
  min,
  max,
  step,
  tone = 'default',
}: InputProps) {
  const errorId = `${id}-error`
  const hasError = Boolean(error)
  const effectiveTone: InputTone = disabled ? 'disabled' : hasError ? 'danger' : tone

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    onChange(event.target.value)
  }

  function handleBlur() {
    onBlur?.()
  }

  return (
    <div className={styles.root} data-tone={effectiveTone}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      <input
        className={styles.field}
        id={id}
        name={name ?? id}
        type={type}
        inputMode={type === 'email' ? 'email' : type === 'number' ? 'numeric' : undefined}
        autoComplete={autoComplete ?? (type === 'email' ? 'email' : undefined)}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        disabled={disabled}
        min={type === 'number' ? min : undefined}
        max={type === 'number' ? max : undefined}
        step={type === 'number' ? step : undefined}
        aria-invalid={hasError}
        aria-describedby={errorId}
      />
      <p className={styles.error} id={errorId} role={hasError ? 'alert' : undefined}>
        {error ?? '\u00A0'}
      </p>
    </div>
  )
}

export default Input
