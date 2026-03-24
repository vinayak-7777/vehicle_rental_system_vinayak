import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../utils/api'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { ErrorMessage } from '../components/ErrorMessage'

export function VehicleList() {
  const [vehicles, setVehicles] = useState([])
  const [filteredVehicles, setFilteredVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [availabilityFilter, setAvailabilityFilter] = useState('all')

  const fetchVehicles = async () => {
    try {
      setError('')
      setLoading(true)
      const res = await api.get('/vehicles')
      setVehicles(res.data.data || [])
      setFilteredVehicles(res.data.data || [])
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load vehicles')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVehicles()
  }, [])

  useEffect(() => {
    let filtered = vehicles
    if (searchTerm) {
      const s = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (v) => v.vehicleName?.toLowerCase().includes(s) || v.category?.toLowerCase().includes(s)
      )
    }
    if (categoryFilter !== 'all') {
      filtered = filtered.filter((v) => v.category === categoryFilter)
    }
    if (availabilityFilter === 'available') {
      filtered = filtered.filter((v) => v.isAvailable === true)
    } else if (availabilityFilter === 'not-available') {
      filtered = filtered.filter((v) => v.isAvailable === false)
    }
    setFilteredVehicles(filtered)
  }, [vehicles, searchTerm, categoryFilter, availabilityFilter])

  const categories = [...new Set(vehicles.map((v) => v.category).filter(Boolean))]

  if (loading) return <LoadingSpinner message="Loading vehicles..." />
  if (error) return <ErrorMessage message={error} onRetry={fetchVehicles} />

  return (
    <div>
      {/* ── Light header section ── */}
      <div style={{ background: 'white', paddingTop: '2.5rem', paddingBottom: 0, borderBottom: '1px solid #E5E7EB' }}>
        <div className="container">
          {/* Heading */}
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <h1 style={{ fontSize: '1.8rem', fontWeight: '700', color: '#1a1a2e', marginBottom: '0.4rem' }}>
              Most Popular Vehicle Rental Deals
            </h1>
            <p style={{ color: '#6B7280', fontSize: '0.95rem' }}>
              Explore our most popular vehicles, offering unbeatable prices and a wide selection.
            </p>
          </div>

          {/* Search */}
          <div style={{ maxWidth: '480px', margin: '0 auto 1.5rem' }}>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', fontSize: '1rem', color: '#9CA3AF' }}>🔍</span>
              <input
                type="text"
                placeholder="Search by name or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 1rem 0.65rem 2.5rem',
                  border: '1.5px solid #E5E7EB',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  background: '#F5F6FA',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          {/* Underline filter tabs */}
          <div className="vehicle-filter-tabs" style={{ borderBottom: '2px solid #E5E7EB', gap: 0, marginBottom: 0 }}>
            <button
              className={`vehicle-filter-tab${categoryFilter === 'all' ? ' active' : ''}`}
              onClick={() => setCategoryFilter('all')}
            >
              All Vehicles
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                className={`vehicle-filter-tab${categoryFilter === cat ? ' active' : ''}`}
                onClick={() => setCategoryFilter(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Dark navy vehicles section ── */}
      <div className="vehicle-section">
        <div className="container">
          {/* Count + availability filter bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem' }}>
              Showing{' '}
              <strong style={{ color: '#F5A623' }}>{filteredVehicles.length}</strong>
              {' '}of{' '}
              <strong style={{ color: 'white' }}>{vehicles.length}</strong> vehicles
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <select
                value={availabilityFilter}
                onChange={(e) => setAvailabilityFilter(e.target.value)}
                style={{
                  padding: '0.4rem 0.75rem',
                  border: '1.5px solid rgba(255,255,255,0.2)',
                  borderRadius: '6px',
                  fontSize: '0.85rem',
                  background: 'rgba(255,255,255,0.08)',
                  color: 'white',
                  cursor: 'pointer',
                  outline: 'none',
                }}
              >
                <option value="all" style={{ background: '#1B3A7A' }}>All status</option>
                <option value="available" style={{ background: '#1B3A7A' }}>Available only</option>
                <option value="not-available" style={{ background: '#1B3A7A' }}>Not available</option>
              </select>
              {(searchTerm || categoryFilter !== 'all' || availabilityFilter !== 'all') && (
                <button
                  onClick={() => { setSearchTerm(''); setCategoryFilter('all'); setAvailabilityFilter('all') }}
                  style={{
                    padding: '0.4rem 0.75rem',
                    border: '1.5px solid rgba(255,255,255,0.2)',
                    borderRadius: '6px',
                    fontSize: '0.85rem',
                    background: 'transparent',
                    color: 'rgba(255,255,255,0.7)',
                    cursor: 'pointer',
                  }}
                >
                  ✕ Clear
                </button>
              )}
            </div>
          </div>

          {/* Vehicle cards */}
          {filteredVehicles.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'rgba(255,255,255,0.6)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚗</div>
              <p style={{ fontSize: '1.1rem' }}>No vehicles match your search criteria.</p>
            </div>
          ) : (
            <div className="vehicle-grid">
              {filteredVehicles.map((v) => (
                <div key={v._id} className="vehicle-card">
                  {/* Image */}
                  {v.imageURL ? (
                    <img src={v.imageURL} alt={v.vehicleName} className="vehicle-card-img" />
                  ) : (
                    <div className="vehicle-card-img-placeholder">🚗</div>
                  )}

                  {/* Body */}
                  <div className="vehicle-card-body">
                    {/* Name + Price */}
                    <div className="vehicle-card-header">
                      <span className="vehicle-card-name">{v.vehicleName}</span>
                      <div className="vehicle-card-price">
                        ₹{v.pricePerDay}
                        <small>per day</small>
                      </div>
                    </div>

                    {/* Category */}
                    <div className="vehicle-card-category">{v.category}</div>

                    {/* Feature badges */}
                    <div className="vehicle-card-features">
                      <span className="vehicle-feature-badge">⚙️ {v.transmission || 'Manual'}</span>
                      <span className="vehicle-feature-badge">⛽ {v.fuelType || 'Petrol'}</span>
                      <span className="vehicle-feature-badge">❄️ AC</span>
                      {!v.isAvailable && (
                        <span className="vehicle-feature-badge" style={{ background: '#FEE2E2', color: '#DC2626' }}>
                          Unavailable
                        </span>
                      )}
                    </div>

                    {/* Rent Now button */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <Link
                        to={`/vehicles/${v._id}`}
                        className="btn-rent"
                      >
                        Rent Now
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


