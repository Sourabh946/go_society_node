const { Member, User, Flat } = require('../models');

exports.assign = async (req, res) => {
    try {
        const { user_id, flat_id, is_owner } = req.body;

        // validate user
        const user = await User.findByPk(user_id);
        if (!user) return res.status(400).json({ message: 'Invalid user' });

        // validate flat
        const flat = await Flat.findByPk(flat_id);
        if (!flat) return res.status(400).json({ message: 'Invalid flat' });

        // prevent duplicate assignment
        const exists = await Member.findOne({
            where: { user_id, flat_id }
        });
        if (exists) {
            return res.status(409).json({ message: 'User already assigned to this flat' });
        }

        const member = await Member.create({
            user_id,
            flat_id,
            is_owner
        });

        res.status(201).json(member);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAll = async (req, res) => {
    try {
        const members = await Member.findAll({
            include: [User, Flat]
        });
        res.json(members);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getByFlat = async (req, res) => {
    try {
        const members = await Member.findAll({
            where: { flat_id: req.params.flat_id },
            include: [User]
        });
        res.json(members);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.remove = async (req, res) => {
    try {
        const member = await Member.findByPk(req.params.id);
        if (!member) return res.status(404).json({ message: 'Not found' });

        await member.destroy(); // soft delete
        res.json({ message: 'Member removed' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
