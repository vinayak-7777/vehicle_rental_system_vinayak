const express = require('express');
const router = express.Router();

const {
  getVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  approveVehicle,
  deleteVehicle,
} = require('../controllers/vehicleController');

const { auth, optionalAuth, authorize } = require('../middleware/auth');

// Public routes
router.get('/', optionalAuth, getVehicles);
router.get('/:id', optionalAuth, getVehicleById);

// Protected routes
router.post('/', auth, authorize('admin', 'fleetManager'), createVehicle);
router.put('/:id', auth, authorize('admin', 'fleetManager'), updateVehicle);
router.put('/:id/approve', auth, authorize('admin'), approveVehicle);
router.delete('/:id', auth, authorize('admin'), deleteVehicle);

module.exports = router;


