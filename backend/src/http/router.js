const express = require("express");
const router = express.Router();

console.log('Loading auth.middleware...');
const authMiddleware = require('../middlewares/auth.middleware');
const { requireRole } = require('../middlewares/role.middleware');

router.get('/', (req, res) => {
    res.json({ message: 'Welcome to the API' });
});

console.log('Loading dashboard routes with auth middleware...');
router.use('/dashboard', authMiddleware, require('../modules/dashboard/dashboard.routes'));

console.log('Loading auth routes...');
router.use('/auth', require('../modules/auth/auth.routes'));

console.log('Loading user routes with auth middleware...');
router.use('/users', authMiddleware, requireRole('admin'), require('../modules/user/user.routes'));

console.log('Loading commission routes with auth middleware...');
router.use('/commission-logs', authMiddleware, require('../modules/commission/commission-log.routes'));

console.log('Loading commission setting routes with auth middleware...');
router.use('/commission-settings', authMiddleware, require('../modules/commission-setting/commission-setting.routes'));
// app.use('/referrals', require('../../modules/referral/referral.routes'));

module.exports = router;