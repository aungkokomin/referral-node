const userService = require('../user/user.service');
const commissionService = require('../commission/commission.service');

const dashboardController = {
    async index(req, res, next){
        try {
            console.log('Fetching dashboard data');
            
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