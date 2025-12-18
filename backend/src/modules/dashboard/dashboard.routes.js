const router = require('express').Router();
const dashboardController = require('./dashboard.controller');

console.log('Setting up dashboard index route...');
router.get('/', dashboardController.index);

module.exports = router;