import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { api } from '../../utils/api'
import { LoadingSpinner } from '../../components/LoadingSpinner'
import { ErrorMessage } from '../../components/ErrorMessage'

export default function FleetManagerTransactions() {
  const { token } = useAuth()
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchPayments = async () => {
      setError('')
      try {
        const res = await api.get('/payments', { headers: { Authorization: `Bearer ${token}` } })
        const data = res.data.data || []
        setPayments(data)
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load transactions')
      } finally {
        setLoading(false)
      }
    }
    fetchPayments()
  }, [token])

  const distributed = payments.filter((p) => p.status === 'distributed')
  const myShareTotal = distributed.reduce((sum, p) => sum + (p.fleetManagerShare || 0), 0)

  if (loading) return <LoadingSpinner message="Loading your transactions..." />

  return (
    <div className="container" style={{ padding: '1.5rem' }}>
      <h1>Fleet Manager Transactions</h1>
      <p style={{ color: '#6c757d' }}>Your share is 85% of each distributed payment.</p>
      {error && <ErrorMessage message={error} />}

      <div className="card" style={{ marginTop: '1rem', background: '#e7f5eb' }}>
        <h3>Total Your Share (85%)</h3>
        <p style={{ fontSize: '1.5rem', margin: 0 }}>₹{myShareTotal}</p>
        <small>From {distributed.length} distributed payment(s)</small>
      </div>

      <div className="card" style={{ marginTop: '1.5rem' }}>
        <h2>Distributed Payments (Your Share)</h2>
        <div style={{ overflowX: 'auto' }}>
          <table className="table" style={{ width: '100%', marginTop: '1rem' }}>
            <thead>
              <tr>
                <th>Booking</th>
                <th>User / Vehicle</th>
                <th>Total Amount</th>
                <th>Your Share (85%)</th>
                <th>Distributed At</th>
              </tr>
            </thead>
            <tbody>
              {distributed.map((p) => {
                const b = p.bookingID
                return (
                  <tr key={p._id}>
                    <td>#{b?._id?.slice(-6) || '—'}</td>
                    <td>{b?.userID?.name || '—'} / {b?.vehicleID?.vehicleName || '—'}</td>
                    <td>₹{p.totalAmount}</td>
                    <td><strong>₹{p.fleetManagerShare || 0}</strong></td>
                    <td>{p.distributedAt ? new Date(p.distributedAt).toLocaleString() : '—'}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {distributed.length === 0 && <p>No distributed payments yet. Auditor distributes after user pays.</p>}
      </div>
    </div>
  )
}
