import offlineImage from '../../assets/offline.png?inline'
import { useOffline } from '../../providers'
import Card from '../Card'
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
      <Card title="Connection lost" type="danger" className={styles.modal}>
        <img src={offlineImage} alt="No internet connection" width={100} height={100} />
        <p>Your internet connection appears to be down. Check your network and try again.</p>
        <button type="button" onClick={hideOfflineModal}>
          Close
        </button>
      </Card>
    </div>
  )
}

export default OfflineModal
