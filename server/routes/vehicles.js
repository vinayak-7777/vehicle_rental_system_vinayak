const express = require('express');
const router = express.Router();

const {
  getVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
} = require('../controllers/vehicleController');

const { auth, authorize } = require('../middleware/auth');

// Public routes
router.get('/', getVehicles);
router.get('/:id', getVehicleById);

// Protected routes
router.post('/', auth, authorize('admin'), createVehicle);
router.put('/:id', auth, authorize('admin', 'fleetManager'), updateVehicle);
router.delete('/:id', auth, authorize('admin'), deleteVehicle);

module.exports = router;


