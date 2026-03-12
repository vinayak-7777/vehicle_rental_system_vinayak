import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { api } from '../../utils/api'

export default function AdminReports() {
  const { token } = useAuth()
  const [bookings, setBookings] = useState([])
  const [vehicles, setVehicles] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState({ from: '', to: '' })
  const [reportType, setReportType] = useState('all') // all, revenue, bookings, usage

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` }
      const [bookingsRes, vehiclesRes, usersRes] = await Promise.all([
        api.get('/bookings', { headers }),
        api.get('/vehicles', { headers }),
        api.get('/users', { headers }),
      ])

      setBookings(bookingsRes.data.data || [])
      setVehicles(vehiclesRes.data.data || [])
      setUsers(usersRes.data.data || [])
    } catch (err) {
      alert('Error fetching data: ' + (err.response?.data?.message || err.message))
    } finally {
      setLoading(false)
    }
  }

  // Filter bookings by date range
  const getFilteredBookings = () => {
    let filtered = bookings

    if (dateRange.from) {
      const fromDate = new Date(dateRange.from)
      filtered = filtered.filter(b => new Date(b.fromDate) >= fromDate)
    }

    if (dateRange.to) {
      const toDate = new Date(dateRange.to)
      toDate.setHours(23, 59, 59)
      filtered = filtered.filter(b => new Date(b.fromDate) <= toDate)
    }

    return filtered
  }

  const filteredBookings = getFilteredBookings()

  // Calculate statistics
  const stats = {
    totalRevenue: filteredBookings
      .filter(b => b.status === 'Completed' || b.status === 'Approved')
      .reduce((sum, b) => sum + (b.totalAmount || 0), 0),
    
    totalBookings: filteredBookings.length,
    
    completedBookings: filteredBookings.filter(b => b.status === 'Completed').length,
    approvedBookings: filteredBookings.filter(b => b.status === 'Approved').length,
    pendingBookings: filteredBookings.filter(b => b.status === 'Pending').length,
    cancelledBookings: filteredBookings.filter(b => b.status === 'Cancelled').length,
    
    averageBookingAmount: filteredBookings.length > 0
      ? filteredBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0) / filteredBookings.length
      : 0,
    
    totalVehicles: vehicles.length,
    availableVehicles: vehicles.filter(v => v.isAvailable).length,
    maintenanceVehicles: vehicles.filter(v => v.conditionStatus === 'Maintenance').length,
    
    totalUsers: users.length,
    activeUsers: new Set(filteredBookings.map(b => b.userID?._id)).size,
  }

  // Vehicle usage report
  const vehicleUsage = {}
  filteredBookings.forEach(booking => {
    const vehicleName = booking.vehicleID?.vehicleName || 'Unknown'
    if (!vehicleUsage[vehicleName]) {
      vehicleUsage[vehicleName] = { count: 0, revenue: 0, category: booking.vehicleID?.category || 'N/A' }
    }
    vehicleUsage[vehicleName].count++
    if (booking.status === 'Completed' || booking.status === 'Approved') {
      vehicleUsage[vehicleName].revenue += booking.totalAmount || 0
    }
  })

  // User activity report
  const userActivity = {}
  filteredBookings.forEach(booking => {
    const userName = booking.userID?.name || 'Unknown'
    if (!userActivity[userName]) {
      userActivity[userName] = { count: 0, totalSpent: 0, email: booking.userID?.email || 'N/A' }
    }
    userActivity[userName].count++
    if (booking.status === 'Completed' || booking.status === 'Approved') {
      userActivity[userName].totalSpent += booking.totalAmount || 0
    }
  })

  // Export to CSV
  const exportToCSV = (data, filename) => {
    if (!data || data.length === 0) {
      alert('No data to export')
      return
    }

    const headers = Object.keys(data[0]).join(',')
    const rows = data.map(item => Object.values(item).join(','))
    const csv = [headers, ...rows].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const exportRevenueReport = () => {
    const reportData = filteredBookings
      .filter(b => b.status === 'Completed' || b.status === 'Approved')
      .map(b => ({
        'Booking ID': b._id.slice(-6),
        'Date': new Date(b.fromDate).toLocaleDateString(),
        'Vehicle': b.vehicleID?.vehicleName || 'N/A',
        'Customer': b.userID?.name || 'N/A',
        'Amount': `$${b.totalAmount}`,
        'Status': b.status,
      }))
    exportToCSV(reportData, `revenue-report-${new Date().toISOString().split('T')[0]}.csv`)
  }

  const exportBookingReport = () => {
    const reportData = filteredBookings.map(b => ({
      'Booking ID': b._id.slice(-6),
      'Customer': b.userID?.name || 'N/A',
      'Email': b.userID?.email || 'N/A',
      'Vehicle': b.vehicleID?.vehicleName || 'N/A',
      'From Date': new Date(b.fromDate).toLocaleDateString(),
      'To Date': new Date(b.toDate).toLocaleDateString(),
      'Amount': `$${b.totalAmount}`,
      'Status': b.status,
      'Created': new Date(b.createdAt).toLocaleString(),
    }))
    exportToCSV(reportData, `booking-report-${new Date().toISOString().split('T')[0]}.csv`)
  }

  if (loading) return <div style={{ padding: '2rem' }}>Loading...</div>

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Admin Reports</h1>

      {/* Filters */}
      <div style={{ marginTop: '1rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '4px', background: '#f8f9fa' }}>
        <h3>Filters</h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'end' }}>
          <div>
            <label>Report Type: </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              style={{ padding: '0.5rem', marginLeft: '0.5rem' }}
            >
              <option value="all">All Reports</option>
              <option value="revenue">Revenue Report</option>
              <option value="bookings">Booking Report</option>
              <option value="usage">Usage Report</option>
            </select>
          </div>
          <div>
            <label>From Date: </label>
            <input
              type="date"
              value={dateRange.from}
              onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
              style={{ padding: '0.5rem', marginLeft: '0.5rem' }}
            />
          </div>
          <div>
            <label>To Date: </label>
            <input
              type="date"
              value={dateRange.to}
              onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
              style={{ padding: '0.5rem', marginLeft: '0.5rem' }}
            />
          </div>
          <button
            onClick={() => setDateRange({ from: '', to: '' })}
            style={{ padding: '0.5rem 1rem', background: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Revenue Statistics */}
      {(reportType === 'all' || reportType === 'revenue') && (
        <div style={{ marginTop: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2>Revenue Report</h2>
            <button
              onClick={exportRevenueReport}
              style={{ padding: '0.5rem 1rem', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              Export CSV
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
            <div style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: '4px', background: '#d4edda' }}>
              <h3>Total Revenue</h3>
              <p style={{ fontSize: '2rem', margin: 0 }}>${stats.totalRevenue.toFixed(2)}</p>
              <small>From completed & approved bookings</small>
            </div>
            <div style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: '4px' }}>
              <h3>Completed Bookings</h3>
              <p style={{ fontSize: '2rem', margin: 0 }}>{stats.completedBookings}</p>
            </div>
            <div style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: '4px' }}>
              <h3>Approved Bookings</h3>
              <p style={{ fontSize: '2rem', margin: 0 }}>{stats.approvedBookings}</p>
            </div>
            <div style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: '4px' }}>
              <h3>Average Booking</h3>
              <p style={{ fontSize: '2rem', margin: 0 }}>${stats.averageBookingAmount.toFixed(2)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Booking Statistics */}
      {(reportType === 'all' || reportType === 'bookings') && (
        <div style={{ marginTop: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2>Booking Report</h2>
            <button
              onClick={exportBookingReport}
              style={{ padding: '0.5rem 1rem', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              Export CSV
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: '4px' }}>
              <h3>Total Bookings</h3>
              <p style={{ fontSize: '2rem', margin: 0 }}>{stats.totalBookings}</p>
            </div>
            <div style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: '4px', background: '#fff3cd' }}>
              <h3>Pending</h3>
              <p style={{ fontSize: '2rem', margin: 0 }}>{stats.pendingBookings}</p>
            </div>
            <div style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: '4px', background: '#d1ecf1' }}>
              <h3>Approved</h3>
              <p style={{ fontSize: '2rem', margin: 0 }}>{stats.approvedBookings}</p>
            </div>
            <div style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: '4px', background: '#f8d7da' }}>
              <h3>Cancelled</h3>
              <p style={{ fontSize: '2rem', margin: 0 }}>{stats.cancelledBookings}</p>
            </div>
          </div>
        </div>
      )}

      {/* Usage Report */}
      {(reportType === 'all' || reportType === 'usage') && (
        <div style={{ marginTop: '2rem' }}>
          <h2>Usage Report</h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginTop: '1rem', marginBottom: '2rem' }}>
            <div style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: '4px' }}>
              <h3>Total Vehicles</h3>
              <p style={{ fontSize: '2rem', margin: 0 }}>{stats.totalVehicles}</p>
            </div>
            <div style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: '4px', background: '#d4edda' }}>
              <h3>Available</h3>
              <p style={{ fontSize: '2rem', margin: 0 }}>{stats.availableVehicles}</p>
            </div>
            <div style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: '4px', background: '#fff3cd' }}>
              <h3>Under Maintenance</h3>
              <p style={{ fontSize: '2rem', margin: 0 }}>{stats.maintenanceVehicles}</p>
            </div>
          </div>

          {/* Vehicle Usage Table */}
          <h3>Vehicle Usage Statistics</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #ddd', background: '#f8f9fa' }}>
                <th style={{ padding: '0.75rem', textAlign: 'left' }}>Vehicle Name</th>
                <th style={{ padding: '0.75rem', textAlign: 'left' }}>Category</th>
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
                    <td style={{ padding: '0.75rem' }}>{data.category}</td>
                    <td style={{ padding: '0.75rem' }}>{data.count}</td>
                    <td style={{ padding: '0.75rem' }}>${data.revenue.toFixed(2)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
          {Object.keys(vehicleUsage).length === 0 && <p style={{ marginTop: '1rem' }}>No booking data available.</p>}

          {/* User Activity Table */}
          <h3 style={{ marginTop: '2rem' }}>User Activity Statistics</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #ddd', background: '#f8f9fa' }}>
                <th style={{ padding: '0.75rem', textAlign: 'left' }}>User Name</th>
                <th style={{ padding: '0.75rem', textAlign: 'left' }}>Email</th>
                <th style={{ padding: '0.75rem', textAlign: 'left' }}>Total Bookings</th>
                <th style={{ padding: '0.75rem', textAlign: 'left' }}>Total Spent</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(userActivity)
                .sort((a, b) => b[1].totalSpent - a[1].totalSpent)
                .map(([userName, data]) => (
                  <tr key={userName} style={{ borderBottom: '1px solid #ddd' }}>
                    <td style={{ padding: '0.75rem' }}>{userName}</td>
                    <td style={{ padding: '0.75rem' }}>{data.email}</td>
                    <td style={{ padding: '0.75rem' }}>{data.count}</td>
                    <td style={{ padding: '0.75rem' }}>${data.totalSpent.toFixed(2)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
          {Object.keys(userActivity).length === 0 && <p style={{ marginTop: '1rem' }}>No user activity data available.</p>}
        </div>
      )}
    </div>
  )
}
