# Server - Backend API Documentation

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/vehicle-rental
JWT_SECRET=your-super-secret-jwt-key-12345
```

3. Seed sample data (optional):
```bash
npm run seed
```

4. Start server:
```bash
npm start
# or for development:
npm run dev
```

## Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon (if installed)
- `npm run seed` - Seed database with sample data

## API Base URL

`http://localhost:5000/api`

## Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Models

### User
- name (String)
- email (String, unique)
- password (String, hashed)
- role (enum: 'user', 'admin', 'fleetManager', 'auditor')
- timestamps

### Vehicle
- vehicleName (String)
- category (String)
- pricePerDay (Number)
- imageURL (String)
- isAvailable (Boolean)
- conditionStatus (enum: 'Good', 'Maintenance')
- timestamps

### Booking
- userID (ObjectId, ref: User)
- vehicleID (ObjectId, ref: Vehicle)
- fromDate (Date)
- toDate (Date)
- totalAmount (Number)
- status (enum: 'Pending', 'Approved', 'Completed', 'Cancelled')
- timestamps

## Error Handling

All errors are handled by the error handler middleware and return JSON responses:

```json
{
  "success": false,
  "message": "Error message here"
}
```
