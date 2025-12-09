const express = require('express');
const prisma = require('../../core/database/prisma');

const commissionService = {
    // Fetch all commissions logs
    async getAllCommissions(){
        return await prisma.commissionLog.findMany();
    },

    // Fetch commissions by user ID
    async getCommissionsByUserId(userId){
        return await prisma.commissionLog.findMany({
            where: { user_id: parseInt(userId) }
        });
    },

    // Create a new commission record
    async createCommission(data){
        return await prisma.commissionLog.create(
            {
                data: {
                    // userId: data.userId,
                    amount: data.amount,
                    description: data.description,
                    user: {
                        connect: { id: data.userId }
                    }
                }
            }
        );
    },

    // Process commission fee for a user
    async processCommissionFee(userId, paidAmount = 100){
        // Example logic: Deduct a fixed percentage as commission fee
        const commissionRate = 0.10;
        const commissionFee = paidAmount * commissionRate;
        
        return await commissionService.createCommission({
            userId: userId,
            amount: commissionFee,
            description: `Commission fee for payment of ${paidAmount}`
        });
    },

    // Count all commissions
    async countCommissionLogs(){
        return await prisma.commissionLog.count();
    }
}

module.exports = commissionService;