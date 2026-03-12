import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { api } from '../../utils/api'

export default function FleetManagerDashboard() {
  const { token } = useAuth()
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
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

  const handleUpdateAvailability = async (vehicleId, isAvailable) => {
    try {
      await api.put(
        `/vehicles/${vehicleId}`,
        { isAvailable },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      alert('Vehicle availability updated!')
      fetchVehicles()
    } catch (err) {
      alert('Error: ' + (err.response?.data?.message || err.message))
    }
  }

  const handleUpdateCondition = async (vehicleId, conditionStatus) => {
    try {
      await api.put(
        `/vehicles/${vehicleId}`,
        { conditionStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      alert('Vehicle condition updated!')
      fetchVehicles()
    } catch (err) {
      alert('Error: ' + (err.response?.data?.message || err.message))
    }
  }

  const handleSubmitVehicle = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const headers = { Authorization: `Bearer ${token}` }
      const data = {
        ...formData,
        pricePerDay: Number(formData.pricePerDay),
        isAvailable: formData.isAvailable === 'true' || formData.isAvailable === true,
      }
      await api.post('/vehicles', data, { headers })
      alert('Vehicle submitted for admin approval!')
      setShowForm(false)
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
      alert('Error submitting vehicle: ' + (err.response?.data?.message || err.message))
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div style={{ padding: '2rem' }}>Loading...</div>

  const availableCount = vehicles.filter(v => v.isAvailable).length
  const maintenanceCount = vehicles.filter(v => v.conditionStatus === 'Maintenance').length

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <h1 style={{ margin: 0 }}>Fleet Manager Dashboard</h1>
        <button
          onClick={() => setShowForm((s) => !s)}
          style={{ padding: '0.5rem 1rem', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          {showForm ? 'Cancel' : '+ Submit Vehicle'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmitVehicle} style={{ border: '1px solid #ddd', padding: '1rem', marginTop: '1rem', borderRadius: '4px', background: '#f8f9fa' }}>
          <h3>Submit Vehicle for Admin Approval</h3>
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
          <button
            type="submit"
            disabled={submitting}
            style={{ padding: '0.5rem 1rem', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            {submitting ? 'Submitting...' : 'Submit for Approval'}
          </button>
          <p style={{ marginTop: '0.5rem', color: '#6c757d' }}>
            New vehicles are <strong>Pending</strong> until Admin approves them. Only approved vehicles show on the user page.
          </p>
        </form>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginTop: '2rem', marginBottom: '2rem' }}>
        <div style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: '4px' }}>
          <h3>Total Vehicles</h3>
          <p style={{ fontSize: '2rem', margin: 0 }}>{vehicles.length}</p>
        </div>
        <div style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: '4px', background: availableCount > 0 ? '#d4edda' : '' }}>
          <h3>Available Vehicles</h3>
          <p style={{ fontSize: '2rem', margin: 0 }}>{availableCount}</p>
        </div>
        <div style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: '4px', background: maintenanceCount > 0 ? '#fff3cd' : '' }}>
          <h3>Under Maintenance</h3>
          <p style={{ fontSize: '2rem', margin: 0 }}>{maintenanceCount}</p>
        </div>
      </div>

      <h2>Vehicle List</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
        {vehicles.map((vehicle) => (
          <div
            key={vehicle._id}
            style={{
              border: '1px solid #ddd',
              padding: '1rem',
              borderRadius: '4px',
              background: vehicle.conditionStatus === 'Maintenance' ? '#fff3cd' : vehicle.isAvailable ? '#d4edda' : '#f8d7da',
            }}
          >
            {vehicle.imageURL && (
              <img
                src={vehicle.imageURL}
                alt={vehicle.vehicleName}
                style={{ width: '100%', height: '150px', objectFit: 'cover', marginBottom: '0.5rem', borderRadius: '4px' }}
              />
            )}
            <h3>{vehicle.vehicleName}</h3>
            <p><strong>Category:</strong> {vehicle.category}</p>
            <p><strong>Price:</strong> ${vehicle.pricePerDay}/day</p>
            <p><strong>Listing:</strong> {vehicle.listingStatus || 'Approved (legacy)'}</p>

            <div style={{ marginTop: '1rem', padding: '0.5rem', background: '#f8f9fa', borderRadius: '4px' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                <strong>Availability:</strong>
                <select
                  value={vehicle.isAvailable}
                  onChange={(e) => handleUpdateAvailability(vehicle._id, e.target.value === 'true')}
                  style={{ marginLeft: '0.5rem', padding: '0.25rem' }}
                >
                  <option value={true}>Available</option>
                  <option value={false}>Not Available</option>
                </select>
              </label>

              <label style={{ display: 'block', marginTop: '0.5rem' }}>
                <strong>Condition:</strong>
                <select
                  value={vehicle.conditionStatus}
                  onChange={(e) => handleUpdateCondition(vehicle._id, e.target.value)}
                  style={{ marginLeft: '0.5rem', padding: '0.25rem' }}
                >
                  <option value="Good">Good</option>
                  <option value="Maintenance">Under Maintenance</option>
                </select>
              </label>
            </div>
          </div>
        ))}
      </div>

      {vehicles.length === 0 && <p>No vehicles found.</p>}
    </div>
  )
}
