import { useEffect, useState } from 'react'
import { api } from '../utils/api'
import { useAuth } from '../context/AuthContext'

export function MyBookings() {
  const { token } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchBookings = async () => {
      if (!token) {
        setError('You must be logged in to view bookings')
        setLoading(false)
        return
      }

      try {
        const res = await api.get('/bookings/my', {
          headers: { Authorization: `Bearer ${token}` },
        })
        setBookings(res.data.data || [])
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load bookings')
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [token])

  if (loading) return <p style={{ padding: '1rem' }}>Loading bookings...</p>
  if (error) return <p style={{ padding: '1rem', color: 'red' }}>{error}</p>

  return (
    <div style={{ padding: '1rem' }}>
      <h2>My Bookings</h2>
      {bookings.length === 0 ? (
        <p>You have no bookings yet.</p>
      ) : (
        <ul>
          {bookings.map((b) => (
            <li key={b._id} style={{ marginBottom: '0.5rem' }}>
              <strong>{b.vehicleID?.vehicleName}</strong> ({b.vehicleID?.category})<br />
              From: {new Date(b.fromDate).toLocaleDateString()} - To:{' '}
              {new Date(b.toDate).toLocaleDateString()}
              <br />
              Amount: ₹{b.totalAmount} | Status: {b.status}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}


