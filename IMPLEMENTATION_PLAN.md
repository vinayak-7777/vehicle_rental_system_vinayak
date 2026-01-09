# Vehicle Rental System - Implementation Plan

## 📋 Phase Overview

### **Phase 1: Backend Foundation** ✅ (Partially Done)
- [x] Express server setup
- [x] MongoDB connection
- [x] User model (needs role update)
- [ ] Install additional dependencies
- [ ] Vehicle model
- [ ] Booking model
- [ ] Auth middleware
- [ ] Error handling middleware

### **Phase 2: Authentication System**
- [ ] Password hashing (bcrypt)
- [ ] JWT token generation
- [ ] Register endpoint
- [ ] Login endpoint
- [ ] Get current user endpoint
- [ ] Protect routes middleware

### **Phase 3: Vehicle Management (Backend)**
- [ ] Vehicle CRUD endpoints
- [ ] Vehicle filtering/search
- [ ] Admin/Fleet Manager authorization
- [ ] Vehicle availability logic

### **Phase 4: Booking System (Backend)**
- [ ] Create booking endpoint
- [ ] Get user bookings
- [ ] Get all bookings (Admin)
- [ ] Update booking status
- [ ] Booking validation (date conflicts)

### **Phase 5: Frontend - Core Pages**
- [ ] Login/Register pages
- [ ] Vehicle listing page
- [ ] Vehicle details page
- [ ] Booking form page
- [ ] My Bookings page
- [ ] Basic navigation

### **Phase 6: Frontend - Admin Dashboard**
- [ ] Admin login/dashboard
- [ ] Vehicle management (CRUD)
- [ ] Booking management
- [ ] User management
- [ ] Reports/Statistics

### **Phase 7: Frontend - Fleet Manager & Auditor**
- [ ] Fleet Manager dashboard
- [ ] Vehicle status updates
- [ ] Auditor read-only reports

### **Phase 8: Polish & Testing**
- [ ] Error handling
- [ ] Loading states
- [ ] Form validations
- [ ] Sample data seeding
- [ ] Final testing

---

## 🔧 Additional Dependencies Needed

### Server:
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT tokens
- `express-validator` (optional but helpful) - Input validation

### Client:
- `axios` - API calls
- Context API or simple state management for auth

---

## 📁 Recommended Folder Structure

### Server:
```
server/
├── config/
│   └── db.js ✅
├── models/
│   ├── User.js ✅ (needs role update)
│   ├── Vehicle.js
│   └── Booking.js
├── middleware/
│   ├── auth.js
│   └── errorHandler.js
├── routes/
│   ├── auth.js
│   ├── vehicles.js
│   ├── bookings.js
│   └── users.js (Admin only)
├── controllers/
│   ├── authController.js
│   ├── vehicleController.js
│   ├── bookingController.js
│   └── userController.js
└── server.js ✅
```

### Client:
```
client/src/
├── pages/
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── VehicleList.jsx
│   ├── VehicleDetails.jsx
│   ├── BookingForm.jsx
│   ├── MyBookings.jsx
│   ├── Admin/
│   │   ├── Dashboard.jsx
│   │   ├── VehicleManagement.jsx
│   │   ├── BookingManagement.jsx
│   │   └── UserManagement.jsx
│   ├── FleetManager/
│   │   └── Dashboard.jsx
│   └── Auditor/
│       └── Reports.jsx
├── components/
│   ├── Navbar.jsx
│   ├── VehicleCard.jsx
│   └── ProtectedRoute.jsx
├── context/
│   └── AuthContext.jsx
├── utils/
│   └── api.js
└── App.jsx
```

---

## 🔄 Recommended API Endpoints (Enhanced)

### Auth:
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user (Protected)

### Vehicles:
- `GET /api/vehicles` - List all vehicles (with filters: ?category=Car&available=true)
- `GET /api/vehicles/:id` - Get single vehicle
- `POST /api/vehicles` - Add vehicle (Admin only)
- `PUT /api/vehicles/:id` - Update vehicle (Admin/FleetManager)
- `DELETE /api/vehicles/:id` - Delete vehicle (Admin only)

### Bookings:
- `POST /api/bookings` - Create booking (User)
- `GET /api/bookings/my` - Get user's bookings (User)
- `GET /api/bookings` - Get all bookings (Admin)
- `PUT /api/bookings/:id/status` - Update status (Admin)
- `GET /api/bookings/:id` - Get single booking

### Users (Admin only):
- `GET /api/users` - List all users (Admin)
- `PUT /api/users/:id/role` - Update user role (Admin)
- `DELETE /api/users/:id` - Delete user (Admin)

---

## 🎯 Quick Wins for Demo

1. **Sample Data Script**: Create a script to seed database with sample vehicles and test users
2. **Pre-created Admin Account**: Have a default admin account for demo
3. **Simple UI**: Use basic CSS or a simple UI library (keep it clean but functional)
4. **Clear Navigation**: Easy switching between user roles for demo

---

## ⚠️ Important Notes

1. **Role Enum Update**: User model currently only has 'user' and 'admin'. Need to add 'fleetManager' and 'auditor'
2. **Date Handling**: Use proper date validation to prevent booking conflicts
3. **Availability Logic**: When booking is approved, vehicle availability should update
4. **Error Messages**: Keep error messages user-friendly for demo
5. **Loading States**: Show loading indicators for better UX during demo

