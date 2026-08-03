import { createContext, useContext, useState, type ReactNode } from 'react'
import { loginRequest } from './api'
import { clearSession, getSession, saveSession } from './session'
import type { AuthSession, AuthUser } from './types'

type AuthContextValue = {
  user: AuthUser | null
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

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

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
