import { createContext } from 'react'

export type OfflineContextValue = {
  isOfflineModalOpen: boolean
  showOfflineModal: () => void
  hideOfflineModal: () => void
}

export const OfflineContext = createContext<OfflineContextValue | null>(null)
