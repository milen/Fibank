import type { ReactNode } from 'react'
import { AuthProvider } from '../features/auth'
import OfflineModal from '../components/OfflineModal'
import { OfflineProvider } from './OfflineProvider'

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <OfflineProvider>
        {children}
        <OfflineModal />
      </OfflineProvider>
    </AuthProvider>
  )
}
