# Vehicle Rental System - MERN Stack Project

A complete web-based vehicle rental management system built with MongoDB, Express, React, and Node.js. This system allows customers to view and book vehicles, while admins and fleet managers can manage vehicles, bookings, and users.

## 🚀 Features

### User (Customer)
- Register and Login
- View available vehicles
- Search and filter vehicles by category and availability
- Book vehicles for selected dates
- View personal bookings and status

### Admin
- Secure Admin Dashboard with statistics
- Add, Edit, Delete vehicles
- Manage all bookings and update status
- Manage users (view, update roles, delete)
- Generate reports

### Fleet Manager
- View all vehicles
- Update vehicle availability (Available/Not Available)
- Mark vehicles as "Under Maintenance" or "Good" condition
- Monitor fleet status

### Auditor (Read-Only)
- View booking reports
- View revenue and usage statistics
- View vehicle usage reports
- Cannot modify any data

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (Local installation or MongoDB Atlas account)
- npm or yarn

## 🛠️ Installation

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd project
```

### 2. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in the `server` folder:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/vehicle-rental
JWT_SECRET=your-super-secret-jwt-key-12345
```

### 3. Frontend Setup

```bash
cd ../client
npm install
```

## 🗄️ Database Setup

### Option 1: Local MongoDB

1. Install MongoDB locally
2. Start MongoDB service
3. Use the connection string in `.env`: `mongodb://localhost:27017/vehicle-rental`

### Option 2: MongoDB Atlas (Cloud)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster and get connection string
3. Update `.env` with your Atlas connection string

## 🌱 Seed Sample Data

To populate the database with sample vehicles and test users:

```bash
cd server
npm run seed
```

This will create:
- **5 sample users** (admin, fleet manager, auditor, 2 regular users)
- **8 sample vehicles** (cars, bikes, trucks)

### Default Login Credentials

After seeding:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@example.com | admin123 |
| Fleet Manager | fleet@example.com | fleet123 |
| Auditor | auditor@example.com | auditor123 |
| User | john@example.com | user123 |
| User | jane@example.com | user123 |

## 🚀 Running the Application

### Start Backend Server

```bash
cd server
npm start
# or for development with auto-restart:
npm run dev
```

Server will run on `http://localhost:5000`

### Start Frontend Development Server

```bash
cd client
npm run dev
```

Frontend will run on `http://localhost:5173` (or another port if 5173 is busy)

## 📁 Project Structure

```
project/
├── server/                 # Backend (Express + Node.js)
│   ├── config/            # Database configuration
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Auth & error handling
│   ├── models/            # Mongoose models
│   ├── routes/            # API routes
│   ├── scripts/           # Seed script
│   └── server.js          # Entry point
│
├── client/                # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── context/       # React Context (Auth)
│   │   ├── pages/         # Page components
│   │   │   ├── admin/     # Admin pages
│   │   │   ├── FleetManager/  # Fleet Manager pages
│   │   │   └── Auditor/   # Auditor pages
│   │   └── utils/         # Utilities (API config)
│   └── package.json
│
└── README.md
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)

### Vehicles
- `GET /api/vehicles` - Get all vehicles (with filters: `?category=Car&available=true`)
- `GET /api/vehicles/:id` - Get single vehicle
- `POST /api/vehicles` - Add vehicle (Admin only)
- `PUT /api/vehicles/:id` - Update vehicle (Admin/Fleet Manager)
- `DELETE /api/vehicles/:id` - Delete vehicle (Admin only)

### Bookings
- `POST /api/bookings` - Create booking (User)
- `GET /api/bookings/my` - Get user's bookings
- `GET /api/bookings` - Get all bookings (Admin)
- `PUT /api/bookings/:id/status` - Update booking status (Admin)

### Users (Admin only)
- `GET /api/users` - List all users
- `PUT /api/users/:id/role` - Update user role
- `DELETE /api/users/:id` - Delete user

## 🎯 Usage Guide

### For Evaluators/Demo

1. **Start the servers** (backend and frontend)
2. **Login as Admin**: `admin@example.com / admin123`
   - View dashboard with statistics
   - Manage vehicles (add/edit/delete)
   - Manage bookings (approve/reject)
   - Manage users (change roles)
3. **Login as Fleet Manager**: `fleet@example.com / fleet123`
   - View fleet dashboard
   - Update vehicle availability
   - Update vehicle condition
4. **Login as Auditor**: `auditor@example.com / auditor123`
   - View read-only reports
   - See revenue and usage statistics
5. **Login as User**: `john@example.com / user123`
   - Browse vehicles
   - Create bookings
   - View personal bookings

## 🧪 Testing

- Test all user flows: registration, login, booking, management
- Test role-based access (try accessing admin pages as regular user)
- Test booking status updates (Pending → Approved → Completed)
- Test vehicle availability updates

## 📝 Notes

- This is a **final year project** - simplified for demonstration purposes
- JWT tokens expire in 30 days
- Password hashing uses bcrypt with 10 salt rounds
- All dates should be in ISO format
- Vehicle availability updates automatically when bookings are approved/completed

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check `.env` file has correct `MONGO_URI`
- Verify MongoDB connection string format

### Port Already in Use
- Change `PORT` in server `.env` file
- Or kill the process using the port

### CORS Issues
- Backend has CORS enabled for all origins
- If issues persist, check `server.js` CORS configuration

## 📄 License

This project is created for educational purposes as a final year project.

---

**Built with ❤️ using MERN Stack**
