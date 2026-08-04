import styles from './styles.module.scss'

function LoadingOverlay() {
  return (
    <div className={styles.overlay} role="status" aria-live="polite" aria-label="Loading">
      <div className={styles.box}>
        <div className={styles.spinner} />
        <p>Loading…</p>
      </div>
    </div>
  )
}

export default LoadingOverlay
