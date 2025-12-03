require('dotenv').config(); // Load environment variables from .env file

const express = require('express');
const router = require('./core/http/router');

const app = express();

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Your routes
const authRoutes = require('./modules/auth/auth.routes');
app.use('/auth', authRoutes);

// Global error handler (must be last)
app.use((err, req, res, next) => {
    console.error('=== GLOBAL ERROR HANDLER ===');
    console.error('Error:', err);
    console.error('Stack:', err.stack);
    
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

module.exports = app;
