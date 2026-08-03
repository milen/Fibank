import { createContext, useContext, useRef, useState, type ReactNode } from 'react'

type OfflineContextValue = {
  isOfflineModalOpen: boolean
  showOfflineModal: () => void
  hideOfflineModal: () => void
}

const OfflineContext = createContext<OfflineContextValue | null>(null)

export function OfflineProvider({ children }: { children: ReactNode }) {
  const [isOfflineModalOpen, setIsOfflineModalOpen] = useState(false)
  const apiRef = useRef({
    showOfflineModal: () => setIsOfflineModalOpen(true),
    hideOfflineModal: () => setIsOfflineModalOpen(false),
  })

  return (
    <OfflineContext.Provider
      value={{
        isOfflineModalOpen,
        showOfflineModal: apiRef.current.showOfflineModal,
        hideOfflineModal: apiRef.current.hideOfflineModal,
      }}
    >
      {children}
    </OfflineContext.Provider>
  )
}

export function useOffline() {
  const context = useContext(OfflineContext)
  if (!context) {
    throw new Error('useOffline must be used within OfflineProvider')
  }
  return context
}
