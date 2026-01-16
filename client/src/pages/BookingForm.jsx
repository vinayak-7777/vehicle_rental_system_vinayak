import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../utils/api'
import { useAuth } from '../context/AuthContext'

export function BookingForm() {
  const { id } = useParams()
  const { token } = useAuth()
  const navigate = useNavigate()

  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [totalAmount, setTotalAmount] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')

    if (!token) {
      setError('You must be logged in to book a vehicle')
      return
    }

    try {
      setLoading(true)
      await api.post(
        '/bookings',
        { vehicleID: id, fromDate, toDate, totalAmount: Number(totalAmount) },
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

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Book Vehicle</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>From Date</label>
          <br />
          <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} required />
        </div>
        <div>
          <label>To Date</label>
          <br />
          <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} required />
        </div>
        <div>
          <label>Total Amount</label>
          <br />
          <input
            type="number"
            min="0"
            value={totalAmount}
            onChange={(e) => setTotalAmount(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {message && <p style={{ color: 'green' }}>{message}</p>}
        <button type="submit" disabled={loading}>
          {loading ? 'Creating booking...' : 'Create Booking'}
        </button>
      </form>
    </div>
  )
}


