# AGENTS.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

MERN stack vehicle rental system with role-based access (user, admin, fleetManager, auditor). The client and server are separate npm projects in `client/` and `server/` respectively — there is no root-level package.json.

## Build & Run Commands

### Server (Express + MongoDB)
```
cd server
npm install
npm start          # production: node server.js
npm run dev        # development: nodemon server.js (auto-restart)
npm run seed       # populate DB with sample users and vehicles
```

Requires a `server/.env` file with `PORT`, `MONGO_URI`, and `JWT_SECRET`.

### Client (React + Vite)
```
cd client
npm install
npm run dev        # development server at http://localhost:5173
npm run build      # production build to client/dist
npm run preview    # preview production build
npm run lint       # ESLint (flat config, React hooks + refresh plugins)
```

### No test suites exist
The server `test` script is a placeholder (`echo "Error: no test specified"`). The client has no test script. There are no test frameworks configured.

## Architecture

### Server (`server/`)

CommonJS modules (`"type": "commonjs"`). Express 5 with Mongoose 9.

**Request flow:** `server.js` → route files → controller functions → Mongoose models. Errors are forwarded via `next(error)` to a centralized `middleware/errorHandler.js`.

**Auth pattern:** JWT Bearer tokens. `middleware/auth.js` exports three middleware functions:
- `auth` — requires valid token, sets `req.user` (contains `userId`, `email`, `role`)
- `optionalAuth` — sets `req.user` if token present, continues otherwise
- `authorize(...roles)` — checks `req.user.role` against allowed roles

Routes compose these as: `router.get('/path', auth, authorize('admin'), controllerFn)`.

**Models:**
- `User` — roles: `user`, `admin`, `fleetManager`, `auditor`
- `Vehicle` — has `listingStatus` (Pending/Approved/Rejected) for fleet manager submissions requiring admin approval, plus `isAvailable` and `conditionStatus`
- `Booking` — status flow: Pending → Approved → Completed (or Cancelled). Stores both date-only (`fromDate`/`toDate`) and datetime (`fromDateTime`/`toDateTime`) fields.
- `Payment` — linked 1:1 to Booking. Revenue split is hardcoded: 5% auditor, 10% admin, 85% fleet manager. Static method `Payment.getSplitAmounts(total)` computes shares.

**API base path:** All routes mounted under `/api` (e.g., `/api/auth`, `/api/vehicles`, `/api/bookings`, `/api/users`, `/api/payments`).

### Client (`client/`)

ES modules (`"type": "module"`). React 19 + React Router DOM 7 + Axios. No CSS framework — uses inline styles and plain CSS (`index.css`, `App.css`).

**State management:** React Context only — `AuthContext` stores user/token in state and persists token to localStorage. No Redux or other state libraries.

**API calls:** All HTTP requests go through an Axios instance configured in `utils/api.js` with `baseURL: 'http://localhost:5000/api'`. Auth token is passed manually via headers (not via an Axios interceptor).

**Routing & access control:** `App.jsx` defines all routes. `ProtectedRoute` component checks auth status and optionally enforces `requiredRole` or `allowedRoles`. Role-specific page groups:
- `/admin/*` — admin only (Dashboard, VehicleManagement, BookingManagement, UserManagement, Reports, Transactions)
- `/fleet-manager/*` — fleetManager only (Dashboard, Transactions)
- `/auditor/*` — auditor only (Reports, PaymentManagement)
- `/vehicles`, `/my-bookings`, `/my-transactions` — any authenticated user

## Key Conventions

- Server API responses follow `{ success: boolean, message: string, data: {...} }` shape.
- Controller functions use `async (req, res, next)` with try/catch forwarding to `next(error)`.
- Mongoose schemas use `{ timestamps: true }` for automatic `createdAt`/`updatedAt`.
- Passwords hashed with bcryptjs (10 salt rounds). JWT tokens expire in 30 days.
- CORS is open (all origins allowed).
- The `role` field on User is a plain string enum, not a separate collection. Role values are case-sensitive: `user`, `admin`, `fleetManager`, `auditor`.

## Seed Data

`npm run seed` (in `server/`) creates test accounts:
- admin@example.com / admin123
- fleet@example.com / fleet123
- auditor@example.com / auditor123
- john@example.com / user123
- jane@example.com / user123
