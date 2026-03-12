import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function ProtectedRoute({ children, requiredRole = null, allowedRoles = null }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <div style={{ padding: '2rem' }}>Loading...</div>
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Check single role requirement
  if (requiredRole && user.role !== requiredRole) {
    return <div style={{ padding: '2rem' }}>Access Denied. You need {requiredRole} role.</div>
  }

  // Check multiple allowed roles
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <div style={{ padding: '2rem' }}>Access Denied. You need one of these roles: {allowedRoles.join(', ')}.</div>
  }

  return children
}
