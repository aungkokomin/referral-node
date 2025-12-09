const express = require('express');
const prisma = require('../../core/database/prisma');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

const userService = {
    // Fetch all users
    async getAllUsers(){
        return await prisma.user.findMany({
            include: {
                roles: {
                    include: {
                        role: true
                    }
                }
            }
        });
    },

    // Count all users
    async countUsers(){
        return await prisma.user.count();
    },
    
    // Fetch user by ID
    async getUserById(id){
        return await prisma.user.findUnique({
            where: { id: parseInt(id) }
        });
    },

    // Fetch user by email
    async findUserByEmail(email){
        return await prisma.user.findUnique({
            where: {email: email}
        });
    },

    async findUserByReferId(refer_id){
        return await prisma.user.findUnique({
            where: { referral_uuid: refer_id }
        });
    },
    
    // Validate user data
    async validateUserData(data, isUpdate = false){
        const { name, email, role,  } = data;
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

    // Validate user password
    async validatePassword(password, hashedPassword){
        return await bcrypt.compare(password, hashedPassword);
    },

    // Create a new user
    async createUser(data){
        const hashedPassword = await bcrypt.hash(data.password, 10);
        return await prisma.user.create(
            {
                data: {
                    name: data.name,
                    email: data.email,
                    password: hashedPassword, // Hash password before saving
                    referral_uuid: uuidv4(),
                    referrer_uuid: data.referrer_uuid,
                }
            }
        );
    },

    // Update an existing user
    async updateUser(id, data){
        this.validateUserData(data, true);
        return await prisma.user.update({
            where: { id: parseInt(id) },
            data: {
                name: data.name,
                email: data.email
            }
        });
    },

    // Delete a user
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

    // Create personal access token
    async createPersonalAccessToken(userId, token) {
        return await prisma.personalAccessToken.create({
            data: {
                userId: userId,
                token: token,
                expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days expiry
            }
        });
    },

    // Find token
    async findPersonalAccessToken(token) {
        return await prisma.personalAccessToken.findUnique({
            where: { token: token },
            include: { user: true }
        });
    },

    // Delete token (for logout)
    async deletePersonalAccessToken(token) {
        return await prisma.personalAccessToken.delete({
            where: { token: token }
        });
    },

    // Delete all user tokens (logout from all devices)
    async deleteAllUserTokens(userId) {
        return await prisma.personalAccessToken.deleteMany({
            where: { userId: userId }
        });
    },

    // Get all user tokens
    async getUserTokens(userId) {
        return await prisma.personalAccessToken.findMany({
            where: { userId: userId },
            orderBy: { createdAt: 'desc' }
        });
    },

    /**
     * Generate UUID referral code
     * 
     */
    async generateReferralUUID() {
        return uuidv4();
    }
};

module.exports = userService;