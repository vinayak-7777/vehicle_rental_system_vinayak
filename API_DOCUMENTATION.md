# Vehicle Rental System - API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication

Most endpoints require authentication via JWT token. Include the token in the Authorization header:
```
Authorization: Bearer <your-token>
```

---

## Authentication Endpoints

### Register User
**POST** `/auth/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "jwt-token-here",
    "user": {
      "_id": "user-id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    }
  }
}
```

### Login
**POST** `/auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "jwt-token-here",
    "user": {
      "_id": "user-id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    }
  }
}
```

### Get Current User
**GET** `/auth/me`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "user-id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    }
  }
}
```

---

## Vehicle Endpoints

### Get All Vehicles
**GET** `/vehicles`

**Query Parameters (optional):**
- `category`: Filter by category
- `isAvailable`: Filter by availability (true/false)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "vehicle-id",
      "vehicleName": "Toyota Camry",
      "category": "Sedan",
      "pricePerDay": 1500,
      "imageURL": "https://example.com/image.jpg",
      "isAvailable": true,
      "conditionStatus": "Good",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### Get Vehicle by ID
**GET** `/vehicles/:id`

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "vehicle-id",
    "vehicleName": "Toyota Camry",
    "category": "Sedan",
    "pricePerDay": 1500,
    "imageURL": "https://example.com/image.jpg",
    "isAvailable": true,
    "conditionStatus": "Good"
  }
}
```

### Create Vehicle (Admin Only)
**POST** `/vehicles`

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Request Body:**
```json
{
  "vehicleName": "Toyota Camry",
  "category": "Sedan",
  "pricePerDay": 1500,
  "imageURL": "https://example.com/image.jpg",
  "isAvailable": true,
  "conditionStatus": "Good"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "vehicle-id",
    "vehicleName": "Toyota Camry",
    "category": "Sedan",
    "pricePerDay": 1500,
    "imageURL": "https://example.com/image.jpg",
    "isAvailable": true,
    "conditionStatus": "Good"
  }
}
```

### Update Vehicle (Admin Only)
**PUT** `/vehicles/:id`

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Request Body:**
```json
{
  "vehicleName": "Updated Name",
  "pricePerDay": 2000,
  "isAvailable": false
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "vehicle-id",
    "vehicleName": "Updated Name",
    "pricePerDay": 2000,
    "isAvailable": false
  }
}
```

### Delete Vehicle (Admin Only)
**DELETE** `/vehicles/:id`

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Response:**
```json
{
  "success": true,
  "message": "Vehicle deleted successfully"
}
```

---

## Booking Endpoints

### Create Booking (Authenticated Users)
**POST** `/bookings`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "vehicleID": "vehicle-id",
  "fromDate": "2024-01-15",
  "toDate": "2024-01-20",
  "totalAmount": 7500
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "booking-id",
    "userID": "user-id",
    "vehicleID": "vehicle-id",
    "fromDate": "2024-01-15T00:00:00.000Z",
    "toDate": "2024-01-20T00:00:00.000Z",
    "totalAmount": 7500,
    "status": "Pending"
  }
}
```

### Get My Bookings (Authenticated Users)
**GET** `/bookings/my`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "booking-id",
      "userID": {
        "_id": "user-id",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "vehicleID": {
        "_id": "vehicle-id",
        "vehicleName": "Toyota Camry",
        "category": "Sedan"
      },
      "fromDate": "2024-01-15T00:00:00.000Z",
      "toDate": "2024-01-20T00:00:00.000Z",
      "totalAmount": 7500,
      "status": "Pending"
    }
  ]
}
```

### Get All Bookings (Admin/Auditor Only)
**GET** `/bookings`

**Headers:**
```
Authorization: Bearer <admin-or-auditor-token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "booking-id",
      "userID": {
        "_id": "user-id",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "vehicleID": {
        "_id": "vehicle-id",
        "vehicleName": "Toyota Camry"
      },
      "fromDate": "2024-01-15T00:00:00.000Z",
      "toDate": "2024-01-20T00:00:00.000Z",
      "totalAmount": 7500,
      "status": "Pending"
    }
  ]
}
```

### Update Booking Status (Admin Only)
**PUT** `/bookings/:id/status`

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Request Body:**
```json
{
  "status": "Approved"
}
```

**Valid Status Values:**
- `Pending`
- `Approved`
- `Completed`
- `Cancelled`

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "booking-id",
    "status": "Approved"
  }
}
```

---

## User Management Endpoints (Admin/Auditor Only)

### Get All Users
**GET** `/users`

**Headers:**
```
Authorization: Bearer <admin-or-auditor-token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "user-id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### Update User Role (Admin Only)
**PUT** `/users/:id/role`

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Request Body:**
```json
{
  "role": "admin"
}
```

**Valid Roles:**
- `user`
- `admin`
- `fleetManager`
- `auditor`

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "user-id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "admin"
  }
}
```

### Delete User (Admin Only)
**DELETE** `/users/:id`

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Response:**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

---

## Error Responses

All endpoints may return error responses in the following format:

```json
{
  "success": false,
  "message": "Error message here"
}
```

### Common HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized (missing or invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

---

## Rate Limiting

Currently, there is no rate limiting implemented. For production use, consider implementing rate limiting.

---

## Notes

1. All dates should be in ISO 8601 format (YYYY-MM-DD or full ISO datetime)
2. All monetary values are in the base currency (₹ - Indian Rupees)
3. JWT tokens expire after a set period (configured in backend)
4. Passwords are hashed using bcrypt before storage
5. Vehicle availability is automatically updated when bookings are approved/completed

---

**Last Updated**: 2024
