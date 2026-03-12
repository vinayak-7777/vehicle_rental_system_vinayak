export function ErrorMessage({ message, onRetry = null }) {
  return (
    <div className="alert alert-error">
      <strong>Error:</strong> {message}
      {onRetry && (
        <button
          onClick={onRetry}
          className="btn btn-primary"
          style={{ marginLeft: '1rem', marginTop: '0.5rem' }}
        >
          Retry
        </button>
      )}
    </div>
  )
}
