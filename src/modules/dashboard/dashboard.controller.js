const userService = require('../user/user.service');
const commissionService = require('../commission/commission.service');

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
            const commissionCount = await commissionService.countCommissionLogs();
            
            res.status(200).json({
                userCount,
                commissionCount
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = dashboardController;