/**
 * Middleware to check if user has at least ONE of the required roles
 * Usage: router.delete('/users/:id', authMiddleware, requireRole('admin'), userController.delete)
 * 
 * @param {...string} allowedRoles - One or more role names (e.g., 'admin', 'affiliate')
 * @returns {Function} Express middleware function
 */
const requireRole = (...allowedRoles) => {
    return (req, res, next) => {
        // Must run after authMiddleware
        if (!req.user) {
            return res.status(401).json({ 
                message: 'Authentication required. Please login first.' 
            });
        }

        // Get user roles (handle both array and relation structure)
        const userRoles = req.user.roles;

        console.log('👤 User roles:', userRoles);
        console.log('🔐 Required roles:', allowedRoles);

        // Check if user has at least one of the allowed roles
        const hasRole = allowedRoles.some(role => userRoles.includes(role));

        if (!hasRole) {
            return res.status(403).json({ 
                message: 'Access denied. Insufficient permissions.',
                requiredRoles: allowedRoles,
                yourRoles: userRoles
            });
        }

        console.log('✅ Role check passed');
        next();
    };
};

/**
 * Middleware to check if user has ALL of the required roles
 * Usage: router.post('/admin/special', authMiddleware, requireAllRoles('admin', 'superuser'), handler)
 */
const requireAllRoles = (...requiredRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ 
                message: 'Authentication required' 
            });
        }

        const userRoles = req.user.roles?.map(ur => {
            return typeof ur === 'string' ? ur : ur.role?.name;
        }).filter(Boolean) || [];

        const hasAllRoles = requiredRoles.every(role => userRoles.includes(role));

        if (!hasAllRoles) {
            return res.status(403).json({ 
                message: 'Access denied. All required roles needed.',
                requiredRoles: requiredRoles,
                yourRoles: userRoles
            });
        }

        next();
    };
};

module.exports = { requireRole, requireAllRoles };