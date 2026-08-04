import { useState } from 'react'
import type { SubmitEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import Input from '../../components/Input'
import { useAuth } from '../../features/auth'
import { useOffline } from '../../providers'
import { isNetworkError } from '../../utils/errors'
import styles from './styles.module.scss'

const MIN_LENGTH = 4
const MAX_LENGTH = 30

function isValid(value: string) {
  const length = value.trim().length
  return length >= MIN_LENGTH && length <= MAX_LENGTH
}

function getFieldError(value: string): string | null {
  if (value === '') {
    return null
  }

  if (!isValid(value)) {
    return `Must be between ${MIN_LENGTH} and ${MAX_LENGTH} characters`
  }

  return null
}

function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const { showOfflineModal } = useOffline()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const canSubmit = isValid(username) && isValid(password) && !isSubmitting

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!canSubmit) return

    setError(null)
    setIsSubmitting(true)

    try {
      await login(username.trim(), password)
      navigate('/dashboard')
    } catch (err) {
      if (isNetworkError(err)) {
        showOfflineModal()
        setError('Unable to log in while offline.')
      } else {
        setError(err instanceof Error ? err.message : 'Login failed')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className={styles.page}>
      <h1>Login</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <Input
          id="username"
          label="Username"
          name="username"
          type="text"
          autoComplete="username"
          value={username}
          onChange={setUsername}
          error={getFieldError(username)}
          disabled={isSubmitting}
        />
        <Input
          id="password"
          label="Password"
          name="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={setPassword}
          error={getFieldError(password)}
          disabled={isSubmitting}
        />
        {error ? <p className="error-banner">{error}</p> : null}
        <div className={styles.actions}>
          <button type="submit" disabled={!canSubmit}>
            {isSubmitting ? 'Logging in…' : 'Login'}
          </button>
        </div>
      </form>
    </main>
  )
}

export default LoginPage
