require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const mysql = require('mysql2/promise');

// Create a pool once (sync)
const pool = mysql.createPool(process.env.DATABASE_URL);

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL,
        },
    },
});

module.exports = prisma;