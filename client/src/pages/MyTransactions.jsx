import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { api } from '../utils/api'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { ErrorMessage } from '../components/ErrorMessage'

export function MyTransactions() {
  const { token } = useAuth()
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchPayments = async () => {
      setError('')
      try {
        const res = await api.get('/payments/my', { headers: { Authorization: `Bearer ${token}` } })
        setPayments(res.data.data || [])
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load your transactions')
      } finally {
        setLoading(false)
      }
    }
    fetchPayments()
  }, [token])

  if (loading) return <LoadingSpinner message="Loading your transactions..." />

  const statusColors = { pending: '#ffc107', paid: '#28a745', distributed: '#007bff' }

  return (
    <div className="container" style={{ padding: '1.5rem' }}>
      <h1>My Transactions</h1>
      <p style={{ color: '#6c757d' }}>Payments for your bookings. You pay 100% to the Auditor; they then distribute to Admin and Fleet Manager.</p>
      {error && <ErrorMessage message={error} />}

      <div className="card" style={{ marginTop: '1.5rem' }}>
        {payments.length === 0 && <p>You have no payment records yet. Book a vehicle and pay after approval to see transactions here.</p>}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {payments.map((p) => {
            const b = p.bookingID
            const vehicle = b?.vehicleID
            return (
              <div key={p._id} style={{ border: '1px solid #dee2e6', padding: '1rem', borderRadius: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div>
                    <strong>Booking #{b?._id?.slice(-6) || '—'}</strong>
                    {vehicle && <span> — {vehicle.vehicleName} ({vehicle.category})</span>}
                    <br />
                    <span style={{ background: statusColors[p.status] || '#ccc', color: '#fff', padding: '0.2rem 0.5rem', borderRadius: '4px', marginTop: '0.25rem', display: 'inline-block' }}>
                      {p.status}
                    </span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <strong>₹{p.totalAmount}</strong>
                    {p.paidAt && <div style={{ fontSize: '0.9rem', color: '#666' }}>Paid: {new Date(p.paidAt).toLocaleString()}</div>}
                    {p.distributedAt && <div style={{ fontSize: '0.9rem', color: '#666' }}>Distributed: {new Date(p.distributedAt).toLocaleString()}</div>}
                  </div>
                </div>
                {b?._id && (
                  <Link to={`/bookings/${b._id}`} className="btn btn-secondary" style={{ marginTop: '0.5rem', display: 'inline-block' }}>
                    View Booking
                  </Link>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
