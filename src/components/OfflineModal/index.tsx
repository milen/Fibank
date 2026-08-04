import { useOffline } from '../../providers'
import styles from './styles.module.scss'

function OfflineModal() {
  const { isOfflineModalOpen, hideOfflineModal } = useOffline()

  if (!isOfflineModalOpen) {
    return null
  }

  return (
    <div
      className={styles.backdrop}
      role="dialog"
      aria-modal="true"
      aria-labelledby="offline-modal-title"
    >
      <div className={styles.modal}>
        <img src="/offline.svg" alt="No internet connection" width={160} height={160} />
        <h2 id="offline-modal-title">Connection lost</h2>
        <p>Your internet connection appears to be down. Check your network and try again.</p>
        <button type="button" onClick={hideOfflineModal}>
          Close
        </button>
      </div>
    </div>
  )
}

export default OfflineModal
