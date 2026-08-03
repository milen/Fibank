import { createContext } from 'react'
import type { AuthUser } from './types'

export type AuthContextValue = {
  user: AuthUser | null
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)
