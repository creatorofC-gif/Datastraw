// Handles admin login and issues a 12-hour JWT token.

const jwt = require('jsonwebtoken');

const login = (req, res) => {
    const { userId, password } = req.body;
    const adminPassword = process.env.ADMIN_PASSWORD;
    
    if (!adminPassword) {
        console.error("ADMIN_PASSWORD is not set in environment variables");
        return res.status(500).json({ message: 'Server configuration error' });
    }

    if (userId === 'admin' && password === adminPassword) {
        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET is not set in environment variables");
            return res.status(500).json({ message: 'Server configuration error' });
        }
        // Issue token valid for 12 hours
        const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '12h' });
        return res.status(200).json({ 
            token,
            user: {
                userId: 'admin',
                role: 'Admin',
                name: 'Datastraw Administrator'
            }
        });
    }
    
    return res.status(401).json({ message: 'Authorization Failed' });
};

module.exports = { login };
