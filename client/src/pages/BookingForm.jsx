import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { api } from '../utils/api'
import { useAuth } from '../context/AuthContext'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { ErrorMessage } from '../components/ErrorMessage'
import { SuccessMessage } from '../components/SuccessMessage'

export function BookingForm() {
  const { id } = useParams()
  const { token } = useAuth()
  const navigate = useNavigate()

  const [vehicle, setVehicle] = useState(null)
  const [fromDate, setFromDate] = useState('')
  const [fromTime, setFromTime] = useState('09:00')
  const [toDate, setToDate] = useState('')
  const [toTime, setToTime] = useState('18:00')
  const [totalAmount, setTotalAmount] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [vehicleLoading, setVehicleLoading] = useState(true)

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const res = await api.get(`/vehicles/${id}`)
        setVehicle(res.data.data)
        if (res.data.data?.pricePerDay) {
          // Set minimum date to today
          const today = new Date().toISOString().split('T')[0]
          setFromDate(today)
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load vehicle')
      } finally {
        setVehicleLoading(false)
      }
    }
    fetchVehicle()
  }, [id])

  // Calculate amount from date+time (same formula as backend: duration in days, ceiling, min 1)
  useEffect(() => {
    if (fromDate && fromTime && toDate && toTime && vehicle?.pricePerDay) {
      const from = new Date(fromDate + 'T' + fromTime + ':00')
      const to = new Date(toDate + 'T' + toTime + ':00')
      if (!isNaN(from.getTime()) && !isNaN(to.getTime()) && to > from) {
        const durationMs = to - from
        const durationDays = Math.max(1, Math.ceil(durationMs / (24 * 60 * 60 * 1000)))
        setTotalAmount((durationDays * vehicle.pricePerDay).toString())
      } else {
        setTotalAmount('')
      }
    } else {
      setTotalAmount('')
    }
  }, [fromDate, fromTime, toDate, toTime, vehicle])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')

    if (!token) {
      setError('You must be logged in to book a vehicle')
      return
    }

    const fromDt = new Date(fromDate + 'T' + fromTime + ':00')
    const toDt = new Date(toDate + 'T' + toTime + ':00')
    const now = new Date()

    if (isNaN(fromDt.getTime()) || isNaN(toDt.getTime())) {
      setError('Please enter valid date and time')
      return
    }
    if (fromDt < now) {
      setError('From date & time cannot be in the past')
      return
    }
    if (toDt <= fromDt) {
      setError('To date & time must be after From date & time')
      return
    }
    if (Number(totalAmount) <= 0) {
      setError('Total amount must be greater than 0')
      return
    }

    try {
      setLoading(true)
      await api.post(
        '/bookings',
        { vehicleID: id, fromDate, fromTime, toDate, toTime },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      setMessage('Booking created successfully! Pending approval.')
      setTimeout(() => navigate('/my-bookings'), 1000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create booking')
    } finally {
      setLoading(false)
    }
  }

  if (vehicleLoading) return <LoadingSpinner message="Loading vehicle information..." />

  const today = new Date().toISOString().split('T')[0]
  const minToDate = fromDate || today

  return (
    <div className="container" style={{ maxWidth: '600px' }}>
      <Link to={`/vehicles/${id}`} className="btn btn-secondary" style={{ marginBottom: '1rem' }}>
        ← Back to Vehicle Details
      </Link>

      <div className="card">
        {vehicle && (
          <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#f8f9fa', borderRadius: '4px' }}>
            <h3>{vehicle.vehicleName}</h3>
            <p><strong>Category:</strong> {vehicle.category}</p>
            <p><strong>Price per day:</strong> ₹{vehicle.pricePerDay}</p>
          </div>
        )}

        <h1>Book Vehicle</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>From Date</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              min={today}
              required
            />
          </div>
          <div className="form-group">
            <label>From Time</label>
            <input
              type="time"
              value={fromTime}
              onChange={(e) => setFromTime(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>To Date</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              min={minToDate}
              required
            />
          </div>
          <div className="form-group">
            <label>To Time</label>
            <input
              type="time"
              value={toTime}
              onChange={(e) => setToTime(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Total Amount (₹)</label>
            <input
              type="text"
              value={totalAmount}
              readOnly
              style={{ background: '#f8f9fa', cursor: 'not-allowed' }}
              aria-readonly="true"
            />
            <small style={{ color: '#666', display: 'block', marginTop: '0.25rem' }}>
              Calculated from dates and times (price per day). Non-editable.
            </small>
          </div>
          {error && <ErrorMessage message={error} />}
          {message && <SuccessMessage message={message} />}
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Creating booking...' : 'Create Booking'}
          </button>
        </form>
      </div>
    </div>
  )
}


