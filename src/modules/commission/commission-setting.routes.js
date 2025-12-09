const router = require('express').Router();
const authMiddleware = require('../../middlewares/auth.middleware');
const commissionController = require('./commission.controller');

// router.get('/', authMiddleware, commissionController.getAllCommissionSettings);
// router.get('/:id', authMiddleware, commissionController.getCommissionSettingById);
// router.post('/', authMiddleware, commissionController.createCommissionSetting);
// router.put('/:id', authMiddleware, commissionController.updateCommissionSetting);
// router.delete('/:id', authMiddleware, commissionController.deleteCommissionSetting);

module.exports = router;