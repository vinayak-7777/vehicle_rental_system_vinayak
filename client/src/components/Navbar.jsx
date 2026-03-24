import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const navLinkStyle = (isActive) => ({
  textDecoration: 'none',
  color: isActive ? '#F5A623' : 'rgba(255,255,255,0.85)',
  fontWeight: isActive ? '600' : '400',
  fontSize: '0.9rem',
  padding: '0.5rem 0.75rem',
  borderBottom: isActive ? '2px solid #F5A623' : '2px solid transparent',
  transition: 'color 0.2s, border-color 0.2s',
  background: 'transparent',
  whiteSpace: 'nowrap',
  letterSpacing: '0.3px',
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
      padding: '0 2rem',
      background: '#1B3A7A',
      boxShadow: '0 2px 16px rgba(13,30,74,0.4)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '0.75rem',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      minHeight: '60px',
    }}>
      {/* Logo */}
      <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0' }}>
        <span style={{ fontSize: '1.5rem' }}>🚗</span>
        <span style={{ fontWeight: '800', fontSize: '1.15rem', color: '#F5A623', letterSpacing: '1px', textTransform: 'uppercase' }}>Vehicle Rental</span>
        <span style={{ fontWeight: '400', fontSize: '1.15rem', color: 'rgba(255,255,255,0.9)', letterSpacing: '0.5px' }}>System</span>
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
                <span style={{ color: 'rgba(255,255,255,0.3)', margin: '0 0.25rem' }}>|</span>
                <Link to="/admin/dashboard" style={{ ...navLinkStyle(isActive('/admin/dashboard')), color: isActive('/admin/dashboard') ? '#F5A623' : '#ffaaaa' }}>
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
                <span style={{ color: 'rgba(255,255,255,0.3)', margin: '0 0.25rem' }}>|</span>
                <Link to="/fleet-manager/dashboard" style={{ ...navLinkStyle(isActive('/fleet-manager/dashboard')), color: isActive('/fleet-manager/dashboard') ? '#F5A623' : '#aaffcc' }}>
                  Fleet Dashboard
                </Link>
                <Link to="/fleet-manager/transactions" style={navLinkStyle(isActive('/fleet-manager/transactions'))}>Fleet Transactions</Link>
              </>
            )}

            {isAuditor && (
              <>
                <span style={{ color: 'rgba(255,255,255,0.3)', margin: '0 0.25rem' }}>|</span>
                <Link to="/auditor/reports" style={{ ...navLinkStyle(isActive('/auditor/reports')), color: isActive('/auditor/reports') ? '#F5A623' : '#aaddff' }}>
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
                background: 'linear-gradient(135deg, #F5A623, #ffcc70)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#0D1E4A', fontWeight: '800', fontSize: '0.85rem',
              }}>
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <div style={{ lineHeight: '1.2' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: '600', color: 'white' }}>{user.name}</div>
                <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.6)', textTransform: 'capitalize' }}>{user.role}</div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              style={{
                background: 'transparent',
                border: '1.5px solid rgba(255,255,255,0.4)',
                borderRadius: '4px',
                padding: '0.35rem 1rem',
                fontSize: '0.82rem',
                fontWeight: '600',
                color: 'white',
                cursor: 'pointer',
                transition: 'all 0.2s',
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
              }}
              onMouseEnter={e => { e.target.style.borderColor = '#F5A623'; e.target.style.color = '#F5A623' }}
              onMouseLeave={e => { e.target.style.borderColor = 'rgba(255,255,255,0.4)'; e.target.style.color = 'white' }}
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
                color: 'white',
                fontWeight: '600',
                fontSize: '0.82rem',
                padding: '0.4rem 1.1rem',
                border: '1.5px solid rgba(255,255,255,0.5)',
                borderRadius: '4px',
                transition: 'all 0.2s',
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
              }}
            >
              Login
            </Link>
            <Link
              to="/register"
              style={{
                textDecoration: 'none',
                color: '#0D1E4A',
                fontWeight: '700',
                fontSize: '0.82rem',
                padding: '0.4rem 1.1rem',
                background: '#F5A623',
                borderRadius: '4px',
                transition: 'all 0.2s',
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
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


