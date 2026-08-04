import type { ChangeEvent } from 'react'
import styles from './styles.module.scss'

export type InputType = 'text' | 'password' | 'number' | 'email'

export type InputProps = {
  id: string
  label: string
  name?: string
  type?: InputType
  value: string
  onChange: (value: string) => void
  autoComplete?: string
  error?: string | null
  disabled?: boolean
  min?: number
  max?: number
  step?: number
}

function Input({
  id,
  label,
  name,
  type = 'text',
  value,
  onChange,
  autoComplete,
  error = null,
  disabled = false,
  min,
  max,
  step,
}: InputProps) {
  const errorId = `${id}-error`
  const hasError = Boolean(error)

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    onChange(event.target.value)
  }

  return (
    <div className={`${styles.root}${hasError ? ` ${styles.rootError}` : ''}`}>
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
