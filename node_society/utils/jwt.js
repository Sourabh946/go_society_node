/* const jwt = require('jsonwebtoken');

const generateToken = payload => {
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

module.exports = { generateToken }; */

const jwt = require('jsonwebtoken');

exports.generateToken = (user) =>
    jwt.sign(
        { id: user.id, role: user.role.name },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );

exports.verifyToken = (token) =>
    jwt.verify(token, process.env.JWT_SECRET);