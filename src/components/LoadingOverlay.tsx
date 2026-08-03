function LoadingOverlay() {
  return (
    <div className="loading-overlay" role="status" aria-live="polite" aria-label="Loading">
      <div className="loading-box">
        <div className="loading-spinner" />
        <p>Loading…</p>
      </div>
    </div>
  )
}

export default LoadingOverlay
