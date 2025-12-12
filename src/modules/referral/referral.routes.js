const express = require('express');
const router = express.Router();
const referralController = require('./referral.controller');

// Route to get all referral logs
router.get('/logs', referralController.getAllReferrals);

// Route to get referrals by user ID
router.get('/logs/:userId', referralController.getReferralsByUserId);

// Route to process a referral fee for a user
router.post('/process-fee/:userId', referralController.processReferralFee);

module.exports = router;