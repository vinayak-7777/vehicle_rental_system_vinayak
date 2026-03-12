import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { api } from '../utils/api'
import { useAuth } from '../context/AuthContext'

export function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('user')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await api.post('/auth/register', { name, email, password, role })
      const { token, user } = res.data.data
      login(token, user)
      // Redirect based on role
      if (user.role === 'admin') {
        navigate('/admin/dashboard')
      } else if (user.role === 'fleetManager') {
        navigate('/fleet-manager/dashboard')
      } else if (user.role === 'auditor') {
        navigate('/auditor/reports')
      } else {
        navigate('/vehicles')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div className="card" style={{ width: '100%', maxWidth: '420px', padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <span style={{ fontSize: '2.5rem' }}>🚗</span>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1a1a2e', marginTop: '0.5rem' }}>Create account</h1>
<p style={{ color: '#6B7280', fontSize: '0.9rem', marginTop: '0.25rem' }}>Join Vehicle Rental System today</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Enter your full name"
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
              placeholder="Enter your email"
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
              placeholder="Enter your password"
              minLength="6"
            />
            <small style={{ color: '#666', display: 'block', marginTop: '0.25rem' }}>
              Minimum 6 characters
            </small>
          </div>
          <div className="form-group">
            <label>Role (for demo purposes)</label>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="fleetManager">Fleet Manager</option>
              <option value="auditor">Auditor</option>
            </select>
          </div>
          {error && <div className="alert alert-error">{error}</div>}
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <p style={{ marginTop: '1.25rem', textAlign: 'center', fontSize: '0.875rem', color: '#6B7280' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#5B3DF5', fontWeight: '600', textDecoration: 'none' }}>Login</Link>
        </p>
      </div>
    </div>
  )
}


