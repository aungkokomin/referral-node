const prisma = require('../../core/database/prisma');

const roleService = {
    // Fetch all roles
    async getAllRoles(){
        return await prisma.role.findMany();
    },

    // Fetch role by Name
    async getRoleByName(name){
        return await prisma.role.findUnique({
            where: { name: name }
        });
    },

    // Fetch role by ID
    async getRoleById(id){
        return await prisma.role.findUnique({
            where: { id: parseInt(id) }
        });
    },

    // Create a new role
    async createRole(name){
        return await prisma.role.create({
            data: {
                name
            }
        });
    }
};

module.exports = roleService;