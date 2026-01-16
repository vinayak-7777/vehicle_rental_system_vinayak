import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { api } from '../../utils/api'

export default function AdminDashboard() {
  const { token } = useAuth()
  const [stats, setStats] = useState({ vehicles: 0, bookings: 0, users: 0, pendingBookings: 0 })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` }

        const [vehiclesRes, bookingsRes, usersRes] = await Promise.all([
          api.get('/vehicles', { headers }),
          api.get('/bookings', { headers }),
          api.get('/users', { headers }),
        ])

        const bookings = bookingsRes.data.data || []
        const pendingBookings = bookings.filter((b) => b.status === 'Pending').length

        setStats({
          vehicles: vehiclesRes.data.data?.length || 0,
          bookings: bookings.length,
          users: usersRes.data.data?.length || 0,
          pendingBookings,
        })
      } catch (err) {
        console.error('Error fetching stats:', err)
      }
    }

    if (token) fetchStats()
  }, [token])

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Admin Dashboard</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginTop: '2rem' }}>
        <div style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: '4px' }}>
          <h3>Total Vehicles</h3>
          <p style={{ fontSize: '2rem', margin: 0 }}>{stats.vehicles}</p>
          <Link to="/admin/vehicles">Manage Vehicles →</Link>
        </div>

        <div style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: '4px' }}>
          <h3>Total Bookings</h3>
          <p style={{ fontSize: '2rem', margin: 0 }}>{stats.bookings}</p>
          <Link to="/admin/bookings">Manage Bookings →</Link>
        </div>

        <div style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: '4px' }}>
          <h3>Total Users</h3>
          <p style={{ fontSize: '2rem', margin: 0 }}>{stats.users}</p>
          <Link to="/admin/users">Manage Users →</Link>
        </div>

        <div style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: '4px', background: stats.pendingBookings > 0 ? '#fff3cd' : '' }}>
          <h3>Pending Bookings</h3>
          <p style={{ fontSize: '2rem', margin: 0 }}>{stats.pendingBookings}</p>
          <Link to="/admin/bookings">Review Bookings →</Link>
        </div>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h2>Quick Actions</h2>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <Link to="/admin/vehicles" style={{ padding: '0.5rem 1rem', background: '#007bff', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>
            Add New Vehicle
          </Link>
          <Link to="/admin/bookings" style={{ padding: '0.5rem 1rem', background: '#28a745', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>
            View All Bookings
          </Link>
          <Link to="/admin/users" style={{ padding: '0.5rem 1rem', background: '#6c757d', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>
            Manage Users
          </Link>
        </div>
      </div>
    </div>
  )
}
