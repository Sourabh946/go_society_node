const bcrypt = require('bcryptjs');
const { User, Role } = require('../models');
const { generateToken } = require('../utils/jwt');

exports.register = async (req, res) => {
    try {
        const { name, email, password, role_id } = req.body;

        const exists = await User.findOne({ where: { email } });
        if (exists) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            // password: hashedPassword,
            password: password,
            role_id
        });

        return res.status(201).json({
            message: 'User registered successfully',
            user
        });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({
            where: { email },
            attributes: ['id', 'name', 'email', 'password'],
            include: [
                {
                    model: Role,
                    as: 'role'
                }
            ]
        });

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials..' });
        }

        const token = generateToken({
            id: user.id,
            role: user.role.name
        });

        return res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role.name
            }
        });

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

