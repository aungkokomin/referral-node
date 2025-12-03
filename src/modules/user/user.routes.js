const express = require('express');
const router = express.Router();
const UserController = require('./user.controller');


// Define user-related routes
router.get('/', UserController.index);
router.get('/:id', UserController.show);
router.post('/', UserController.create);
router.put('/:id', UserController.update);
router.delete('/:id', UserController.delete);

module.exports = router;