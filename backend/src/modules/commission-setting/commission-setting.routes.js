const router = require('express').Router();
const authMiddleware = require('../../middlewares/auth.middleware');
const commissionSettingController = require('./commission-setting.controller');

router.get('/', authMiddleware, commissionSettingController.getAllCommissionSettings);
router.get('/:id', authMiddleware, commissionSettingController.getCommissionSettingById);
router.post('/', authMiddleware, commissionSettingController.createCommissionSetting);
router.put('/:id', authMiddleware, commissionSettingController.updateCommissionSetting);
router.delete('/:id', authMiddleware, commissionSettingController.deleteCommissionSetting);

module.exports = router;