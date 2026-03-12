import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { api } from '../../utils/api'

export default function AuditorReports() {
  const { token } = useAuth()
  const [bookings, setBookings] = useState([])
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalBookings: 0,
    completedBookings: 0,
    pendingBookings: 0,
    approvedBookings: 0,
    cancelledBookings: 0,
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` }
      const [bookingsRes, vehiclesRes] = await Promise.all([
        api.get('/bookings', { headers }),
        api.get('/vehicles', { headers }),
      ])

      const bookingsData = bookingsRes.data.data || []
      setBookings(bookingsData)
      setVehicles(vehiclesRes.data.data || [])

      // Calculate stats
      const totalRevenue = bookingsData
        .filter(b => b.status === 'Completed' || b.status === 'Approved')
        .reduce((sum, b) => sum + (b.totalAmount || 0), 0)

      const stats = {
        totalRevenue,
        totalBookings: bookingsData.length,
        completedBookings: bookingsData.filter(b => b.status === 'Completed').length,
        pendingBookings: bookingsData.filter(b => b.status === 'Pending').length,
        approvedBookings: bookingsData.filter(b => b.status === 'Approved').length,
        cancelledBookings: bookingsData.filter(b => b.status === 'Cancelled').length,
      }

      setStats(stats)
    } catch (err) {
      alert('Error fetching data: ' + (err.response?.data?.message || err.message))
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div style={{ padding: '2rem' }}>Loading...</div>

  const statusColors = {
    Pending: '#ffc107',
    Approved: '#28a745',
    Completed: '#007bff',
    Cancelled: '#dc3545',
  }

  // Group bookings by vehicle for usage report
  const vehicleUsage = {}
  bookings.forEach(booking => {
    const vehicleName = booking.vehicleID?.vehicleName || 'Unknown'
    if (!vehicleUsage[vehicleName]) {
      vehicleUsage[vehicleName] = { count: 0, revenue: 0 }
    }
    vehicleUsage[vehicleName].count++
    if (booking.status === 'Completed' || booking.status === 'Approved') {
      vehicleUsage[vehicleName].revenue += booking.totalAmount || 0
    }
  })

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Auditor Reports (Read-Only)</h1>
      <p style={{ color: '#6c757d', fontStyle: 'italic' }}>You have read-only access to reports and statistics.</p>

      {/* Revenue & Booking Statistics */}
      <div style={{ marginTop: '2rem' }}>
        <h2>Revenue & Booking Statistics</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginTop: '1rem' }}>
          <div style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: '4px', background: '#d4edda' }}>
            <h3>Total Revenue</h3>
            <p style={{ fontSize: '2rem', margin: 0 }}>${stats.totalRevenue.toFixed(2)}</p>
            <small>From completed and approved bookings</small>
          </div>
          <div style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: '4px' }}>
            <h3>Total Bookings</h3>
            <p style={{ fontSize: '2rem', margin: 0 }}>{stats.totalBookings}</p>
          </div>
          <div style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: '4px' }}>
            <h3>Completed Bookings</h3>
            <p style={{ fontSize: '2rem', margin: 0 }}>{stats.completedBookings}</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginTop: '1rem' }}>
          <div style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: '4px', background: '#fff3cd' }}>
            <h3>Pending Bookings</h3>
            <p style={{ fontSize: '2rem', margin: 0 }}>{stats.pendingBookings}</p>
          </div>
          <div style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: '4px', background: '#d1ecf1' }}>
            <h3>Approved Bookings</h3>
            <p style={{ fontSize: '2rem', margin: 0 }}>{stats.approvedBookings}</p>
          </div>
          <div style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: '4px', background: '#f8d7da' }}>
            <h3>Cancelled Bookings</h3>
            <p style={{ fontSize: '2rem', margin: 0 }}>{stats.cancelledBookings}</p>
          </div>
        </div>
      </div>

      {/* Vehicle Usage Report */}
      <div style={{ marginTop: '2rem' }}>
        <h2>Vehicle Usage Report</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #ddd', background: '#f8f9fa' }}>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Vehicle Name</th>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Total Bookings</th>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Revenue Generated</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(vehicleUsage)
              .sort((a, b) => b[1].revenue - a[1].revenue)
              .map(([vehicleName, data]) => (
                <tr key={vehicleName} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '0.75rem' }}>{vehicleName}</td>
                  <td style={{ padding: '0.75rem' }}>{data.count}</td>
                  <td style={{ padding: '0.75rem' }}>${data.revenue.toFixed(2)}</td>
                </tr>
              ))}
          </tbody>
        </table>
        {Object.keys(vehicleUsage).length === 0 && <p>No booking data available.</p>}
      </div>

      {/* Booking Reports */}
      <div style={{ marginTop: '2rem' }}>
        <h2>All Bookings Report</h2>
        <div style={{ marginTop: '1rem', maxHeight: '500px', overflowY: 'auto' }}>
          {bookings.map((booking) => (
            <div
              key={booking._id}
              style={{
                border: '1px solid #ddd',
                padding: '1rem',
                marginBottom: '1rem',
                borderRadius: '4px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div>
                  <h3>Booking #{booking._id.slice(-6)}</h3>
                  <p><strong>User:</strong> {booking.userID?.name || 'N/A'} ({booking.userID?.email || 'N/A'})</p>
                  <p><strong>Vehicle:</strong> {booking.vehicleID?.vehicleName || 'N/A'} - {booking.vehicleID?.category || 'N/A'}</p>
                  <p><strong>Dates:</strong> {new Date(booking.fromDate).toLocaleDateString()} to {new Date(booking.toDate).toLocaleDateString()}</p>
                  <p><strong>Total Amount:</strong> ${booking.totalAmount}</p>
                  <p>
                    <strong>Status:</strong>{' '}
                    <span
                      style={{
                        background: statusColors[booking.status] || '#ccc',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px',
                        color: 'white',
                      }}
                    >
                      {booking.status}
                    </span>
                  </p>
                  <p><strong>Created:</strong> {new Date(booking.createdAt).toLocaleString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        {bookings.length === 0 && <p>No bookings found.</p>}
      </div>
    </div>
  )
}
