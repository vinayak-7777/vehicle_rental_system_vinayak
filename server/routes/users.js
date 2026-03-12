const express = require('express');
const router = express.Router();
const { getAllUsers, updateUserRole, deleteUser } = require('../controllers/userController');
const { auth, authorize } = require('../middleware/auth');

// Get all users - Admin and Auditor (read-only for auditor)
router.get('/', auth, authorize('admin', 'auditor'), getAllUsers);
// Update and delete - Admin only
router.put('/:id/role', auth, authorize('admin'), updateUserRole);
router.delete('/:id', auth, authorize('admin'), deleteUser);

module.exports = router;
