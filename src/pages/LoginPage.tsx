import { useState } from 'react'
import type { SubmitEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../features/auth'
import { useOffline } from '../providers'
import { isNetworkError } from '../utils/errors'

const MIN_LENGTH = 4
const MAX_LENGTH = 30

function isValid(value: string) {
  const length = value.trim().length
  return length >= MIN_LENGTH && length <= MAX_LENGTH
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
      navigate('/table')
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
    <main>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        {error ? <p className="error-banner">{error}</p> : null}
        <button type="submit" disabled={!canSubmit}>
          {isSubmitting ? 'Logging in…' : 'Login'}
        </button>
      </form>
    </main>
  )
}

export default LoginPage
