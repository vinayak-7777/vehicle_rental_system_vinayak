const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema(
  {
    vehicleName: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    pricePerDay: { type: Number, required: true, min: 0 },
    imageURL: { type: String, default: '' },
    isAvailable: { type: Boolean, default: true },
    conditionStatus: { type: String, enum: ['Good', 'Maintenance'], default: 'Good' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Vehicle', vehicleSchema);

