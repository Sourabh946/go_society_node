/* const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: 'Token missing' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // { id, role }
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid token' });
    }
}; */

const jwt = require('jsonwebtoken');
const { User, Role } = require('../models');

module.exports = async (req, res, next) => {
    try {
        const header = req.headers.authorization;
        if (!header) throw new Error('Token missing');

        const token = header.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findByPk(decoded.id, {
            include: Role,
            attributes: { exclude: ['password'] }
        });

        if (!user) throw new Error('Invalid token');

        req.user = user;
        next();
    } catch (e) {
        res.status(401).json({ message: e.message });
    }
};

