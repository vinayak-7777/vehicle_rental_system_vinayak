const Vehicle = require('../models/Vehicle');

// @desc    Get all vehicles (with optional filters)
// @route   GET /api/vehicles
// @access  Public
const getVehicles = async (req, res, next) => {
  try {
    const { category, available } = req.query;

    const query = {};

    if (category) {
      query.category = category;
    }

    if (available !== undefined) {
      // available=true or available=false
      query.isAvailable = available === 'true';
    }

    const vehicles = await Vehicle.find(query).sort({ createdAt: -1 });

    res.json({ success: true, data: vehicles });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single vehicle by id
// @route   GET /api/vehicles/:id
// @access  Public
const getVehicleById = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }

    res.json({ success: true, data: vehicle });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new vehicle
// @route   POST /api/vehicles
// @access  Private (Admin)
const createVehicle = async (req, res, next) => {
  try {
    const { vehicleName, category, pricePerDay, imageURL, isAvailable, conditionStatus } = req.body;

    if (!vehicleName || !category || pricePerDay === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide vehicleName, category, and pricePerDay',
      });
    }

    const vehicle = await Vehicle.create({
      vehicleName,
      category,
      pricePerDay,
      imageURL: imageURL || '',
      isAvailable: isAvailable !== undefined ? isAvailable : true,
      conditionStatus: conditionStatus || 'Good',
    });

    res.status(201).json({ success: true, data: vehicle });
  } catch (error) {
    next(error);
  }
};

// @desc    Update vehicle
// @route   PUT /api/vehicles/:id
// @access  Private (Admin, Fleet Manager)
const updateVehicle = async (req, res, next) => {
  try {
    const updates = req.body;

    const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }

    res.json({ success: true, data: vehicle });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete vehicle
// @route   DELETE /api/vehicles/:id
// @access  Private (Admin)
const deleteVehicle = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findByIdAndDelete(req.params.id);

    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }

    res.json({ success: true, message: 'Vehicle deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
};


