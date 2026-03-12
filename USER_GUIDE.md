# Vehicle Rental System - User Guide

## Table of Contents
1. [Getting Started](#getting-started)
2. [User Roles](#user-roles)
3. [For Regular Users](#for-regular-users)
4. [For Administrators](#for-administrators)
5. [For Fleet Managers](#for-fleet-managers)
6. [For Auditors](#for-auditors)
7. [Troubleshooting](#troubleshooting)

---

## Getting Started

### First Time Setup

1. **Register an Account**
   - Click on "Register" in the navigation bar
   - Fill in your name, email, and password
   - Select your role (for demo purposes)
   - Click "Register"

2. **Login**
   - Click on "Login" in the navigation bar
   - Enter your email and password
   - Click "Login"

3. **Browse Vehicles**
   - After logging in, you'll be redirected to the Vehicles page
   - Browse available vehicles
   - Use search and filters to find specific vehicles

---

## User Roles

The system supports four user roles:

1. **User** - Regular customers who can book vehicles
2. **Admin** - Full system access, can manage everything
3. **Fleet Manager** - Manages vehicle availability and condition
4. **Auditor** - Read-only access to reports and data

---

## For Regular Users

### Viewing Vehicles

1. Navigate to "Vehicles" from the navigation bar
2. Use the search bar to search by vehicle name or category
3. Filter by:
   - Category (e.g., Sedan, SUV, etc.)
   - Availability (Available/Not Available)
4. Click "View Details" on any vehicle to see more information

### Booking a Vehicle

1. Click on a vehicle to view its details
2. Click "Book Now" (only available for available vehicles)
3. Select your booking dates:
   - **From Date**: Start date of rental
   - **To Date**: End date of rental
4. The total amount will be calculated automatically
5. Click "Create Booking"
6. Your booking will be created with "Pending" status, awaiting admin approval

### Viewing Your Bookings

1. Click "My Bookings" in the navigation bar
2. View all your bookings with their current status:
   - **Pending**: Awaiting admin approval
   - **Approved**: Booking confirmed
   - **Completed**: Rental period finished
   - **Cancelled**: Booking was cancelled
3. Click "View Details" on any booking to see full information

### Booking Status Meanings

- **Pending**: Your booking request is waiting for admin approval
- **Approved**: Your booking has been confirmed by an admin
- **Completed**: The rental period has ended
- **Cancelled**: The booking was cancelled (by you or admin)

---

## For Administrators

### Admin Dashboard

Access the Admin Dashboard from the navigation bar to see:
- Total vehicles, bookings, and users
- Pending bookings requiring attention
- Revenue overview
- Quick action links

### Managing Vehicles

1. Navigate to "Manage Vehicles" or "Admin Dashboard" → "Manage Vehicles"
2. **Add Vehicle**:
   - Click "Add New Vehicle"
   - Fill in vehicle details (name, category, price, image URL)
   - Set availability and condition status
   - Click "Create Vehicle"

3. **Edit Vehicle**:
   - Find the vehicle in the list
   - Click "Edit"
   - Update any fields
   - Click "Update Vehicle"

4. **Delete Vehicle**:
   - Find the vehicle in the list
   - Click "Delete"
   - Confirm deletion

### Managing Bookings

1. Navigate to "Manage Bookings"
2. View all bookings from all users
3. **Search/Filter**:
   - Search by user name, vehicle name, or booking ID
   - Filter by status (Pending, Approved, Completed, Cancelled)
   - Filter by date range

4. **Update Booking Status**:
   - Find the booking
   - Click "Update Status"
   - Select new status (Pending, Approved, Completed, Cancelled)
   - Click "Update"

### Managing Users

1. Navigate to "Manage Users"
2. View all registered users
3. **Search/Filter**:
   - Search by name or email
   - Filter by role

4. **Update User Role**:
   - Find the user
   - Click "Change Role"
   - Select new role
   - Click "Update Role"

5. **Delete User**:
   - Find the user
   - Click "Delete"
   - Confirm deletion

### Generating Reports

1. Navigate to "Reports"
2. Select report type:
   - **Revenue Report**: Total revenue by date range
   - **Booking Report**: Booking statistics
   - **Usage Report**: Vehicle usage statistics
3. Select date range
4. Click "Generate Report"
5. Export to CSV if needed

---

## For Fleet Managers

### Fleet Manager Dashboard

1. Navigate to "Fleet Manager Dashboard"
2. View all vehicles with their current status

### Managing Vehicle Availability

1. Find the vehicle in the list
2. Click "Toggle Availability" to mark as available/unavailable
3. Vehicle availability affects whether users can book it

### Managing Vehicle Condition

1. Find the vehicle in the list
2. Click "Update Condition"
3. Select condition:
   - **Good**: Vehicle is in good condition and ready for rental
   - **Maintenance**: Vehicle is under maintenance and not available
4. Click "Update"

**Note**: Setting condition to "Maintenance" will automatically set availability to false.

---

## For Auditors

### Auditor Reports

1. Navigate to "Auditor Reports"
2. View read-only reports:
   - **Revenue Report**: Total revenue by date range
   - **Booking Report**: Booking statistics
   - **Usage Report**: Vehicle usage statistics
3. Select date range
4. Click "Generate Report"
5. Export to CSV if needed

**Note**: Auditors have read-only access and cannot modify any data.

---

## Troubleshooting

### Common Issues

1. **"You must be logged in" error**
   - Solution: Make sure you're logged in. Click "Login" and enter your credentials.

2. **Cannot book a vehicle**
   - Check if the vehicle is available
   - Make sure you're logged in
   - Verify the dates are valid (from date not in past, to date after from date)

3. **Booking status not updating**
   - Only admins can update booking status
   - Make sure you're logged in as an admin

4. **Cannot access admin pages**
   - Verify your user role is "admin"
   - Log out and log back in
   - Contact an administrator to update your role

5. **Vehicle not showing in list**
   - Check if filters are applied
   - Clear filters and search again
   - Verify the vehicle exists in the system

### Getting Help

If you encounter any issues:
1. Check this user guide
2. Verify your user role and permissions
3. Contact your system administrator

---

## Tips for Best Experience

1. **For Users**:
   - Book vehicles in advance for better availability
   - Check vehicle details before booking
   - Keep track of your booking status

2. **For Admins**:
   - Regularly review pending bookings
   - Keep vehicle information up to date
   - Monitor revenue reports regularly

3. **For Fleet Managers**:
   - Update vehicle condition promptly
   - Mark vehicles as unavailable when under maintenance
   - Keep availability status accurate

4. **For Auditors**:
   - Generate reports regularly for analysis
   - Export data to CSV for external analysis
   - Use date ranges to analyze trends

---

**Last Updated**: 2024
