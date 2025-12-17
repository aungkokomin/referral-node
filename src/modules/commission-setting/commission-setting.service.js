const prisma = require('../../core/database/prisma');
const { createCommission } = require('../commission/commission.service');

const commissionSettingService = {
    // Fetch all commission settings
    async getAllCommissionSettings(){
        return await prisma.commissionSetting.findMany();
    },

    async createCommissionSetting(data){
        return await prisma.commissionSetting.create({
            data: {
                title: data.title,
                commissionRate: data.commissionRate,
                description: data.description,
                slug: data.slug
            }
        });
    },

    async getCommissionSettingById(id){
        return await prisma.commissionSetting.findUnique({
            where: { id: parseInt(id) }
        });
    },

    async updateCommissionSetting(id, data){
        return await prisma.commissionSetting.update({
            where: { id: parseInt(id) },
            data: {
                title: data.title,
                commissionRate: data.commissionRate,
                description: data.description,
                slug: data.slug
            }
        });
    },

    async deleteCommissionSetting(id){
        return await prisma.commissionSetting.delete({
            where: { id: parseInt(id) }
        });
    }
}

module.exports = commissionSettingService;