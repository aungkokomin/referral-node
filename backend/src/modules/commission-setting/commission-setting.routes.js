const router = require('express').Router();
const authMiddleware = require('../../middlewares/auth.middleware');
const commissionSettingController = require('./commission-setting.controller');

router.get('/', authMiddleware, commissionSettingController.getAllCommissionSettings);
router.get('/:id', authMiddleware, commissionSettingController.getCommissionSettingById);
router.post('/create', authMiddleware, commissionSettingController.createCommissionSetting);
router.put('/update/:id', authMiddleware, commissionSettingController.updateCommissionSetting);
router.delete('/delete/:id', authMiddleware, commissionSettingController.deleteCommissionSetting);

module.exports = router;