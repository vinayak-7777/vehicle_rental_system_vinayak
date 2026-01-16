import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api } from '../utils/api'

export function VehicleDetails() {
  const { id } = useParams()
  const [vehicle, setVehicle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const res = await api.get(`/vehicles/${id}`)
        setVehicle(res.data.data)
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load vehicle')
      } finally {
        setLoading(false)
      }
    }

    fetchVehicle()
  }, [id])

  if (loading) return <p style={{ padding: '1rem' }}>Loading vehicle...</p>
  if (error) return <p style={{ padding: '1rem', color: 'red' }}>{error}</p>
  if (!vehicle) return <p style={{ padding: '1rem' }}>Vehicle not found.</p>

  return (
    <div style={{ padding: '1rem' }}>
      <h2>{vehicle.vehicleName}</h2>
      <p>Category: {vehicle.category}</p>
      <p>Price per day: ₹{vehicle.pricePerDay}</p>
      <p>Status: {vehicle.isAvailable ? 'Available' : 'Not Available'}</p>
      <p>Condition: {vehicle.conditionStatus}</p>

      {vehicle.isAvailable && (
        <Link to={`/vehicles/${vehicle._id}/book`}>Book Now</Link>
      )}
    </div>
  )
}


