const prisma = require("../../core/database/prisma");

const referralService = {
    // Fetch all referral logs
    async getAllReferrals(){
        return await prisma.referralLog.findMany();
    },

    // create a new referral log
    async createReferralLog(referrerId, refereeId){
        return await prisma.referralLog.create({
            data: {
                referrerId,
                refereeId
            }
        });
    }
}

module.exports = referralService;