import styles from './styles.module.scss'

function LoadingOverlay() {
  return (
    <div className={styles.overlay} role="status" aria-live="polite" aria-label="Loading">
      <div className={styles.box}>
        <div className={styles.loader} />
      </div>
    </div>
  )
}

export default LoadingOverlay
