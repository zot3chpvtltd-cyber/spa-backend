const roleMiddleware = (roles) => {
    return (req, res, next) => {
        // Normalize roles to lowercase for comparison
        const allowedRoles = roles.map(role => role.toLowerCase());
        const userRole = req.user && req.user.role ? req.user.role.toLowerCase() : null;

        if (!userRole || !allowedRoles.includes(userRole)) {
            console.log(`[Auth] Access denied. User role: '${req.user?.role}', Allowed roles: [${roles.join(', ')}]`);
            return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
        }
        next();
    };
};

module.exports = roleMiddleware;
