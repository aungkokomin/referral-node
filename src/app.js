require('dotenv').config(); // Load environment variables from .env file

const express = require('express');
const session = require('express-session');
const passport = require('passport');
const router = require('./core/http/router');
const req = require('express/lib/request');

const app = express();

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({extended: true})); // Parse URL-encoded bodies

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key', // Use a strong secret in production
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false,
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
    }
}));
