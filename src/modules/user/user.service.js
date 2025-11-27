const express = require('express');
const prisma = require('../core/db/prisma');

const userService = {

    // Fetch all users
    async getAllUsers(){
        return await prisma.user.findMany();
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

    // Create a new user
    async createUser(data){
        return await prisma.user.create(
            {
                data: {
                    name: data.name,
                    email: data.email
                }
            }
        );
    },

    // Update an existing user
    async updateUser(id, data){
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
    }
};

module.exports = userService;