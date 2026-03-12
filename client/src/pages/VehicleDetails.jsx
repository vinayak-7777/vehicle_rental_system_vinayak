import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api } from '../utils/api'
import { useAuth } from '../context/AuthContext'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { ErrorMessage } from '../components/ErrorMessage'

export function VehicleDetails() {
  const { id } = useParams()
  const { user } = useAuth()
  const [vehicle, setVehicle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchVehicle = async () => {
    try {
      setError('')
      setLoading(true)
      const res = await api.get(`/vehicles/${id}`)
      setVehicle(res.data.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load vehicle')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVehicle()
  }, [id])

  if (loading) return <LoadingSpinner message="Loading vehicle details..." />
  if (error) return <ErrorMessage message={error} onRetry={fetchVehicle} />
  if (!vehicle) return <p className="container">Vehicle not found.</p>

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      <Link
        to="/vehicles"
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
          textDecoration: 'none', color: '#5B3DF5', fontWeight: '500',
          fontSize: '0.9rem', marginBottom: '1.5rem',
        }}
      >
        ← Back to Vehicles
      </Link>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'start' }} className="vehicle-detail-grid">
        {/* Image */}
        <div style={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
          {vehicle.imageURL ? (
            <img
              src={vehicle.imageURL}
              alt={vehicle.vehicleName}
              style={{ width: '100%', height: '360px', objectFit: 'cover', display: 'block' }}
            />
          ) : (
            <div style={{ width: '100%', height: '360px', background: 'linear-gradient(135deg,#f0f0f5,#e8e8f0)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '5rem' }}>
              🚗
            </div>
          )}
        </div>

        {/* Details */}
        <div className="card" style={{ margin: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#1a1a2e' }}>{vehicle.vehicleName}</h1>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.75rem', fontWeight: '700', color: '#5B3DF5' }}>${vehicle.pricePerDay}</div>
              <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>per day</div>
            </div>
          </div>

          <div style={{ fontSize: '0.9rem', color: '#6B7280', marginBottom: '1.25rem' }}>{vehicle.category}</div>

          {/* Feature badges */}
          <div className="vehicle-card-features" style={{ marginBottom: '1.25rem' }}>
            <span className="vehicle-feature-badge">⚙️ {vehicle.transmission || 'Manual'}</span>
            <span className="vehicle-feature-badge">⛽ {vehicle.fuelType || 'Petrol'}</span>
            <span className="vehicle-feature-badge">❄️ Air Conditioner</span>
          </div>

          {/* Status grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ padding: '0.75rem', background: '#F9FAFB', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.75rem', color: '#6B7280', marginBottom: '0.25rem' }}>Availability</div>
              <span
                style={{
                  display: 'inline-block', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.8rem', fontWeight: '600',
                  background: vehicle.isAvailable ? '#D1FAE5' : '#FEE2E2',
                  color: vehicle.isAvailable ? '#065F46' : '#DC2626',
                }}
              >
                {vehicle.isAvailable ? 'Available' : 'Not Available'}
              </span>
            </div>
            <div style={{ padding: '0.75rem', background: '#F9FAFB', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.75rem', color: '#6B7280', marginBottom: '0.25rem' }}>Condition</div>
              <span
                style={{
                  display: 'inline-block', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.8rem', fontWeight: '600',
                  background: vehicle.conditionStatus === 'Good' ? '#D1FAE5' : '#FEF3C7',
                  color: vehicle.conditionStatus === 'Good' ? '#065F46' : '#92400E',
                }}
              >
                {vehicle.conditionStatus}
              </span>
            </div>
          </div>

          {vehicle.isAvailable && user ? (
            <Link
              to={`/vehicles/${vehicle._id}/book`}
              className="btn btn-orange"
              style={{ width: '100%', textAlign: 'center', textDecoration: 'none', fontSize: '1rem', padding: '0.75rem', borderRadius: '10px', display: 'block' }}
            >
              Book Now
            </Link>
          ) : !user ? (
            <div className="alert alert-warning">
              Please <Link to="/login" style={{ color: '#5B3DF5', fontWeight: '600' }}>login</Link> to book this vehicle.
            </div>
          ) : (
            <div className="alert alert-error">
              This vehicle is currently not available for booking.
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .vehicle-detail-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}


