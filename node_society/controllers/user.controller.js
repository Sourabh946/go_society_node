const bcrypt = require('bcryptjs');
const { User, Role, Member, Flat, Building, Society } = require('../models');
const { sendMail } = require('../utils/mailer');
const { userCreatedTemplate } = require('../utils/mailTemplates/userCreated');

/* CREATE USER */
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

        // 🔔 SEND EMAIL (non-blocking)
        sendMail({
            to: email,
            subject: 'Your Society Account Created',
            html: userCreatedTemplate({ name, email })
        }).catch(err => {
            console.error('Mail error:', err.message);
        });

        return res.status(201).json({
            message: 'User created successfully',
            user
        });

        res.status(201).json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/* LIST USERS */
exports.getAll = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password'] },
            include: [
                {
                    model: Role,
                    as: 'role',
                    attributes: ['name']
                },
                {
                    model: Member,
                    as: 'member',
                    include: [
                        {
                            model: Flat,
                            as: 'flat',
                            attributes: ['flat_number'],
                            include: [
                                {
                                    model: Building,
                                    as: 'building',
                                    attributes: ['name'],
                                    include: [
                                        {
                                            model: Society,
                                            as: 'society',
                                            attributes: ['name']
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        });

        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/* GET USER */
exports.getById = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id, {
            attributes: { exclude: ['password'] },
            include: [
                { model: Role, as: 'role' },
                {
                    model: Member,
                    as: 'member',
                    include: [{ model: Flat, as: 'flat' }]
                }
            ]
        });

        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/* UPDATE USER */
exports.update = async (req, res) => {
    try {
        console.log(req.body);
        const { name, email, role_id, password } = req.body;
        const user = await User.findByPk(req.params.id);

        if (!user) return res.status(404).json({ message: 'User not found' });

        const updateData = {};

        // Only add fields if they exist in request
        if (name !== undefined) {
            updateData.name = name;
        }

        if (email !== undefined) {
            updateData.email = email;
        }

        if (role_id !== undefined) {
            updateData.role_id = role_id;
        }

        if (typeof password === 'string' && password.trim().length > 0) {
            updateData.password = password;
        }

        // ❗ Nothing to update
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No valid fields provided for update'
            })
        }

        // 🚀 Update (hooks will run automatically)
        await user.update(updateData, {
            individualHooks: true
        })

        return res.json({
            message: 'User updated successfully'
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/* ASSIGN FLAT (MEMBER LOGIC) */
exports.assignFlat = async (req, res) => {
    try {
        const { flat_id, is_owner, is_active, from_date, to_date } = req.body;
        const user_id = req.params.id;

        const flat = await Flat.findByPk(flat_id);
        if (!flat) return res.status(400).json({ message: 'Invalid flat' });

        let member = await Member.findOne({ where: { user_id } });

        if (member) {
            await member.update({
                flat_id,
                is_owner,
                is_active,
                from_date,
                to_date
            });
        } else {
            await Member.create({
                user_id,
                flat_id,
                is_owner,
                is_active,
                from_date,
                to_date
            });
        }

        res.json({ message: 'Flat assigned successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/* CHANGE PASSWORD */
exports.changePassword = async (req, res) => {
    try {
        const hashed = await bcrypt.hash(req.body.password, 10);
        await User.update(
            { password: hashed },
            { where: { id: req.params.id } }
        );
        res.json({ message: 'Password updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/* SOFT DELETE */
exports.remove = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        await user.destroy(); // ✅ paranoid soft delete
        res.json({ message: 'User deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};