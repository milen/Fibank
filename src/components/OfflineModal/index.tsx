import { X } from 'lucide-react'
import offlineImage from '../../assets/offline.png?inline'
import { useOffline } from '../../providers'
import Button from '../Button'
import Modal from '../Modal'
import styles from './styles.module.scss'

function OfflineModal() {
  const { isOfflineModalOpen, hideOfflineModal } = useOffline()

  return (
    <Modal
      open={isOfflineModalOpen}
      title="Connection lost"
      type="danger"
      className={styles.modal}
      onClose={hideOfflineModal}
    >
      <img src={offlineImage} alt="No internet connection" width={100} height={100} />
      <p>Your internet connection appears to be down. Check your network and try again.</p>
      <Button type="danger" icon={X} onClick={hideOfflineModal}>
        Close
      </Button>
    </Modal>
  )
}

export default OfflineModal
