# Client - Frontend React Application

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Available Scripts

- `npm run dev` - Start development server (usually on port 5173)
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/        # Reusable components
│   ├── Navbar.jsx
│   └── ProtectedRoute.jsx
├── context/          # React Context
│   └── AuthContext.jsx
├── pages/            # Page components
│   ├── admin/        # Admin pages
│   ├── FleetManager/ # Fleet Manager pages
│   ├── Auditor/      # Auditor pages
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── VehicleList.jsx
│   ├── VehicleDetails.jsx
│   ├── BookingForm.jsx
│   └── MyBookings.jsx
├── utils/            # Utilities
│   └── api.js        # Axios configuration
├── App.jsx           # Main app component with routing
└── main.jsx          # Entry point
```

## API Configuration

The API base URL is configured in `src/utils/api.js`. Default: `http://localhost:5000/api`

To change the API URL, update:
```javascript
baseURL: (import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api'
```

For deployment (e.g. Vercel), set a Vite environment variable:
```env
VITE_API_URL=https://your-backend.onrender.com
```

## Authentication

Authentication is handled via React Context (`AuthContext`). The JWT token is stored in `localStorage` and automatically included in API requests.

## Routes

- `/` - Vehicle listing (public)
- `/login` - Login page
- `/register` - Registration page
- `/vehicles/:id` - Vehicle details
- `/vehicles/:id/book` - Booking form (protected)
- `/my-bookings` - User's bookings (protected)
- `/admin/dashboard` - Admin dashboard (admin only)
- `/admin/vehicles` - Vehicle management (admin only)
- `/admin/bookings` - Booking management (admin only)
- `/admin/users` - User management (admin only)
- `/fleet-manager/dashboard` - Fleet Manager dashboard (fleetManager only)
- `/auditor/reports` - Auditor reports (auditor only)

## Protected Routes

Routes are protected using the `ProtectedRoute` component which checks:
- User is authenticated
- User has the required role (if specified)
