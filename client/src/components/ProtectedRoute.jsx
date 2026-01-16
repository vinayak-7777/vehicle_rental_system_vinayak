import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function ProtectedRoute({ children, requiredRole = null }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <div style={{ padding: '2rem' }}>Loading...</div>
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (requiredRole && user.role !== requiredRole) {
    return <div style={{ padding: '2rem' }}>Access Denied. You need {requiredRole} role.</div>
  }

  return children
}
