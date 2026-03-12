import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { api } from '../../utils/api'
import { LoadingSpinner } from '../../components/LoadingSpinner'
import { ErrorMessage } from '../../components/ErrorMessage'

export default function AuditorPaymentManagement() {
  const { token } = useAuth()
  const [payments, setPayments] = useState([])
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionLoading, setActionLoading] = useState(null)

  const fetchData = async () => {
    setError('')
    try {
      const headers = { Authorization: `Bearer ${token}` }
      const [paymentsRes, bookingsRes] = await Promise.all([
        api.get('/payments', { headers }),
        api.get('/bookings', { headers }),
      ])
      setPayments(paymentsRes.data.data || [])
      setBookings(bookingsRes.data.data || [])
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleDistribute = async (paymentId) => {
    setActionLoading(paymentId)
    setError('')
    try {
      await api.post(`/payments/${paymentId}/distribute`, {}, { headers: { Authorization: `Bearer ${token}` } })
      fetchData()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to distribute')
    } finally {
      setActionLoading(null)
    }
  }

  const handleStatusUpdate = async (bookingId, newStatus) => {
    setActionLoading(bookingId)
    setError('')
    try {
      await api.put(`/bookings/${bookingId}/status`, { status: newStatus }, { headers: { Authorization: `Bearer ${token}` } })
      fetchData()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status')
    } finally {
      setActionLoading(null)
    }
  }

  if (loading) return <LoadingSpinner message="Loading payments and bookings..." />

  const statusColors = { pending: '#ffc107', paid: '#28a745', distributed: '#007bff' }
  const bookingStatusColors = { Pending: '#ffc107', Approved: '#28a745', Completed: '#007bff', Cancelled: '#dc3545' }

  return (
    <div className="container" style={{ padding: '1.5rem' }}>
      <h1>Payment Management</h1>
      <p style={{ color: '#6c757d' }}>Manage payments (distribute) and booking status (approve/cancel).</p>
      {error && <ErrorMessage message={error} />}

      {/* Payments section */}
      <div className="card" style={{ marginTop: '1.5rem' }}>
        <h2>All Transactions (Payments)</h2>
        <p>User pays 100% to Auditor. You distribute: Auditor 5%, Admin 10%, Fleet Manager 85%.</p>
        <div style={{ overflowX: 'auto' }}>
          <table className="table" style={{ width: '100%', marginTop: '1rem' }}>
            <thead>
              <tr>
                <th>Booking</th>
                <th>User / Vehicle</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Paid At</th>
                <th>Distributed At</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => {
                const b = p.bookingID
                const user = b?.userID
                const vehicle = b?.vehicleID
                return (
                  <tr key={p._id}>
                    <td>#{b?._id?.slice(-6) || '—'}</td>
                    <td>{user?.name || '—'} / {vehicle?.vehicleName || '—'}</td>
                    <td>₹{p.totalAmount}</td>
                    <td>
                      <span style={{ background: statusColors[p.status] || '#ccc', color: '#fff', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                        {p.status}
                      </span>
                    </td>
                    <td>{p.paidAt ? new Date(p.paidAt).toLocaleString() : '—'}</td>
                    <td>{p.distributedAt ? new Date(p.distributedAt).toLocaleString() : '—'}</td>
                    <td>
                      {p.status === 'paid' && (
                        <button
                          className="btn btn-primary"
                          disabled={actionLoading === p._id}
                          onClick={() => handleDistribute(p._id)}
                        >
                          {actionLoading === p._id ? 'Distributing...' : 'Distribute'}
                        </button>
                      )}
                      {p.status === 'distributed' && (
                        <span style={{ color: '#28a745' }}>Auditor ₹{p.auditorShare} | Admin ₹{p.adminShare} | Fleet ₹{p.fleetManagerShare}</span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {payments.length === 0 && <p>No payments yet.</p>}
      </div>

      {/* Bookings management (auditor can update status / cancel) */}
      <div className="card" style={{ marginTop: '1.5rem' }}>
        <h2>Manage Bookings (Status & Cancellation)</h2>
        <p>Update booking status or cancel. Only you and admin can change status.</p>
        <div style={{ marginTop: '1rem' }}>
          {bookings.map((b) => (
            <div key={b._id} style={{ border: '1px solid #dee2e6', padding: '1rem', marginBottom: '0.75rem', borderRadius: '4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <strong>#{b._id.slice(-6)}</strong> — {b.userID?.name} / {b.vehicleID?.vehicleName} — ₹{b.totalAmount}
                  <br />
                  <span style={{ background: bookingStatusColors[b.status], color: '#fff', padding: '0.2rem 0.5rem', borderRadius: '4px', marginTop: '0.25rem', display: 'inline-block' }}>
                    {b.status}
                  </span>
                </div>
                <div>
                  <label>Status: </label>
                  <select
                    value={b.status}
                    onChange={(e) => handleStatusUpdate(b._id, e.target.value)}
                    disabled={actionLoading === b._id}
                    style={{ padding: '0.35rem' }}
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
        {bookings.length === 0 && <p>No bookings.</p>}
      </div>
    </div>
  )
}
