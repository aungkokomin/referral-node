const express = require('express');
const router = express.Router();
const UserController = require('./user.controller');
const authMiddleware = require('../../core/http/middleware/authMiddleware');

// Define user-related routes
router.get('/', authMiddleware, UserController.getAllUsers);
router.get('/:id', authMiddleware, UserController.getUserById);
router.post('/', authMiddleware, UserController.createUser);
router.put('/:id', authMiddleware, UserController.updateUser);
router.delete('/:id', authMiddleware, UserController.deleteUser);

module.exports = router;