import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { api } from '../../utils/api'
import { LoadingSpinner } from '../../components/LoadingSpinner'
import { ErrorMessage } from '../../components/ErrorMessage'

export default function AdminTransactions() {
  const { token } = useAuth()
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchPayments = async () => {
      setError('')
      try {
        const res = await api.get('/payments', { headers: { Authorization: `Bearer ${token}` } })
        setPayments(res.data.data || [])
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load transactions')
      } finally {
        setLoading(false)
      }
    }
    fetchPayments()
  }, [token])

  if (loading) return <LoadingSpinner message="Loading transactions..." />

  const statusColors = { pending: '#ffc107', paid: '#28a745', distributed: '#007bff' }

  return (
    <div className="container" style={{ padding: '1.5rem' }}>
      <h1>All Transactions</h1>
      <p style={{ color: '#6c757d' }}>Read-only view of all payments. Distribution is managed by the Auditor.</p>
      {error && <ErrorMessage message={error} />}

      <div className="card" style={{ marginTop: '1.5rem' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="table" style={{ width: '100%' }}>
            <thead>
              <tr>
                <th>Booking</th>
                <th>User / Vehicle</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Paid At</th>
                <th>Distributed At</th>
                <th>Admin Share (10%)</th>
                <th>Auditor (5%) / Fleet (85%)</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => {
                const b = p.bookingID
                return (
                  <tr key={p._id}>
                    <td>#{b?._id?.slice(-6) || '—'}</td>
                    <td>{b?.userID?.name || '—'} / {b?.vehicleID?.vehicleName || '—'}</td>
                    <td>₹{p.totalAmount}</td>
                    <td>
                      <span style={{ background: statusColors[p.status] || '#ccc', color: '#fff', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                        {p.status}
                      </span>
                    </td>
                    <td>{p.paidAt ? new Date(p.paidAt).toLocaleString() : '—'}</td>
                    <td>{p.distributedAt ? new Date(p.distributedAt).toLocaleString() : '—'}</td>
                    <td>{p.status === 'distributed' ? `₹${p.adminShare}` : '—'}</td>
                    <td>{p.status === 'distributed' ? `Auditor ₹${p.auditorShare} / Fleet ₹${p.fleetManagerShare}` : '—'}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {payments.length === 0 && <p>No transactions yet.</p>}
      </div>
    </div>
  )
}
