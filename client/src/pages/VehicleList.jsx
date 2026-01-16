import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../utils/api'

export function VehicleList() {
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const res = await api.get('/vehicles')
        setVehicles(res.data.data || [])
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load vehicles')
      } finally {
        setLoading(false)
      }
    }

    fetchVehicles()
  }, [])

  if (loading) return <p style={{ padding: '1rem' }}>Loading vehicles...</p>
  if (error) return <p style={{ padding: '1rem', color: 'red' }}>{error}</p>

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Available Vehicles</h2>
      {vehicles.length === 0 ? (
        <p>No vehicles found.</p>
      ) : (
        <ul>
          {vehicles.map((v) => (
            <li key={v._id} style={{ marginBottom: '0.5rem' }}>
              <strong>{v.vehicleName}</strong> ({v.category}) - ₹{v.pricePerDay} / day{' '}
              {v.isAvailable ? (
                <span style={{ color: 'green' }}>[Available]</span>
              ) : (
                <span style={{ color: 'red' }}>[Not Available]</span>
              )}{' '}
              <Link to={`/vehicles/${v._id}`}>Details</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}


