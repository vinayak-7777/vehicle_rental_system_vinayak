import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { api } from '../../utils/api'

export default function BookingManagement() {
  const { token } = useAuth()
  const [bookings, setBookings] = useState([])
  const [filteredBookings, setFilteredBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState({ from: '', to: '' })

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      const res = await api.get('/bookings', {
        headers: { Authorization: `Bearer ${token}` },
      })
      setBookings(res.data.data || [])
      setFilteredBookings(res.data.data || [])
    } catch (err) {
      alert('Error fetching bookings: ' + (err.response?.data?.message || err.message))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let filtered = bookings

    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (b) =>
          b.userID?.name?.toLowerCase().includes(searchLower) ||
          b.userID?.email?.toLowerCase().includes(searchLower) ||
          b.vehicleID?.vehicleName?.toLowerCase().includes(searchLower) ||
          b._id.toLowerCase().includes(searchLower)
      )
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((b) => b.status === statusFilter)
    }

    // Date filter
    if (dateFilter.from) {
      const fromDate = new Date(dateFilter.from)
      filtered = filtered.filter((b) => new Date(b.fromDate) >= fromDate)
    }

    if (dateFilter.to) {
      const toDate = new Date(dateFilter.to)
      toDate.setHours(23, 59, 59)
      filtered = filtered.filter((b) => new Date(b.fromDate) <= toDate)
    }

    setFilteredBookings(filtered)
  }, [bookings, searchTerm, statusFilter, dateFilter])

  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      await api.put(
        `/bookings/${bookingId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      alert('Booking status updated!')
      fetchBookings()
    } catch (err) {
      alert('Error: ' + (err.response?.data?.message || err.message))
    }
  }

  if (loading) return <div style={{ padding: '2rem' }}>Loading...</div>

  const statusColors = {
    Pending: '#ffc107',
    Approved: '#28a745',
    Completed: '#007bff',
    Cancelled: '#dc3545',
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Booking Management</h1>
      <p>Total Bookings: {bookings.length} | Filtered: {filteredBookings.length}</p>

      {/* Search and Filters */}
      <div style={{ marginTop: '1rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '4px', background: '#f8f9fa' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'end' }}>
          <div>
            <label>Search: </label>
            <input
              type="text"
              placeholder="Search by user, email, vehicle, or booking ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ padding: '0.5rem', width: '300px', marginLeft: '0.5rem' }}
            />
          </div>
          <div>
            <label>Status: </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ padding: '0.5rem', marginLeft: '0.5rem' }}
            >
              <option value="all">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label>From Date: </label>
            <input
              type="date"
              value={dateFilter.from}
              onChange={(e) => setDateFilter({ ...dateFilter, from: e.target.value })}
              style={{ padding: '0.5rem', marginLeft: '0.5rem' }}
            />
          </div>
          <div>
            <label>To Date: </label>
            <input
              type="date"
              value={dateFilter.to}
              onChange={(e) => setDateFilter({ ...dateFilter, to: e.target.value })}
              style={{ padding: '0.5rem', marginLeft: '0.5rem' }}
            />
          </div>
          <button
            onClick={() => {
              setSearchTerm('')
              setStatusFilter('all')
              setDateFilter({ from: '', to: '' })
            }}
            style={{ padding: '0.5rem 1rem', background: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Clear Filters
          </button>
        </div>
      </div>

      <div style={{ marginTop: '1rem' }}>
        {filteredBookings.map((booking) => (
          <div key={booking._id} style={{ border: '1px solid #ddd', padding: '1rem', marginBottom: '1rem', borderRadius: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div>
                <h3>Booking #{booking._id.slice(-6)}</h3>
                <p><strong>User:</strong> {booking.userID?.name || 'N/A'} ({booking.userID?.email || 'N/A'})</p>
                <p><strong>Vehicle:</strong> {booking.vehicleID?.vehicleName || 'N/A'} - {booking.vehicleID?.category || 'N/A'}</p>
                <p><strong>Dates:</strong> {new Date(booking.fromDate).toLocaleDateString()} to {new Date(booking.toDate).toLocaleDateString()}</p>
                <p><strong>Total Amount:</strong> ${booking.totalAmount}</p>
                <p><strong>Status:</strong> <span style={{ background: statusColors[booking.status] || '#ccc', padding: '0.25rem 0.5rem', borderRadius: '4px', color: 'white' }}>{booking.status}</span></p>
                <p><strong>Created:</strong> {new Date(booking.createdAt).toLocaleString()}</p>
              </div>

              <div>
                <label>Update Status: </label>
                <select
                  value={booking.status}
                  onChange={(e) => handleStatusUpdate(booking._id, e.target.value)}
                  style={{ padding: '0.25rem', marginTop: '0.5rem' }}
                >
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredBookings.length === 0 && bookings.length > 0 && <p>No bookings match your filters.</p>}
      {bookings.length === 0 && <p>No bookings found.</p>}
    </div>
  )
}
