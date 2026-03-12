const express = require('express');
const router = express.Router();
const {
  getPayments,
  getPaymentByBooking,
  getMyPayments,
  distributePayment,
} = require('../controllers/paymentController');
const { auth, authorize } = require('../middleware/auth');

// All payments (Admin, Auditor, Fleet Manager view)
router.get('/', auth, authorize('admin', 'auditor', 'fleetManager'), getPayments);

// Current user's payments (for User / My Transactions)
router.get('/my', auth, getMyPayments);

// Payment for a specific booking (owner, admin, or auditor)
router.get('/booking/:bookingId', auth, getPaymentByBooking);

// Auditor only: distribute a paid payment (5% auditor, 10% admin, 85% fleet manager)
router.post('/:id/distribute', auth, authorize('auditor'), distributePayment);

module.exports = router;
