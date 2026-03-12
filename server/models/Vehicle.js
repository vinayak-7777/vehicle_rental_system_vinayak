const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema(
  {
    vehicleName: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    pricePerDay: { type: Number, required: true, min: 0 },
    imageURL: { type: String, default: '' },
    isAvailable: { type: Boolean, default: true },
    conditionStatus: { type: String, enum: ['Good', 'Maintenance'], default: 'Good' },
    listingStatus: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Approved', // backwards compatible: existing seed/admin-created vehicles are listed
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // fleet/admin who submitted
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // admin approver
    approvedAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Vehicle', vehicleSchema);

