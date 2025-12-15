const express = require('express');
const prisma = require('../../core/database/prisma');

const commissionService = {
    // Fetch all commissions logs
    async getAllCommissions(){
        return await prisma.commissionLog.findMany({
            include: {
                referrer: {  // ✅ Person who earned commission
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        referral_uuid: true
                    }
                },
                referee: {   // ✅ Person who generated commission
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });
    },

    // Fetch commissions by user ID
    async getCommissionsByUserId(userId){
        return await prisma.commissionLog.findMany({
            where: { 
                referrerId: parseInt(userId)  // ✅ Get commissions earned by this user
            },
            include: {
                referee: true  // Include who generated the commission
            }
        });
    },

    // Create a new commission record
    async createCommission(data){
        return await prisma.commissionLog.create({
            data: {
                referrerId: data.referrerId,      // ✅ Who earns
                refereeId: data.refereeId,        // ✅ Who triggered
                amount: data.amount,
                description: data.description
            }
        });
    },

    // Process commission fee for a user
    async processCommissionFee(referrerId, refereeId, paidAmount = 100){
        const commissionRate = 0.10;
        const commissionFee = paidAmount * commissionRate;
        
        return await commissionService.createCommission({
            referrerId: referrerId,       // Person earning commission
            refereeId: refereeId,         // Person who signed up
            amount: commissionFee,
            description: `Commission for referring user ${refereeId}`
        });
    }
};

module.exports = commissionService;