require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const mysql = require('mysql2/promise');
const env = require('../config/env');

// Create a pool once (sync)
const pool = mysql.createPool(env.databaseUrl);

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: env.databaseUrl,
        },
    },
});

module.exports = prisma;