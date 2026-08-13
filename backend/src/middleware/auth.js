// Middleware to verify JWT Bearer token and protect routes.


const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer')) {
        const token = authHeader.split(' ')[1];
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            return next();
        } catch (error) {
            return res.status(401).json({ message: 'Authorization Failed' });
        }
    }
    return res.status(401).json({ message: 'Authorization Failed' });
};

module.exports = { protect };
