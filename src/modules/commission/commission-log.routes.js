const router = require('express').Router();
const authMiddleware = require('../../middlewares/auth.middleware');
const commissionController = require('./commission.controller');

// Define commission-related routes
router.get('/', authMiddleware, commissionController.commissionLogList);
router.get('/:id', authMiddleware, commissionController.show);
router.post('/process-commission/:userId', commissionController.create);

module.exports = router;