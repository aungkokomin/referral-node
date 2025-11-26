const express = require("express");
const req = require("express/lib/request");
const app = express;

app.use('/users', require('../../modules/user/user.routes'));
app.use('/referrals', require('../../modules/referral/referral.routes'));
app.use('/commissions', require('../../modules/commission/commission.routes'));

module.exports = app;