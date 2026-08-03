import { useState, type ReactNode } from 'react'
import { OfflineContext } from './offline-context'

export function OfflineProvider({ children }: { children: ReactNode }) {
  const [isOfflineModalOpen, setIsOfflineModalOpen] = useState(false)

  return (
    <OfflineContext.Provider
      value={{
        isOfflineModalOpen,
        showOfflineModal: () => setIsOfflineModalOpen(true),
        hideOfflineModal: () => setIsOfflineModalOpen(false),
      }}
    >
      {children}
    </OfflineContext.Provider>
  )
}
