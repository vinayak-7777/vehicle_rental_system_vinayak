import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav style={{ padding: '1rem', borderBottom: '1px solid #ddd', marginBottom: '1rem' }}>
      <Link to="/" style={{ marginRight: '1rem' }}>
        Vehicles
      </Link>

      {user && (
        <>
          <Link to="/my-bookings" style={{ marginRight: '1rem' }}>
            My Bookings
          </Link>
          {user.role === 'admin' && (
            <>
              <Link to="/admin/dashboard" style={{ marginRight: '1rem' }}>
                Admin Dashboard
              </Link>
              <Link to="/admin/vehicles" style={{ marginRight: '1rem' }}>
                Manage Vehicles
              </Link>
              <Link to="/admin/bookings" style={{ marginRight: '1rem' }}>
                Manage Bookings
              </Link>
              <Link to="/admin/users" style={{ marginRight: '1rem' }}>
                Manage Users
              </Link>
            </>
          )}
        </>
      )}

      <span style={{ float: 'right' }}>
        {user ? (
          <>
            <span style={{ marginRight: '0.5rem' }}>{user.name} ({user.role})</span>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ marginRight: '0.5rem' }}>
              Login
            </Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </span>
    </nav>
  )
}


