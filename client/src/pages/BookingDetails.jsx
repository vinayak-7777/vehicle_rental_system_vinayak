import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { api } from '../utils/api'
import { useAuth } from '../context/AuthContext'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { ErrorMessage } from '../components/ErrorMessage'

const CANCELLATION_MINUTES = 5

export function BookingDetails() {
  const { id } = useParams()
  const { token, user } = useAuth()
  const navigate = useNavigate()
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    const fetchBooking = async () => {
      if (!token) {
        setError('You must be logged in to view booking details')
        setLoading(false)
        return
      }

      try {
        setError('')
        setLoading(true)
        // Get all bookings and find the one we need
        const res = await api.get('/bookings/my', {
          headers: { Authorization: `Bearer ${token}` },
        })
        const foundBooking = res.data.data?.find((b) => b._id === id)
        
        if (!foundBooking) {
          setError('Booking not found')
        } else {
          setBooking(foundBooking)
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load booking details')
      } finally {
        setLoading(false)
      }
    }

    fetchBooking()
  }, [id, token])

  if (loading) return <LoadingSpinner message="Loading booking details..." />
  if (error) return <ErrorMessage message={error} />

  if (!booking) return null

  const fromDateTime = booking.fromDateTime ? new Date(booking.fromDateTime) : new Date(booking.fromDate)
  const cutoff = new Date(fromDateTime.getTime() - CANCELLATION_MINUTES * 60 * 1000)
  const canCancelBooking =
    booking.status !== 'Cancelled' &&
    booking.status !== 'Completed' &&
    new Date() < cutoff

  const handleCancel = async () => {
    if (!token) return
    if (!confirm('Cancel this booking? This cannot be undone.')) return
    setActionLoading(true)
    setError('')
    try {
      await api.post(`/bookings/${booking._id}/cancel`, {}, { headers: { Authorization: `Bearer ${token}` } })
      setBooking((prev) => (prev ? { ...prev, status: 'Cancelled' } : null))
    } catch (err) {
      setError(err.response?.data?.message || 'Cancellation failed')
    } finally {
      setActionLoading(false)
    }
  }

  const statusColors = {
    Pending: '#ffc107',
    Approved: '#28a745',
    Completed: '#007bff',
    Cancelled: '#dc3545',
  }

  const days = Math.ceil((new Date(booking.toDate) - new Date(booking.fromDate)) / (1000 * 60 * 60 * 24))

  return (
    <div className="container">
      <Link to="/my-bookings" className="btn btn-secondary" style={{ marginBottom: '1rem' }}>
        ← Back to My Bookings
      </Link>

      <div className="card">
        <h1>Booking Details</h1>
        <p>
          <strong>Booking ID:</strong> #{booking._id.slice(-6)}
        </p>
        <p>
          <strong>Status:</strong>{' '}
          <span
            className="badge"
            style={{
              background: statusColors[booking.status] || '#6c757d',
              color: 'white',
            }}
          >
            {booking.status}
          </span>
        </p>

        <hr style={{ margin: '1.5rem 0', border: 'none', borderTop: '1px solid #ddd' }} />

        <h2>Vehicle Information</h2>
        {booking.vehicleID?.imageURL && (
          <img
            src={booking.vehicleID.imageURL}
            alt={booking.vehicleID.vehicleName}
            style={{ width: '100%', maxWidth: '400px', height: '250px', objectFit: 'cover', borderRadius: '8px', marginBottom: '1rem' }}
          />
        )}
        <p><strong>Vehicle Name:</strong> {booking.vehicleID?.vehicleName || 'N/A'}</p>
        <p><strong>Category:</strong> {booking.vehicleID?.category || 'N/A'}</p>
        <p><strong>Price Per Day:</strong> ₹{booking.vehicleID?.pricePerDay || 'N/A'}</p>
        <p><strong>Condition:</strong> {booking.vehicleID?.conditionStatus || 'N/A'}</p>

        <hr style={{ margin: '1.5rem 0', border: 'none', borderTop: '1px solid #ddd' }} />

        <h2>Booking Information</h2>
        <p><strong>From Date:</strong> {new Date(booking.fromDate).toLocaleDateString()}</p>
        <p><strong>To Date:</strong> {new Date(booking.toDate).toLocaleDateString()}</p>
        <p><strong>Duration:</strong> {days} {days === 1 ? 'day' : 'days'}</p>
        <p><strong>Total Amount:</strong> ₹{booking.totalAmount}</p>
        <p><strong>Created:</strong> {new Date(booking.createdAt).toLocaleString()}</p>
        {booking.updatedAt && booking.updatedAt !== booking.createdAt && (
          <p><strong>Last Updated:</strong> {new Date(booking.updatedAt).toLocaleString()}</p>
        )}

        {user?.role === 'admin' && (
          <>
            <hr style={{ margin: '1.5rem 0', border: 'none', borderTop: '1px solid #ddd' }} />
            <h2>Customer Information</h2>
            <p><strong>Name:</strong> {booking.userID?.name || 'N/A'}</p>
            <p><strong>Email:</strong> {booking.userID?.email || 'N/A'}</p>
          </>
        )}

        <p style={{ color: '#6c757d', marginTop: '1rem' }}>
          Cancellation policy: you can cancel only up to 5 minutes before the booked start time.
        </p>
        <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <Link to="/vehicles" className="btn btn-primary">
            Browse More Vehicles
          </Link>
          <Link to="/my-bookings" className="btn btn-secondary">
            Back to My Bookings
          </Link>
          {canCancelBooking && (
            <button
              type="button"
              onClick={handleCancel}
              disabled={actionLoading}
              className="btn"
              style={{ background: '#dc3545', color: 'white', border: 'none' }}
            >
              {actionLoading ? 'Cancelling...' : 'Cancel booking'}
            </button>
          )}
          {!canCancelBooking && booking.status !== 'Cancelled' && booking.status !== 'Completed' && (
            <span className="alert alert-info" style={{ display: 'inline-block' }}>
              Too late to cancel (within 5 minutes of start).
            </span>
          )}
          {booking.status === 'Pending' && (
            <span className="alert alert-info" style={{ display: 'inline-block' }}>
              Your booking is pending approval. You will be notified once it's reviewed.
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
