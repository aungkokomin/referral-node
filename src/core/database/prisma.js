require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const mysql = require('mysql2/promise');

// Create a pool once (sync)
const pool = mysql.createPool(process.env.DATABASE_URL);

const prisma = new PrismaClient({
  adapter: { type: 'mysql2', pool }, // <-- correct adapter object for Prisma v7
});

module.exports = prisma;