const express = require('express');
const router = express.Router();

const {
  createBooking,
  getMyBookings,
  getAllBookings,
  updateBookingStatus,
  cancelBooking,
  payBooking,
} = require('../controllers/bookingController');

const { auth, authorize } = require('../middleware/auth');

// User routes
router.post('/', auth, authorize('user', 'admin', 'fleetManager', 'auditor'), createBooking);
router.get('/my', auth, authorize('user', 'admin', 'fleetManager', 'auditor'), getMyBookings);
router.post('/:id/cancel', auth, authorize('user', 'admin', 'fleetManager', 'auditor'), cancelBooking);
router.post('/:id/pay', auth, authorize('user', 'admin', 'fleetManager', 'auditor'), payBooking);

// Admin and Auditor routes (auditor manages bookings e.g. cancellation/status)
router.get('/', auth, authorize('admin', 'auditor'), getAllBookings);
router.put('/:id/status', auth, authorize('admin', 'auditor'), updateBookingStatus);

module.exports = router;


