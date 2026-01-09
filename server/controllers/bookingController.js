const Booking = require('../models/Booking');
const Vehicle = require('../models/Vehicle');

// Helper to update vehicle availability based on booking status
const updateVehicleAvailability = async (vehicleID, status) => {
  // When booking is Approved -> mark vehicle unavailable
  // When booking is Completed or Cancelled -> mark vehicle available
  if (status === 'Approved') {
    await Vehicle.findByIdAndUpdate(vehicleID, { isAvailable: false });
  }

  if (status === 'Completed' || status === 'Cancelled') {
    await Vehicle.findByIdAndUpdate(vehicleID, { isAvailable: true });
  }
};

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private (User)
const createBooking = async (req, res, next) => {
  try {
    const { vehicleID, fromDate, toDate, totalAmount } = req.body;

    if (!vehicleID || !fromDate || !toDate || totalAmount === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide vehicleID, fromDate, toDate, and totalAmount',
      });
    }

    // Ensure vehicle exists and is available
    const vehicle = await Vehicle.findById(vehicleID);
    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }

    if (!vehicle.isAvailable) {
      return res.status(400).json({ success: false, message: 'Vehicle is not available' });
    }

    // Simple date validation (fromDate should be before toDate)
    const from = new Date(fromDate);
    const to = new Date(toDate);

    if (isNaN(from.getTime()) || isNaN(to.getTime()) || from >= to) {
      return res.status(400).json({
        success: false,
        message: 'Invalid dates. fromDate should be before toDate',
      });
    }

    const booking = await Booking.create({
      userID: req.user.userId,
      vehicleID,
      fromDate: from,
      toDate: to,
      totalAmount,
      status: 'Pending',
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

    // Update vehicle availability based on new status
    await updateVehicleAvailability(booking.vehicleID, status);

    res.json({ success: true, data: booking });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getAllBookings,
  updateBookingStatus,
};


