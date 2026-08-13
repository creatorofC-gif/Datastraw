/**
 * This is the middleware of the authentication
 * After the controller the power is shifted here
 * The bearer token is generated which is the unique ID of the person which is logged in
 * Using that bearer token, the said developer can also access the data using softwares like Postman or ThunderClient
 * On entering the wrong bearer token, appropriate message is shown
 */


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
