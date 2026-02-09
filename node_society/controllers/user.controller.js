const bcrypt = require('bcryptjs');
const { User, Role, Member, Flat } = require('../models');

exports.create = async (req, res) => {
    try {
        const { name, email, password, role_id } = req.body;

        const exists = await User.findOne({ where: { email } });
        if (exists) {
            return res.status(409).json({ message: 'Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role_id
        });

        res.status(201).json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAll = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password'] },
            include: [Role]
        });
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getById = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id, {
            attributes: { exclude: ['password'] },
            include: [
                {
                    model: Role,
                    as: 'role'
                },
                {
                    model: Society,
                    as: 'society'
                }
            ]
        });

        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.update = async (req, res) => {
    try {
        const { name, email } = req.body;

        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        await user.update({ name, email });
        res.json({ message: 'User updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.changeRole = async (req, res) => {
    try {
        const { role_id } = req.body;

        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        await user.update({ role_id });
        res.json({ message: 'Role updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.assignFlat = async (req, res) => {
    try {
        const { flat_id, is_owner } = req.body;
        const user_id = req.params.id;

        const flat = await Flat.findByPk(flat_id);
        if (!flat) return res.status(400).json({ message: 'Invalid flat' });

        let member = await Member.findOne({ where: { user_id } });

        if (member) {
            await member.update({ flat_id, is_owner });
        } else {
            member = await Member.create({ user_id, flat_id, is_owner });
        }

        res.json({ message: 'Flat assignment updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.changePassword = async (req, res) => {
    try {
        const { password } = req.body;

        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const hashed = await bcrypt.hash(password, 10);
        await user.update({ password: hashed });

        res.json({ message: 'Password updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.remove = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        await user.destroy(); // soft delete
        res.json({ message: 'User deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};