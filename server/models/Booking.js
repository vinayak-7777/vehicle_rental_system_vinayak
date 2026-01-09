const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    vehicleID: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
    fromDate: { type: Date, required: true },
    toDate: { type: Date, required: true },
    totalAmount: { type: Number, required: true, min: 0 },
    status: { type: String, enum: ['Pending', 'Approved', 'Completed', 'Cancelled'], default: 'Pending' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);

