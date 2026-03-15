/**
 * User routes
 * Maps HTTP routes to controller functions
 */
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/authMiddleware');

// Create a new user
router.post('/create', userController.createUser);

// Fetch all users
router.get('/', userController.getUsers);

// Protected profile routes
router.get('/profile', auth, userController.getProfile);
router.put('/profile', auth, userController.updateProfile);

// Fetch user by id
router.get('/:id', userController.getUserById);

// Delete user by id
router.delete('/:id', userController.deleteUser);

module.exports = router;
