const authMiddleware = (req, res, next) => {
    // Authentication logic here
    if(!req.user) {
        return res.status(401).json({
            message : 'Unauthorized'
        })
    }
    next();
};