/**
 * User routes
 * Maps HTTP routes to controller functions
 */
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/authMiddleware');

// Create a new user
// Create a new user (Disabled - use /api/auth/register-initiate)
// router.post('/create', userController.createUser);

// Fetch all users
router.get('/', userController.getUsers);

// Protected profile routes
router.get('/profile', auth, userController.getProfile);
router.put('/profile', auth, userController.updateProfile);
router.post('/upgrade-vendor', auth, userController.upgradeToVendor);
router.post('/buy-plan', auth, userController.buyPlan);
router.post('/poll', auth, userController.submitPoll);

// Fetch user by id
router.get('/:id', userController.getUserById);

// Delete user by id
router.delete('/:id', userController.deleteUser);

// Verification
router.put('/request-verification', auth, userController.requestVerification);
router.post('/reports', auth, require('../controllers/reportController').submitReport);

module.exports = router;
