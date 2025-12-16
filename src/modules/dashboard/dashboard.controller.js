const userService = require('../user/user.service');
const commissionService = require('../commission/commission.service');
const referralService = require('../referral/referral.service');

const dashboardController = {
    async index(req, res, next){
        try {
            console.log('Fetching dashboard data');

            const loggedInUser = req.user;
            // console.log('Logged in user:', loggedInUser);
            if (!loggedInUser) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            
            const userCount = await userService.countUsers();
            const refereeCount = await referralService.countReferees(loggedInUser.id);
            const totalCommissions = await commissionService.calculateTotalCommissions(loggedInUser.id);
            
            res.status(200).json({
                userCount,
                refereeCount,
                totalCommissions: totalCommissions
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = dashboardController;