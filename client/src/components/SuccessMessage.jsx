export function SuccessMessage({ message, onDismiss = null }) {
  return (
    <div className="alert alert-success">
      {message}
      {onDismiss && (
        <button
          onClick={onDismiss}
          style={{ float: 'right', background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }}
        >
          ×
        </button>
      )}
    </div>
  )
}
