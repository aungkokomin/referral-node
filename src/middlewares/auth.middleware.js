const jwtUtil = require('../utils/jwt.util');
const { findPersonalAccessToken } = require('../modules/user/user.service');

/**
 * Middleware to authenticate requests using JWT tokens
 * Usage: Add this middleware to any route that requires authentication
 * Example: router.get('/protected', authMiddleware, (req, res) => {...})
 */
const authMiddleware = async (req, res, next) => {
    try {
        // Get token from Authorization header
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'No token provided' });
        }

        // Extract token
        const token = authHeader.substring(7); // Remove 'Bearer ' prefix
        
        // Verify token is valid JWT
        const decoded = jwtUtil.verifyToken(token);
        
        if (!decoded) {
            return res.status(401).json({ message: 'Invalid or expired token' });
        }

        // Check if token exists in database (not revoked)
        const tokenRecord = await findPersonalAccessToken(token);
        
        if (!tokenRecord) {
            return res.status(401).json({ message: 'Token has been revoked' });
        }

        // Attach user to request object
        req.user = tokenRecord.user;
        req.token = token; // Store token for logout
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(401).json({ message: 'Authentication failed' });
    }
};

module.exports = authMiddleware;
