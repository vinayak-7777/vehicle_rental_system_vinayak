import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { Navbar } from './components/Navbar'
import { ProtectedRoute } from './components/ProtectedRoute'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { VehicleList } from './pages/VehicleList'
import { VehicleDetails } from './pages/VehicleDetails'
import { BookingForm } from './pages/BookingForm'
import { MyBookings } from './pages/MyBookings'
import AdminDashboard from './pages/admin/Dashboard'
import VehicleManagement from './pages/admin/VehicleManagement'
import BookingManagement from './pages/admin/BookingManagement'
import UserManagement from './pages/admin/UserManagement'

function App() {
  return (
    <AuthProvider>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<VehicleList />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/vehicles/:id" element={<VehicleDetails />} />
          <Route path="/vehicles/:id/book" element={<ProtectedRoute><BookingForm /></ProtectedRoute>} />
          <Route path="/my-bookings" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
          
          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/vehicles" element={<ProtectedRoute requiredRole="admin"><VehicleManagement /></ProtectedRoute>} />
          <Route path="/admin/bookings" element={<ProtectedRoute requiredRole="admin"><BookingManagement /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute requiredRole="admin"><UserManagement /></ProtectedRoute>} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </AuthProvider>
  )
}

export default App
