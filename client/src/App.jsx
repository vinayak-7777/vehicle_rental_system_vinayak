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
import { BookingDetails } from './pages/BookingDetails'
import AdminDashboard from './pages/admin/Dashboard'
import VehicleManagement from './pages/admin/VehicleManagement'
import BookingManagement from './pages/admin/BookingManagement'
import UserManagement from './pages/admin/UserManagement'
import AdminReports from './pages/admin/Reports'
import AdminTransactions from './pages/admin/Transactions'
import FleetManagerDashboard from './pages/FleetManager/Dashboard'
import FleetManagerTransactions from './pages/FleetManager/Transactions'
import AuditorReports from './pages/Auditor/Reports'
import AuditorPaymentManagement from './pages/Auditor/PaymentManagement'
import { MyTransactions } from './pages/MyTransactions'

function App() {
  return (
    <AuthProvider>
      <div>
        <Navbar />
        <Routes>
          {/* Default route goes to Login */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* User routes */}
          <Route path="/vehicles" element={<VehicleList />} />
          <Route path="/vehicles/:id" element={<VehicleDetails />} />
          <Route
            path="/vehicles/:id/book"
            element={
              <ProtectedRoute>
                <BookingForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-bookings"
            element={
              <ProtectedRoute>
                <MyBookings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bookings/:id"
            element={
              <ProtectedRoute>
                <BookingDetails />
              </ProtectedRoute>
            }
          />
          
          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/vehicles" element={<ProtectedRoute requiredRole="admin"><VehicleManagement /></ProtectedRoute>} />
          <Route path="/admin/bookings" element={<ProtectedRoute requiredRole="admin"><BookingManagement /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute requiredRole="admin"><UserManagement /></ProtectedRoute>} />
          <Route path="/admin/reports" element={<ProtectedRoute requiredRole="admin"><AdminReports /></ProtectedRoute>} />
          <Route path="/admin/transactions" element={<ProtectedRoute requiredRole="admin"><AdminTransactions /></ProtectedRoute>} />
          
          {/* Fleet Manager Routes */}
          <Route path="/fleet-manager/dashboard" element={<ProtectedRoute requiredRole="fleetManager"><FleetManagerDashboard /></ProtectedRoute>} />
          <Route path="/fleet-manager/transactions" element={<ProtectedRoute requiredRole="fleetManager"><FleetManagerTransactions /></ProtectedRoute>} />
          
          {/* Auditor Routes */}
          <Route path="/auditor/reports" element={<ProtectedRoute requiredRole="auditor"><AuditorReports /></ProtectedRoute>} />
          <Route path="/auditor/payments" element={<ProtectedRoute requiredRole="auditor"><AuditorPaymentManagement /></ProtectedRoute>} />
          
          {/* User: My Transactions (all logged-in users) */}
          <Route path="/my-transactions" element={<ProtectedRoute><MyTransactions /></ProtectedRoute>} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </AuthProvider>
  )
}

export default App
