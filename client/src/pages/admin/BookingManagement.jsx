import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { api } from '../../utils/api'

export default function BookingManagement() {
  const { token } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      const res = await api.get('/bookings', {
        headers: { Authorization: `Bearer ${token}` },
      })
      setBookings(res.data.data || [])
    } catch (err) {
      alert('Error fetching bookings: ' + (err.response?.data?.message || err.message))
    } finally {
      setLoading(false)
    }
  }

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
      <p>Total Bookings: {bookings.length}</p>

      <div style={{ marginTop: '1rem' }}>
        {bookings.map((booking) => (
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

      {bookings.length === 0 && <p>No bookings found.</p>}
    </div>
  )
}
