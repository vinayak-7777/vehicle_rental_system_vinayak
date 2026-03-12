import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { api } from '../../utils/api'
import { LoadingSpinner } from '../../components/LoadingSpinner'
import { ErrorMessage } from '../../components/ErrorMessage'

export default function AdminDashboard() {
  const { token } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [stats, setStats] = useState({
    vehicles: 0,
    bookings: 0,
    users: 0,
    pendingBookings: 0,
    approvedBookings: 0,
    completedBookings: 0,
    cancelledBookings: 0,
    totalRevenue: 0,
    availableVehicles: 0,
    maintenanceVehicles: 0,
    activeUsers: 0,
  })

  const fetchStats = async () => {
    try {
      setError('')
      setLoading(true)
      const headers = { Authorization: `Bearer ${token}` }

      const [vehiclesRes, bookingsRes, usersRes] = await Promise.all([
        api.get('/vehicles', { headers }),
        api.get('/bookings', { headers }),
        api.get('/users', { headers }),
      ])

      const bookings = bookingsRes.data.data || []
      const vehicles = vehiclesRes.data.data || []
      const users = usersRes.data.data || []

      const totalRevenue = bookings
        .filter(b => b.status === 'Completed' || b.status === 'Approved')
        .reduce((sum, b) => sum + (b.totalAmount || 0), 0)

      const activeUsers = new Set(bookings.map(b => b.userID?._id)).size

      setStats({
        vehicles: vehicles.length,
        bookings: bookings.length,
        users: users.length,
        pendingBookings: bookings.filter((b) => b.status === 'Pending').length,
        approvedBookings: bookings.filter((b) => b.status === 'Approved').length,
        completedBookings: bookings.filter((b) => b.status === 'Completed').length,
        cancelledBookings: bookings.filter((b) => b.status === 'Cancelled').length,
        totalRevenue,
        availableVehicles: vehicles.filter(v => v.isAvailable).length,
        maintenanceVehicles: vehicles.filter(v => v.conditionStatus === 'Maintenance').length,
        activeUsers,
      })
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard statistics')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) fetchStats()
  }, [token])

  if (loading) return <LoadingSpinner message="Loading dashboard..." />
  if (error) return <ErrorMessage message={error} onRetry={fetchStats} />

  return (
    <div className="container">
      <h1>Admin Dashboard</h1>

      {/* Main Statistics */}
      <div className="grid grid-4" style={{ marginTop: '2rem' }}>
        <div className="card" style={{ background: stats.pendingBookings > 0 ? '#fff3cd' : 'white' }}>
          <h3>Total Vehicles</h3>
          <p style={{ fontSize: '2.5rem', margin: '0.5rem 0', fontWeight: 'bold', color: '#007bff' }}>{stats.vehicles}</p>
          <p style={{ margin: '0.5rem 0', color: '#666' }}>
            Available: <strong>{stats.availableVehicles}</strong> | Maintenance: <strong>{stats.maintenanceVehicles}</strong>
          </p>
          <Link to="/admin/vehicles" className="btn btn-primary" style={{ marginTop: '1rem', textDecoration: 'none' }}>
            Manage Vehicles →
          </Link>
        </div>

        <div className="card">
          <h3>Total Bookings</h3>
          <p style={{ fontSize: '2.5rem', margin: '0.5rem 0', fontWeight: 'bold', color: '#28a745' }}>{stats.bookings}</p>
          <p style={{ margin: '0.5rem 0', color: '#666' }}>
            Completed: <strong>{stats.completedBookings}</strong> | Approved: <strong>{stats.approvedBookings}</strong>
          </p>
          <Link to="/admin/bookings" className="btn btn-success" style={{ marginTop: '1rem', textDecoration: 'none' }}>
            Manage Bookings →
          </Link>
        </div>

        <div className="card">
          <h3>Total Users</h3>
          <p style={{ fontSize: '2.5rem', margin: '0.5rem 0', fontWeight: 'bold', color: '#6c757d' }}>{stats.users}</p>
          <p style={{ margin: '0.5rem 0', color: '#666' }}>
            Active Users: <strong>{stats.activeUsers}</strong>
          </p>
          <Link to="/admin/users" className="btn btn-secondary" style={{ marginTop: '1rem', textDecoration: 'none' }}>
            Manage Users →
          </Link>
        </div>

        <div className="card" style={{ background: stats.pendingBookings > 0 ? '#fff3cd' : 'white' }}>
          <h3>Pending Bookings</h3>
          <p style={{ fontSize: '2.5rem', margin: '0.5rem 0', fontWeight: 'bold', color: '#ffc107' }}>{stats.pendingBookings}</p>
          <p style={{ margin: '0.5rem 0', color: '#666' }}>
            Requires attention
          </p>
          <Link to="/admin/bookings" className="btn btn-warning" style={{ marginTop: '1rem', textDecoration: 'none' }}>
            Review Bookings →
          </Link>
        </div>
      </div>

      {/* Revenue Statistics */}
      <div style={{ marginTop: '2rem' }}>
        <h2>Revenue Overview</h2>
        <div className="grid grid-3" style={{ marginTop: '1rem' }}>
          <div className="card" style={{ background: '#d4edda' }}>
            <h3>Total Revenue</h3>
            <p style={{ fontSize: '2.5rem', margin: '0.5rem 0', fontWeight: 'bold', color: '#28a745' }}>
              ₹{stats.totalRevenue.toFixed(2)}
            </p>
            <p style={{ margin: '0.5rem 0', color: '#666' }}>From completed & approved bookings</p>
          </div>
          <div className="card">
            <h3>Completed Bookings</h3>
            <p style={{ fontSize: '2.5rem', margin: '0.5rem 0', fontWeight: 'bold', color: '#007bff' }}>
              {stats.completedBookings}
            </p>
            <p style={{ margin: '0.5rem 0', color: '#666' }}>Successfully completed</p>
          </div>
          <div className="card" style={{ background: '#f8d7da' }}>
            <h3>Cancelled Bookings</h3>
            <p style={{ fontSize: '2.5rem', margin: '0.5rem 0', fontWeight: 'bold', color: '#dc3545' }}>
              {stats.cancelledBookings}
            </p>
            <p style={{ margin: '0.5rem 0', color: '#666' }}>Lost revenue</p>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h2>Quick Actions</h2>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
          <Link to="/admin/vehicles" className="btn btn-primary" style={{ textDecoration: 'none' }}>
            Add New Vehicle
          </Link>
          <Link to="/admin/bookings" className="btn btn-success" style={{ textDecoration: 'none' }}>
            View All Bookings
          </Link>
          <Link to="/admin/users" className="btn btn-secondary" style={{ textDecoration: 'none' }}>
            Manage Users
          </Link>
          <Link to="/admin/reports" className="btn" style={{ background: '#17a2b8', color: 'white', textDecoration: 'none' }}>
            Generate Reports
          </Link>
        </div>
      </div>
    </div>
  )
}
