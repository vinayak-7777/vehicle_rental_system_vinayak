const Vehicle = require('../models/Vehicle');

const isAdminLike = (role) => role === 'admin' || role === 'auditor';

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

    // Listing visibility rules:
    // - Public/user: only approved (or missing listingStatus for backward compatibility)
    // - Fleet manager: approved + their own pending/rejected submissions
    // - Admin/Auditor: all vehicles
    const role = req.user?.role;
    if (!role || role === 'user') {
      query.$or = [{ listingStatus: 'Approved' }, { listingStatus: { $exists: false } }];
    } else if (role === 'fleetManager') {
      query.$or = [
        { listingStatus: 'Approved' },
        { listingStatus: { $exists: false } },
        { createdBy: req.user.userId },
      ];
    } else if (isAdminLike(role)) {
      // no extra filter
    } else {
      // other roles default to public visibility
      query.$or = [{ listingStatus: 'Approved' }, { listingStatus: { $exists: false } }];
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

    const role = req.user?.role;
    const listingStatus = vehicle.listingStatus;
    const isApprovedOrLegacy = listingStatus === 'Approved' || listingStatus === undefined;
    const canSeeUnapproved =
      isAdminLike(role) ||
      (role === 'fleetManager' && vehicle.createdBy && String(vehicle.createdBy) === String(req.user?.userId));

    if (!isApprovedOrLegacy && !canSeeUnapproved) {
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

    const role = req.user?.role;
    const isAdmin = role === 'admin';

    const vehicle = await Vehicle.create({
      vehicleName,
      category,
      pricePerDay,
      imageURL: imageURL || '',
      isAvailable: isAvailable !== undefined ? isAvailable : true,
      conditionStatus: conditionStatus || 'Good',
      createdBy: req.user?.userId,
      listingStatus: isAdmin ? 'Approved' : 'Pending',
      approvedBy: isAdmin ? req.user?.userId : undefined,
      approvedAt: isAdmin ? new Date() : undefined,
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
    const updates = { ...req.body };

    // Fleet managers should not self-approve/list by editing fields directly
    if (req.user?.role === 'fleetManager') {
      delete updates.listingStatus;
      delete updates.approvedBy;
      delete updates.approvedAt;
      delete updates.createdBy;
    }

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

// @desc    Admin approves a pending vehicle listing
// @route   PUT /api/vehicles/:id/approve
// @access  Private (Admin)
const approveVehicle = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }

    vehicle.listingStatus = 'Approved';
    vehicle.approvedBy = req.user.userId;
    vehicle.approvedAt = new Date();
    await vehicle.save();

    res.json({ success: true, data: vehicle, message: 'Vehicle approved and listed' });
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
  approveVehicle,
  deleteVehicle,
};


