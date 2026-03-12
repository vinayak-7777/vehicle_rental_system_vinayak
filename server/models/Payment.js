const mongoose = require('mongoose');

const PAYMENT_SPLIT = {
  AUDITOR_PERCENT: 5,
  ADMIN_PERCENT: 10,
  FLEET_MANAGER_PERCENT: 85,
};

const paymentSchema = new mongoose.Schema(
  {
    bookingID: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true, unique: true },
    totalAmount: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ['pending', 'paid', 'distributed'],
      default: 'pending',
    },
    paidAt: { type: Date },
    distributedAt: { type: Date },
    auditorShare: { type: Number, default: 0 },
    adminShare: { type: Number, default: 0 },
    fleetManagerShare: { type: Number, default: 0 },
  },
  { timestamps: true }
);

paymentSchema.statics.getSplitAmounts = (totalAmount) => {
  return {
    auditorShare: Math.round((totalAmount * PAYMENT_SPLIT.AUDITOR_PERCENT) / 100),
    adminShare: Math.round((totalAmount * PAYMENT_SPLIT.ADMIN_PERCENT) / 100),
    fleetManagerShare: Math.round((totalAmount * PAYMENT_SPLIT.FLEET_MANAGER_PERCENT) / 100),
  };
};

module.exports = mongoose.model('Payment', paymentSchema);
module.exports.PAYMENT_SPLIT = PAYMENT_SPLIT;
