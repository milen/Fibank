import { useState, type ReactNode } from 'react'
import { loginRequest } from './api'
import { AuthContext } from './auth-context'
import { clearSession, getSession, saveSession } from './session'
import type { AuthSession } from './types'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(() => getSession())

  async function login(username: string, password: string) {
    const nextSession = await loginRequest(username, password)
    saveSession(nextSession)
    setSession(nextSession)
  }

  function logout() {
    clearSession()
    setSession(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user: session?.user ?? null,
        isAuthenticated: session !== null,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
