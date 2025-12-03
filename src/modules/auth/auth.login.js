const { 
    findUserByEmail, 
    validatePassword, 
    createPersonalAccessToken,
    deletePersonalAccessToken,
    deleteAllUserTokens
} = require('../user/user.service');
const jwtUtil = require('../../utils/jwt.util');

/**
 * Authentication service for JWT-based login
 */
const authService = {
    /**
     * Login user with email and password
     * @param {string} email - User email
     * @param {string} password - User password
     * @returns {Object} - Success status, token, and user data
     */
    async login(email, password) {
        try {
            console.log('🔍 Attempting to find user by email:', email);

            const user = await findUserByEmail(email);
            console.log('👤 User found:', user ? 'Yes' : 'No');

            if (!user) {
                console.log('❌ User not found');
                return {
                    success: false,
                    message: 'Invalid credentials'
                };
            }

            console.log('🔑 Validating password...');
            const isValid = await validatePassword(password, user.password);
            console.log('🔑 Password valid:', isValid);

            if (!isValid) {
                console.log('❌ Invalid password');
                return {
                    success: false,
                    message: 'Invalid credentials'
                };
            }

            // Generate JWT token
            console.log('🎫 Generating JWT token...');
            const token = jwtUtil.generateToken({
                userId: user.id,
                email: user.email,
                roleId: user.roleId
            });

            // Save token to database
            console.log('💾 Saving token to database...');
            await createPersonalAccessToken(user.id, token);

            console.log('✅ Login successful for:', user.email);

            return {
                success: true,
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    roleId: user.roleId,
                    referral_uuid: user.referral_uuid
                }
            };
        } catch (error) {
            console.error('💥 Error in login:', error);
            throw error;
        }
    },

    /**
     * Logout - Revoke a specific token
     * @param {string} token - JWT token to revoke
     */
    async logout(token) {
        try {
            await deletePersonalAccessToken(token);
            return { success: true, message: 'Token revoked successfully' };
        } catch (error) {
            console.error('💥 Error in logout:', error);
            throw error;
        }
    },

    /**
     * Logout from all devices - Revoke all user tokens
     * @param {number} userId - User ID
     */
    async logoutAll(userId) {
        try {
            await deleteAllUserTokens(userId);
            return { success: true, message: 'All tokens revoked successfully' };
        } catch (error) {
            console.error('💥 Error in logout all:', error);
            throw error;
        }
    }
};

module.exports = authService;