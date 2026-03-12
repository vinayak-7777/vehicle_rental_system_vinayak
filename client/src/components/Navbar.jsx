import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const navLinkStyle = (isActive) => ({
  textDecoration: 'none',
  color: isActive ? '#5B3DF5' : '#374151',
  fontWeight: isActive ? '600' : '500',
  fontSize: '0.9rem',
  padding: '0.4rem 0.75rem',
  borderRadius: '6px',
  transition: 'color 0.2s, background 0.2s',
  background: isActive ? 'rgba(91,61,245,0.08)' : 'transparent',
  whiteSpace: 'nowrap',
})

export function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const isAdmin = user && (user.role === 'admin' || user.role?.toLowerCase() === 'admin')
  const isFleetManager = user && (user.role === 'fleetManager' || user.role?.toLowerCase() === 'fleetmanager')
  const isAuditor = user && (user.role === 'auditor' || user.role?.toLowerCase() === 'auditor')

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/')

  return (
    <nav style={{
      padding: '0.75rem 2rem',
      background: '#ffffff',
      boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '0.75rem',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      {/* Logo */}
      <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span style={{ fontSize: '1.4rem' }}>🚗</span>
<span style={{ fontWeight: '700', fontSize: '1.1rem', color: '#1a1a2e' }}>Vehicle Rental System</span>
      </Link>

      {/* Nav Links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', flexWrap: 'wrap' }}>
        <Link to="/vehicles" style={navLinkStyle(isActive('/vehicles'))}>Vehicles</Link>

        {user && (
          <>
            <Link to="/my-bookings" style={navLinkStyle(isActive('/my-bookings'))}>My Bookings</Link>
            <Link to="/my-transactions" style={navLinkStyle(isActive('/my-transactions'))}>My Transactions</Link>

            {isAdmin && (
              <>
                <span style={{ color: '#E5E7EB', margin: '0 0.25rem' }}>|</span>
                <Link to="/admin/dashboard" style={{ ...navLinkStyle(isActive('/admin/dashboard')), color: isActive('/admin/dashboard') ? '#5B3DF5' : '#dc3545' }}>
                  Admin
                </Link>
                <Link to="/admin/vehicles" style={navLinkStyle(isActive('/admin/vehicles'))}>Vehicles</Link>
                <Link to="/admin/bookings" style={navLinkStyle(isActive('/admin/bookings'))}>Bookings</Link>
                <Link to="/admin/users" style={navLinkStyle(isActive('/admin/users'))}>Users</Link>
                <Link to="/admin/reports" style={navLinkStyle(isActive('/admin/reports'))}>Reports</Link>
                <Link to="/admin/transactions" style={navLinkStyle(isActive('/admin/transactions'))}>Transactions</Link>
              </>
            )}

            {isFleetManager && (
              <>
                <span style={{ color: '#E5E7EB', margin: '0 0.25rem' }}>|</span>
                <Link to="/fleet-manager/dashboard" style={{ ...navLinkStyle(isActive('/fleet-manager/dashboard')), color: isActive('/fleet-manager/dashboard') ? '#5B3DF5' : '#28a745' }}>
                  Fleet Dashboard
                </Link>
                <Link to="/fleet-manager/transactions" style={navLinkStyle(isActive('/fleet-manager/transactions'))}>Fleet Transactions</Link>
              </>
            )}

            {isAuditor && (
              <>
                <span style={{ color: '#E5E7EB', margin: '0 0.25rem' }}>|</span>
                <Link to="/auditor/reports" style={{ ...navLinkStyle(isActive('/auditor/reports')), color: isActive('/auditor/reports') ? '#5B3DF5' : '#17a2b8' }}>
                  Auditor Reports
                </Link>
                <Link to="/auditor/payments" style={navLinkStyle(isActive('/auditor/payments'))}>Payments</Link>
              </>
            )}
          </>
        )}
      </div>

      {/* Right side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {user ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{
                width: '34px', height: '34px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #5B3DF5, #7C60FF)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontWeight: '700', fontSize: '0.85rem',
              }}>
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <div style={{ lineHeight: '1.2' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: '600', color: '#1a1a2e' }}>{user.name}</div>
                <div style={{ fontSize: '0.72rem', color: '#6B7280', textTransform: 'capitalize' }}>{user.role}</div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              style={{
                background: 'transparent',
                border: '1.5px solid #E5E7EB',
                borderRadius: '6px',
                padding: '0.35rem 0.85rem',
                fontSize: '0.85rem',
                fontWeight: '500',
                color: '#374151',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.target.style.borderColor = '#5B3DF5'; e.target.style.color = '#5B3DF5' }}
              onMouseLeave={e => { e.target.style.borderColor = '#E5E7EB'; e.target.style.color = '#374151' }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              style={{
                textDecoration: 'none',
                color: '#5B3DF5',
                fontWeight: '500',
                fontSize: '0.9rem',
                padding: '0.4rem 0.85rem',
                border: '1.5px solid #5B3DF5',
                borderRadius: '6px',
                transition: 'all 0.2s',
              }}
            >
              Login
            </Link>
            <Link
              to="/register"
              style={{
                textDecoration: 'none',
                color: 'white',
                fontWeight: '500',
                fontSize: '0.9rem',
                padding: '0.4rem 0.85rem',
                background: '#5B3DF5',
                borderRadius: '6px',
                transition: 'all 0.2s',
              }}
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}


