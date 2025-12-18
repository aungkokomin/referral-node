const prisma = require("../../database/prisma");

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
    },

    // Count referees for a given user
    async countReferees(userId){
        user = await prisma.user.findUnique({
            where: {
                id: parseInt(userId)
            }
        });
        if(!user){
            return 0;
        }
        return await prisma.referralLog.count({
            where: {
                referrerId: user.referral_uuid
            }
        });
    },
}

module.exports = referralService;