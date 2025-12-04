const router = require('express').Router();
const authMiddleware = require('../../middlewares/auth.middleware');
const commissionController = require('./commission.controller');

// Define commission-related routes
router.get('/', authMiddleware, commissionController.index);
router.get('/:id', authMiddleware, commissionController.show);
router.post('/process-commission/:userId', commissionController.create);
router.post('/create/com-setting', authMiddleware, commissionController.createCommissionSetting);
router.put('/update/com-setting/:id', authMiddleware, commissionController.updateCommissionSetting);
router.get('/com-settings', authMiddleware, commissionController.getAllCommissionSettings);

module.exports = router;