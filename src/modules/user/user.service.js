const express = require('express');
const prisma = require('../../core/database/prisma');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

const userService = {
    // Fetch all users
    async getAllUsers(){
        return await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                roleId: true,
                referral_uuid: true,
                referrer_uuid: true,
                createdAt: true,
                updatedAt: true,
                // ✅ Exclude password by not selecting it
                roles: {
                    select: {
                        role: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    }
                }
            }
        });
    },

    async countUsers(){
        return await prisma.user.count();
    },
    
    async getUserById(id){
        return await prisma.user.findUnique({
            where: { id: parseInt(id) },
            select: {
                id: true,
                email: true,
                name: true,
                roleId: true,
                referral_uuid: true,
                referrer_uuid: true,
                createdAt: true,
                updatedAt: true,
                roles: {
                    select: {
                        role: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    }
                }
            }
        });
    },

    async findUserByEmail(email){
        return await prisma.user.findUnique({
            where: { email: email }
            // ✅ Keep password here - needed for login validation
        });
    },

    async getUserDetailsById(id){
        return await prisma.user.findUnique({
            where: { id: parseInt(id) },
            include: {
                roles: {
                    include: {
                        role: true
                    }
                }
            }
            // ✅ Include password here - needed for validation in auth
        });
    },

    async findUserByReferId(refer_id){
        return await prisma.user.findUnique({
            where: { referral_uuid: refer_id },
            select: {
                id: true,
                email: true,
                name: true,
                roleId: true,
                referral_uuid: true,
                referrer_uuid: true,
                createdAt: true,
                updatedAt: true
                // ✅ Password excluded
            }
        });
    },
    
    // Validate user data
    async validateUserData(data, isUpdate = false){
        const { name, email, role } = data;
        if(!isUpdate){
            if(!name || !email){
                throw new Error('Name and Email are required');
            }
        }
        if(email && !/\S+@\S+\.\S+/.test(email)){
            throw new Error('Invalid email format');
        }
        return { name, email };
    },

    async validatePassword(password, hashedPassword){
        return await bcrypt.compare(password, hashedPassword);
    },

    async createUser(data){
        const hashedPassword = await bcrypt.hash(data.password, 10);
        return await prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                password: hashedPassword,
                referral_uuid: uuidv4(),
                referrer_uuid: data.referrer_uuid,
            }
        });
    },

    async updateUser(id, data){
        await this.validateUserData(data, true);
        return await prisma.user.update({
            where: { id: parseInt(id) },
            data: {
                name: data.name,
                email: data.email
            }
        });
    },

    async updatePassword(id, newPassword){
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        return await prisma.user.update({
            where: { id: parseInt(id) },
            data: {
                password: hashedPassword
            }
        });
    },

    async deleteUser(id){
        const user = await prisma.user.findUnique({
            where: { id: parseInt(id) }
        });
        if(!user){
            return null;
        }
        await prisma.user.delete({
            where: { id: parseInt(id) }
        });
        return true;
    },

    async createPersonalAccessToken(userId, token) {
        return await prisma.personalAccessToken.create({
            data: {
                userId: userId,
                token: token,
                expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            }
        });
    },

    async findPersonalAccessToken(token) {
        return await prisma.personalAccessToken.findUnique({
            where: { token: token },
            include: { 
                user: {
                    include: {
                        roles: {
                            include: {
                                role: true
                            }
                        }
                    }
                }
            }
        });
    },

    async deletePersonalAccessToken(token) {
        return await prisma.personalAccessToken.delete({
            where: { token: token }
        });
    },

    async deleteAllUserTokens(userId) {
        return await prisma.personalAccessToken.deleteMany({
            where: { userId: userId }
        });
    },

    async getUserTokens(userId) {
        return await prisma.personalAccessToken.findMany({
            where: { userId: userId },
            orderBy: { createdAt: 'desc' }
        });
    },

    async generateReferralUUID() {
        return uuidv4();
    }
};

module.exports = userService;