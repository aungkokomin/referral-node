const express = require("express");
const req = require("express/lib/request");
const router = express.Router();
const authMiddleware = require('../../middlewares/auth.middleware');

router.get('/', (req, res) => {
    res.json({ message: 'Welcome to the API' });
});
router.use('/auth', require('../../modules/auth/auth.routes'));
router.use('/users', authMiddleware, require('../../modules/user/user.routes'));
// router.use('/commissions', require('../../modules/commission/commission.routes'));
// app.use('/referrals', require('../../modules/referral/referral.routes'));

module.exports = router;