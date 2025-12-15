const router = require("express").Router();
const authService = require('./auth.login');
const registerService = require('./auth.register');
const userService = require('../user/user.service')
const authMiddleware = require('../../middlewares/auth.middleware');

// Login route
router.post('/login', async (req, res) => {
    try {
        console.log('=== LOGIN REQUEST START ===');
        console.log('Request body:', req.body);

        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ 
                message: 'Email and password are required' 
            });
        }

        // Attempt login
        const result = await authService.login(email, password);

        if (!result.success) {
            return res.status(401).json({ 
                message: result.message 
            });
        }

        // Return success with token
        return res.status(200).json({
            message: 'Login successful',
            token: result.token,
            user: result.user
        });

    } catch (error) {
        console.error('Authentication error:', error);
        return res.status(500).json({ 
            message: 'Internal Server Error',
            error: error.message
        });
    }
});

router.post('/register', async (req, res) => {
    try {
        const { email, password, name, referralId } = req.body;
        console.log('Registration request for email:', email);
        // Validate input
        if (!email || !password || !name) {
            return res.status(400).json({ 
                message: 'Name, email and password are required' 
            });
        }

        // Attempt registration
        console.log('Attempting to register user:', email);
        const result = await registerService.register(email, password, name, referralId);
        
        if (!result.success) {
            return res.status(400).json({
                message: result.message
            });
        }
        
        // Return success with user info
        return res.status(201).json({
            message: 'Registration successful',
            user: result.user
        });
    } catch (error) {
        console.error('Registration error:', error);
        return res.status(500).json({
            message: 'Internal Server Error',
            error: error.message
        });
    }
});

// Get current user (protected route)
router.get('/me', authMiddleware, (req, res) => {
    res.status(200).json({
        user: {
            id: req.user.id,
            email: req.user.email,
            name: req.user.name,
            roleId: req.user.roleId,
            referral_uuid: req.user.referral_uuid
        }
    });
});

// Logout route - Revoke current token
router.post('/logout', authMiddleware, async (req, res) => {
    try {
        await authService.logout(req.token);
        res.status(200).json({ 
            message: 'Logout successful. Token has been revoked.' 
        });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ message: 'Logout failed' });
    }
});

// Logout from all devices - Revoke all user tokens
router.post('/logout-all', authMiddleware, async (req, res) => {
    try {
        await authService.logoutAll(req.user.id);
        res.status(200).json({ 
            message: 'Logged out from all devices. All tokens have been revoked.' 
        });
    } catch (error) {
        console.error('Logout all error:', error);
        res.status(500).json({ message: 'Logout failed' });
    }
});

router.get('/check-referral-valid', async (req, res) => {
    try {
        const referralId = req.query.ref;

        if (!referralId) {
            return res.status(400).json({ 
                message: 'Referral ID is required' 
            });
        }
        
        const user = await userService.findUserByReferId(referralId);

        let isValid = true;
        if(!user){
            isValid = false;
        }
        return res.status(200).json({
            referralId,
            userName: user?.name ?? null,
            isValid
        });
    } catch (error) {
        console.error('Referral validation error:', error);
        return res.status(500).json({ 
            message: 'Internal Server Error',
            error: error.message
        });
    }
});
module.exports = router;


