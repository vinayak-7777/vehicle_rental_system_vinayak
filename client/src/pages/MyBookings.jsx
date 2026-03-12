import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../utils/api'
import { useAuth } from '../context/AuthContext'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { ErrorMessage } from '../components/ErrorMessage'

export function MyBookings() {
  const { token } = useAuth()
  const [bookings, setBookings] = useState([])
  const [paymentsByBooking, setPaymentsByBooking] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionLoading, setActionLoading] = useState(null)

  const fetchBookings = async () => {
    if (!token) {
      setError('You must be logged in to view bookings')
      setLoading(false)
      return
    }

    try {
      setError('')
      setLoading(true)
      const headers = { Authorization: `Bearer ${token}` }
      const [bookingsRes, paymentsRes] = await Promise.all([
        api.get('/bookings/my', { headers }),
        api.get('/payments/my', { headers }),
      ])

      const bookingsData = bookingsRes.data.data || []
      setBookings(bookingsData)

      const paymentsData = paymentsRes.data.data || []
      const map = {}
      paymentsData.forEach((p) => {
        const bookingId = p.bookingID?._id || p.bookingID
        if (bookingId) map[String(bookingId)] = p
      })
      setPaymentsByBooking(map)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load bookings')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [token])

  if (loading) return <LoadingSpinner message="Loading your bookings..." />
  if (error) return <ErrorMessage message={error} onRetry={fetchBookings} />

  const statusColors = {
    Pending: '#ffc107',
    Approved: '#28a745',
    Completed: '#007bff',
    Cancelled: '#dc3545',
  }

  const paymentStatusColors = {
    pending: '#ffc107',
    paid: '#28a745',
    distributed: '#007bff',
  }

  const CANCELLATION_MINUTES = 5

  const canCancel = (b) => {
    if (b.status === 'Cancelled' || b.status === 'Completed') return false
    const fromDateTime = b.fromDateTime ? new Date(b.fromDateTime) : new Date(b.fromDate)
    const cutoff = new Date(fromDateTime.getTime() - CANCELLATION_MINUTES * 60 * 1000)
    return new Date() < cutoff
  }

  const handlePay = async (bookingId) => {
    if (!token) return
    setActionLoading(bookingId)
    setError('')
    try {
      await api.post(
        `/bookings/${bookingId}/pay`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      await fetchBookings()
    } catch (err) {
      setError(err.response?.data?.message || 'Payment failed')
    } finally {
      setActionLoading(null)
    }
  }

  const handleCancel = async (bookingId) => {
    if (!token) return
    if (!confirm('Cancel this booking? This cannot be undone.')) return
    setActionLoading(bookingId)
    setError('')
    try {
      await api.post(
        `/bookings/${bookingId}/cancel`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      await fetchBookings()
    } catch (err) {
      setError(err.response?.data?.message || 'Cancellation failed')
    } finally {
      setActionLoading(null)
    }
  }

  return (
    <div className="container">
      <h1>My Bookings</h1>
      <p style={{ color: '#6c757d', marginBottom: '1rem' }}>
        Cancellation policy: you can cancel only up to 5 minutes before the booked start time.
      </p>
      {bookings.length === 0 ? (
        <div className="card">
          <p>You have no bookings yet.</p>
          <Link to="/vehicles" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            Browse Vehicles
          </Link>
        </div>
      ) : (
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          {bookings.map((b) => (
            <div key={b._id} className="card">
              {b.vehicleID?.imageURL && (
                <img
                  src={b.vehicleID.imageURL}
                  alt={b.vehicleID.vehicleName}
                  style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '4px', marginBottom: '1rem' }}
                />
              )}
              <h3>{b.vehicleID?.vehicleName || 'Unknown Vehicle'}</h3>
              <p><strong>Category:</strong> {b.vehicleID?.category || 'N/A'}</p>
              <p><strong>From:</strong> {new Date(b.fromDate).toLocaleDateString()}</p>
              <p><strong>To:</strong> {new Date(b.toDate).toLocaleDateString()}</p>
              <p><strong>Total Amount:</strong> ₹{b.totalAmount}</p>
              <p>
                <strong>Status:</strong>{' '}
                <span
                  className="badge"
                  style={{
                    background: statusColors[b.status] || '#6c757d',
                    color: 'white',
                  }}
                >
                  {b.status}
                </span>
              </p>
              {paymentsByBooking[String(b._id)] && (
                <p>
                  <strong>Payment:</strong>{' '}
                  <span
                    className="badge"
                    style={{
                      background: paymentStatusColors[paymentsByBooking[String(b._id)].status] || '#6c757d',
                      color: 'white',
                    }}
                  >
                    {paymentsByBooking[String(b._id)].status}
                  </span>
                </p>
              )}
              <p><strong>Created:</strong> {new Date(b.createdAt).toLocaleString()}</p>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                <Link
                  to={`/bookings/${b._id}`}
                  className="btn btn-primary"
                  style={{ display: 'inline-block' }}
                >
                  View Details
                </Link>

                {b.status === 'Approved' &&
                  paymentsByBooking[String(b._id)]?.status === 'pending' && (
                    <button
                      className="btn btn-secondary"
                      onClick={() => handlePay(b._id)}
                      disabled={actionLoading === b._id}
                      type="button"
                    >
                      {actionLoading === b._id ? 'Paying...' : 'Pay Now'}
                    </button>
                  )}
                {canCancel(b) && (
                  <button
                    className="btn"
                    type="button"
                    onClick={() => handleCancel(b._id)}
                    disabled={actionLoading === b._id}
                    style={{ background: '#dc3545', color: 'white', border: 'none' }}
                  >
                    {actionLoading === b._id ? 'Cancelling...' : 'Cancel booking'}
                  </button>
                )}
                {!canCancel(b) && b.status !== 'Cancelled' && b.status !== 'Completed' && (
                  <span style={{ fontSize: '0.85rem', color: '#6c757d' }}>
                    Too late to cancel (within 5 min of start)
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}


