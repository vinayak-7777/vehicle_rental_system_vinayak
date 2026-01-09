const express = require('express');
const router = express.Router();

const {
  createBooking,
  getMyBookings,
  getAllBookings,
  updateBookingStatus,
} = require('../controllers/bookingController');

const { auth, authorize } = require('../middleware/auth');

// User routes
router.post('/', auth, authorize('user', 'admin', 'fleetManager', 'auditor'), createBooking);
router.get('/my', auth, authorize('user', 'admin', 'fleetManager', 'auditor'), getMyBookings);

// Admin routes
router.get('/', auth, authorize('admin'), getAllBookings);
router.put('/:id/status', auth, authorize('admin'), updateBookingStatus);

module.exports = router;


