const Booking = require('../models/Booking');
const Vehicle = require('../models/Vehicle');
const Payment = require('../models/Payment');

// Helper to update vehicle availability based on booking status
const updateVehicleAvailability = async (vehicleID, status) => {
  if (status === 'Approved') {
    await Vehicle.findByIdAndUpdate(vehicleID, { isAvailable: false });
  }
  if (status === 'Completed' || status === 'Cancelled') {
    await Vehicle.findByIdAndUpdate(vehicleID, { isAvailable: true });
  }
};

// Build datetime from date string and time string (HH:mm)
const buildDateTime = (dateStr, timeStr) => {
  if (!dateStr || !timeStr) return null;
  const d = new Date(dateStr + 'T' + timeStr + ':00');
  return isNaN(d.getTime()) ? null : d;
};

// Calculate total amount: duration in days (ceiling) * pricePerDay, minimum 1 day
const calculateTotalAmount = (fromDateTime, toDateTime, pricePerDay) => {
  const durationMs = new Date(toDateTime) - new Date(fromDateTime);
  const durationDays = Math.max(1, Math.ceil(durationMs / (24 * 60 * 60 * 1000)));
  return durationDays * pricePerDay;
};

// @desc    Create new booking (fromDate, fromTime, toDate, toTime; totalAmount calculated on server)
// @route   POST /api/bookings
// @access  Private (User)
const createBooking = async (req, res, next) => {
  try {
    const { vehicleID, fromDate, fromTime, toDate, toTime } = req.body;

    if (!vehicleID || !fromDate || !fromTime || !toDate || !toTime) {
      return res.status(400).json({
        success: false,
        message: 'Please provide vehicleID, fromDate, fromTime, toDate, and toTime',
      });
    }

    const vehicle = await Vehicle.findById(vehicleID);
    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }
    if (!vehicle.isAvailable) {
      return res.status(400).json({ success: false, message: 'Vehicle is not available' });
    }

    const fromDateTime = buildDateTime(fromDate, fromTime);
    const toDateTime = buildDateTime(toDate, toTime);

    if (!fromDateTime || !toDateTime) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date or time format. Use date (YYYY-MM-DD) and time (HH:mm).',
      });
    }

    if (fromDateTime >= toDateTime) {
      return res.status(400).json({
        success: false,
        message: 'From date & time must be before To date & time',
      });
    }

    const now = new Date();
    if (fromDateTime < now) {
      return res.status(400).json({
        success: false,
        message: 'From date & time cannot be in the past',
      });
    }

    const totalAmount = calculateTotalAmount(fromDateTime, toDateTime, vehicle.pricePerDay);
    const fromDateOnly = new Date(fromDate);
    const toDateOnly = new Date(toDate);

    const booking = await Booking.create({
      userID: req.user.userId,
      vehicleID,
      fromDate: fromDateOnly,
      toDate: toDateOnly,
      fromDateTime,
      toDateTime,
      totalAmount,
      status: 'Pending',
    });

    await Payment.create({
      bookingID: booking._id,
      totalAmount,
      status: 'pending',
    });

    res.status(201).json({ success: true, data: booking });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user's bookings
// @route   GET /api/bookings/my
// @access  Private (User)
const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ userID: req.user.userId })
      .populate('vehicleID')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: bookings });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Private (Admin)
const getAllBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find()
      .populate('userID', 'name email role')
      .populate('vehicleID')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: bookings });
  } catch (error) {
    next(error);
  }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
// @access  Private (Admin)
const updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a status',
      });
    }

    if (!['Pending', 'Approved', 'Completed', 'Cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value',
      });
    }

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    booking.status = status;
    await booking.save();

    await updateVehicleAvailability(booking.vehicleID, status);

    res.json({ success: true, data: booking });
  } catch (error) {
    next(error);
  }
};

// Cancellation: user can cancel only up to 5 minutes before the booked start time (fromDateTime)
const CANCELLATION_MINUTES = 5;

// @desc    User cancels own booking (only if > 5 min before start)
// @route   POST /api/bookings/:id/cancel
// @access  Private (booking owner)
const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    if (booking.userID.toString() !== req.user.userId) {
      return res.status(403).json({ success: false, message: 'You can only cancel your own booking' });
    }
    if (booking.status === 'Cancelled') {
      return res.status(400).json({ success: false, message: 'Booking is already cancelled' });
    }

    const fromDateTime = new Date(booking.fromDateTime);
    const cutoff = new Date(fromDateTime.getTime() - CANCELLATION_MINUTES * 60 * 1000);
    if (new Date() >= cutoff) {
      return res.status(400).json({
        success: false,
        message: `Cancellation is allowed only up to ${CANCELLATION_MINUTES} minutes before the booked start time. It is too late to cancel.`,
      });
    }

    booking.status = 'Cancelled';
    await booking.save();
    await updateVehicleAvailability(booking.vehicleID, 'Cancelled');

    res.json({ success: true, data: booking, message: 'Booking cancelled successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    User pays 100% to auditor (simulated payment)
// @route   POST /api/bookings/:id/pay
// @access  Private (booking owner)
const payBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('vehicleID');
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    if (booking.userID.toString() !== req.user.userId) {
      return res.status(403).json({ success: false, message: 'You can only pay for your own booking' });
    }
    if (booking.status !== 'Approved') {
      return res.status(400).json({ success: false, message: 'Only approved bookings can be paid' });
    }

    const payment = await Payment.findOne({ bookingID: booking._id });
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment record not found' });
    }
    if (payment.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'This booking has already been paid' });
    }

    payment.status = 'paid';
    payment.paidAt = new Date();
    await payment.save();

    res.json({ success: true, data: payment, message: 'Payment successful (simulated). Amount received by Auditor.' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getAllBookings,
  updateBookingStatus,
  cancelBooking,
  payBooking,
};


