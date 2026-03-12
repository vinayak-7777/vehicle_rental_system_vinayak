import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { api } from '../../utils/api'

export default function UserManagement() {
  const { token } = useAuth()
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users', {
        headers: { Authorization: `Bearer ${token}` },
      })
      setUsers(res.data.data || [])
      setFilteredUsers(res.data.data || [])
    } catch (err) {
      alert('Error fetching users: ' + (err.response?.data?.message || err.message))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let filtered = users

    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (u) =>
          u.name?.toLowerCase().includes(searchLower) ||
          u.email?.toLowerCase().includes(searchLower)
      )
    }

    // Role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter((u) => u.role === roleFilter)
    }

    setFilteredUsers(filtered)
  }, [users, searchTerm, roleFilter])

  const handleRoleUpdate = async (userId, newRole) => {
    try {
      await api.put(
        `/users/${userId}/role`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      alert('User role updated!')
      fetchUsers()
    } catch (err) {
      alert('Error: ' + (err.response?.data?.message || err.message))
    }
  }

  const handleDelete = async (userId) => {
    if (!confirm('Are you sure you want to delete this user?')) return

    try {
      await api.delete(`/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      alert('User deleted successfully!')
      fetchUsers()
    } catch (err) {
      alert('Error: ' + (err.response?.data?.message || err.message))
    }
  }

  if (loading) return <div style={{ padding: '2rem' }}>Loading...</div>

  const roleColors = {
    admin: '#dc3545',
    user: '#007bff',
    fleetManager: '#28a745',
    auditor: '#6c757d',
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>User Management</h1>
      <p>Total Users: {users.length} | Filtered: {filteredUsers.length}</p>

      {/* Search and Filters */}
      <div style={{ marginTop: '1rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '4px', background: '#f8f9fa' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'end' }}>
          <div>
            <label>Search: </label>
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ padding: '0.5rem', width: '300px', marginLeft: '0.5rem' }}
            />
          </div>
          <div>
            <label>Role: </label>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              style={{ padding: '0.5rem', marginLeft: '0.5rem' }}
            >
              <option value="all">All Roles</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="fleetManager">Fleet Manager</option>
              <option value="auditor">Auditor</option>
            </select>
          </div>
          <button
            onClick={() => {
              setSearchTerm('')
              setRoleFilter('all')
            }}
            style={{ padding: '0.5rem 1rem', background: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Clear Filters
          </button>
        </div>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #ddd', background: '#f8f9fa' }}>
            <th style={{ padding: '0.5rem', textAlign: 'left' }}>Name</th>
            <th style={{ padding: '0.5rem', textAlign: 'left' }}>Email</th>
            <th style={{ padding: '0.5rem', textAlign: 'left' }}>Role</th>
            <th style={{ padding: '0.5rem', textAlign: 'left' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user._id} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '0.5rem' }}>{user.name}</td>
              <td style={{ padding: '0.5rem' }}>{user.email}</td>
              <td style={{ padding: '0.5rem' }}>
                <select
                  value={user.role}
                  onChange={(e) => handleRoleUpdate(user._id, e.target.value)}
                  style={{
                    padding: '0.25rem',
                    background: roleColors[user.role] || '#ccc',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                  }}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="fleetManager">Fleet Manager</option>
                  <option value="auditor">Auditor</option>
                </select>
              </td>
              <td style={{ padding: '0.5rem' }}>
                <button
                  onClick={() => handleDelete(user._id)}
                  style={{
                    padding: '0.25rem 0.5rem',
                    background: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {filteredUsers.length === 0 && users.length > 0 && <p>No users match your filters.</p>}
      {users.length === 0 && <p>No users found.</p>}
    </div>
  )
}
