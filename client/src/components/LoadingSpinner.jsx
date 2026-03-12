export function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p style={{ marginTop: '1rem', color: '#666' }}>{message}</p>
    </div>
  )
}
