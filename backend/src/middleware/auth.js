const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer')) {
        const token = authHeader.split(' ')[1];
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_jwt_key_datastraw_2026_prod');
            req.user = decoded;
            return next();
        } catch (error) {
            return res.status(401).json({ message: 'Authorization Failed' });
        }
    }
    return res.status(401).json({ message: 'Authorization Failed' });
};

module.exports = { protect };
