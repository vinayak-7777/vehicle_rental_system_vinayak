const Payment = require('../models/Payment');
const Booking = require('../models/Booking');

// @desc    Get all payments (for Auditor/Admin)
// @route   GET /api/payments
// @access  Private (Auditor, Admin)
const getPayments = async (req, res, next) => {
  try {
    const payments = await Payment.find()
      .populate({
        path: 'bookingID',
        populate: [
          { path: 'userID', select: 'name email' },
          { path: 'vehicleID', select: 'vehicleName category' },
        ],
      })
      .sort({ createdAt: -1 });

    res.json({ success: true, data: payments });
  } catch (error) {
    next(error);
  }
};

// @desc    Get payment for a booking
// @route   GET /api/payments/booking/:bookingId
// @access  Private (owner, admin, auditor)
const getPaymentByBooking = async (req, res, next) => {
  try {
    const payment = await Payment.findOne({ bookingID: req.params.bookingId })
      .populate({
        path: 'bookingID',
        populate: [
          { path: 'userID', select: 'name email' },
          { path: 'vehicleID', select: 'vehicleName category pricePerDay' },
        ],
      });

    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found for this booking' });
    }

    const bookingUserId = payment.bookingID?.userID?._id ?? payment.bookingID?.userID;
    const isOwner = bookingUserId && String(bookingUserId) === String(req.user.userId);
    const isAdmin = req.user.role === 'admin';
    const isAuditor = req.user.role === 'auditor';
    if (!isOwner && !isAdmin && !isAuditor) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this payment' });
    }

    res.json({ success: true, data: payment });
  } catch (error) {
    next(error);
  }
};

// @desc    Get payments for current user's bookings (for Pay button status)
// @route   GET /api/payments/my
// @access  Private (User)
const getMyPayments = async (req, res, next) => {
  try {
    const myBookings = await Booking.find({ userID: req.user.userId }).select('_id');
    const bookingIds = myBookings.map((b) => b._id);
    const payments = await Payment.find({ bookingID: { $in: bookingIds } })
      .populate({
        path: 'bookingID',
        populate: [
          { path: 'vehicleID', select: 'vehicleName category' },
        ],
      })
      .sort({ createdAt: -1 });
    res.json({ success: true, data: payments });
  } catch (error) {
    next(error);
  }
};

// @desc    Auditor distributes payment: 5% Auditor, 10% Admin, 85% Fleet Manager
// @route   POST /api/payments/:id/distribute
// @access  Private (Auditor only)
const distributePayment = async (req, res, next) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }
    if (payment.status !== 'paid') {
      return res.status(400).json({
        success: false,
        message: 'Only paid payments can be distributed. User must pay first.',
      });
    }

    const { auditorShare, adminShare, fleetManagerShare } = Payment.getSplitAmounts(payment.totalAmount);

    payment.auditorShare = auditorShare;
    payment.adminShare = adminShare;
    payment.fleetManagerShare = fleetManagerShare;
    payment.status = 'distributed';
    payment.distributedAt = new Date();
    await payment.save();

    res.json({
      success: true,
      data: payment,
      message: 'Payment distributed: Auditor 5%, Admin 10%, Fleet Manager 85%',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPayments,
  getPaymentByBooking,
  getMyPayments,
  distributePayment,
};
