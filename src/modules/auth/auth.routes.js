const router = require("express").Router();
const passport = require("passport");
const { role } = require("../../core/database/prisma");
require('./auth.login');
// Define authentication-related routes here

router.post ('/login',(req, res, next) => {
    passport.authenticate('local-login', (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).json({ message: info.message });
        }
        req.logIn(user, (err) => {
            if (err) {
                return res.status(500).json({ message: 'Login failed' });
            }
            return res.status(200).json({
                message: 'Login successful',
                user:{
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role
                }
            });
        });
    }) (req, res, next);
});

// Auth0 authentication route
router.get('/auth0', passport.authenticate('auth0', {
    scope: 'openid email profile'
}));

// Auth0 callback route
router.get('/auth0/callback', passport.authenticate('auth0', {
    failureRedirect: '/login'
}), (req, res) => {
    // Successful authentication
    res.status(200).json({
        message: 'Login successful',
        user: {
            id: req.user.id,
            email: req.user.email,
            name: req.user.name,
            role: req.user.role
        }
    });
});

// Logout route

router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ message: 'Logout failed' });
        }
        res.status(200).json({ message: 'Logout successful' });
    });
})

module.exports = router;


