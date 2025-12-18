const jwt = require('jsonwebtoken');

const jwtUtil = {
    // Generate JWT token
    generateToken(payload) {
        return jwt.sign(
            payload,
            process.env.JWT_SECRET || 'fallback-secret-change-this',
            { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
        );
    },

    // Verify JWT token
    verifyToken(token) {
        try {
            return jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-change-this');
        } catch (error) {
            console.error('JWT verification error:', error.message);
            return null;
        }
    },

    // Decode JWT token without verification (useful for debugging)
    decodeToken(token) {
        return jwt.decode(token);
    }
};

module.exports = jwtUtil;
