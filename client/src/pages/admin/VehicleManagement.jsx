import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { api } from '../../utils/api'

export default function VehicleManagement() {
  const { token } = useAuth()
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [formData, setFormData] = useState({
    vehicleName: '',
    category: '',
    pricePerDay: '',
    imageURL: '',
    isAvailable: true,
    conditionStatus: 'Good',
  })

  useEffect(() => {
    fetchVehicles()
  }, [])

  const fetchVehicles = async () => {
    try {
      const res = await api.get('/vehicles', {
        headers: { Authorization: `Bearer ${token}` },
      })
      setVehicles(res.data.data || [])
    } catch (err) {
      alert('Error fetching vehicles: ' + (err.response?.data?.message || err.message))
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const headers = { Authorization: `Bearer ${token}` }
      const data = {
        ...formData,
        pricePerDay: Number(formData.pricePerDay),
        isAvailable: formData.isAvailable === 'true' || formData.isAvailable === true,
      }

      if (editing) {
        await api.put(`/vehicles/${editing}`, data, { headers })
        alert('Vehicle updated successfully!')
      } else {
        await api.post('/vehicles', data, { headers })
        alert('Vehicle added successfully!')
      }

      setShowForm(false)
      setEditing(null)
      setFormData({
        vehicleName: '',
        category: '',
        pricePerDay: '',
        imageURL: '',
        isAvailable: true,
        conditionStatus: 'Good',
      })
      fetchVehicles()
    } catch (err) {
      alert('Error: ' + (err.response?.data?.message || err.message))
    }
  }

  const handleEdit = (vehicle) => {
    setEditing(vehicle._id)
    setFormData({
      vehicleName: vehicle.vehicleName,
      category: vehicle.category,
      pricePerDay: vehicle.pricePerDay,
      imageURL: vehicle.imageURL || '',
      isAvailable: vehicle.isAvailable,
      conditionStatus: vehicle.conditionStatus,
    })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this vehicle?')) return

    try {
      await api.delete(`/vehicles/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      alert('Vehicle deleted successfully!')
      fetchVehicles()
    } catch (err) {
      alert('Error: ' + (err.response?.data?.message || err.message))
    }
  }

  if (loading) return <div style={{ padding: '2rem' }}>Loading...</div>

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h1>Vehicle Management</h1>
        <button onClick={() => { setShowForm(true); setEditing(null); setFormData({ vehicleName: '', category: '', pricePerDay: '', imageURL: '', isAvailable: true, conditionStatus: 'Good' }) }}>
          {showForm ? 'Cancel' : '+ Add Vehicle'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ border: '1px solid #ddd', padding: '1rem', marginBottom: '2rem', borderRadius: '4px' }}>
          <h3>{editing ? 'Edit Vehicle' : 'Add New Vehicle'}</h3>
          <div style={{ marginBottom: '0.5rem' }}>
            <label>Vehicle Name: </label>
            <input
              type="text"
              value={formData.vehicleName}
              onChange={(e) => setFormData({ ...formData, vehicleName: e.target.value })}
              required
              style={{ width: '300px', padding: '0.25rem' }}
            />
          </div>
          <div style={{ marginBottom: '0.5rem' }}>
            <label>Category: </label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
              style={{ width: '300px', padding: '0.25rem' }}
              placeholder="Car, Bike, etc."
            />
          </div>
          <div style={{ marginBottom: '0.5rem' }}>
            <label>Price Per Day: </label>
            <input
              type="number"
              value={formData.pricePerDay}
              onChange={(e) => setFormData({ ...formData, pricePerDay: e.target.value })}
              required
              min="0"
              style={{ width: '300px', padding: '0.25rem' }}
            />
          </div>
          <div style={{ marginBottom: '0.5rem' }}>
            <label>Image URL: </label>
            <input
              type="text"
              value={formData.imageURL}
              onChange={(e) => setFormData({ ...formData, imageURL: e.target.value })}
              style={{ width: '300px', padding: '0.25rem' }}
            />
          </div>
          <div style={{ marginBottom: '0.5rem' }}>
            <label>Available: </label>
            <select
              value={formData.isAvailable}
              onChange={(e) => setFormData({ ...formData, isAvailable: e.target.value === 'true' })}
              style={{ width: '300px', padding: '0.25rem' }}
            >
              <option value={true}>Yes</option>
              <option value={false}>No</option>
            </select>
          </div>
          <div style={{ marginBottom: '0.5rem' }}>
            <label>Condition: </label>
            <select
              value={formData.conditionStatus}
              onChange={(e) => setFormData({ ...formData, conditionStatus: e.target.value })}
              style={{ width: '300px', padding: '0.25rem' }}
            >
              <option value="Good">Good</option>
              <option value="Maintenance">Maintenance</option>
            </select>
          </div>
          <button type="submit" style={{ padding: '0.5rem 1rem', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            {editing ? 'Update' : 'Add'} Vehicle
          </button>
        </form>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
        {vehicles.map((vehicle) => (
          <div key={vehicle._id} style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: '4px' }}>
            {vehicle.imageURL && (
              <img src={vehicle.imageURL} alt={vehicle.vehicleName} style={{ width: '100%', height: '150px', objectFit: 'cover', marginBottom: '0.5rem' }} />
            )}
            <h3>{vehicle.vehicleName}</h3>
            <p><strong>Category:</strong> {vehicle.category}</p>
            <p><strong>Price:</strong> ${vehicle.pricePerDay}/day</p>
            <p><strong>Status:</strong> {vehicle.isAvailable ? 'Available' : 'Not Available'}</p>
            <p><strong>Condition:</strong> {vehicle.conditionStatus}</p>
            <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
              <button onClick={() => handleEdit(vehicle)} style={{ padding: '0.25rem 0.5rem', background: '#ffc107', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                Edit
              </button>
              <button onClick={() => handleDelete(vehicle._id)} style={{ padding: '0.25rem 0.5rem', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {vehicles.length === 0 && <p>No vehicles found. Add your first vehicle!</p>}
    </div>
  )
}
