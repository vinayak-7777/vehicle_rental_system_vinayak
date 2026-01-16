const express = require('express');
const router = express.Router();
const { getAllUsers, updateUserRole, deleteUser } = require('../controllers/userController');
const { auth, authorize } = require('../middleware/auth');

// All routes require Admin role
router.get('/', auth, authorize('admin'), getAllUsers);
router.put('/:id/role', auth, authorize('admin'), updateUserRole);
router.delete('/:id', auth, authorize('admin'), deleteUser);

module.exports = router;
