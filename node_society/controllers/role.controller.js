const { Role, User, sequelize } = require('../models');
const { isDuplicate } = require('../utils/duplicateCheck');
const { preventDeleteIfExists } = require('../utils/relationCheck');

exports.create = async (req, res) => {
    const t = await sequelize.transaction();

    try {
        const { name, reg_no, address } = req.body;

        // Duplicate check FIRST (cheapest operation)
        if (await isDuplicate(Role, { reg_no })) {
            await t.rollback();
            return res.status(409).json({
                message: 'Role with this registration number already exists'
            });
        }

        const role = await Role.create(
            { name, reg_no, address },
            { transaction: t }
        );

        await t.commit();
        res.status(201).json(role);

    } catch (err) {
        await t.rollback();
        res.status(500).json({ error: err.message });
    }
};

exports.getAll = async (_, res) => {
    try {
        res.json(await Role.findAll(
            {
                attributes: ['id', 'name']
            }
        ));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getById = async (req, res) => {
    try {
        const role = await Role.findByPk(req.params.id);
        if (!role) {
            return res.status(404).json({ message: 'Role not found' });
        }
        res.json(role);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.update = async (req, res) => {
    const t = await sequelize.transaction();

    try {
        const roleId = req.params.id;
        const { name, reg_no, address } = req.body;

        // Duplicate check BEFORE fetching full record
        if (
            reg_no &&
            await isDuplicate(Role, { reg_no }, roleId)
        ) {
            await t.rollback();
            return res.status(409).json({
                message: 'Role name already exists'
            });
        }

        const role = await Role.findByPk(roleId, { transaction: t });
        if (!role) {
            await t.rollback();
            return res.status(404).json({ message: 'Role not found' });
        }

        await role.update(
            { name, reg_no, address },
            { transaction: t }
        );

        await t.commit();
        res.json({ message: 'Role updated successfully' });

    } catch (err) {
        await t.rollback();
        res.status(500).json({ error: err.message });
    }
};

exports.remove = async (req, res) => {
    const t = await sequelize.transaction();

    try {
        const role = await Role.findByPk(req.params.id, { transaction: t });
        if (!role) {
            await t.rollback();
            return res.status(404).json({ message: 'Role not found' });
        }

        await preventDeleteIfExists(
            User,
            { role_id: role.id },
            'Role has buildings. Delete buildings first.'
        );

        await role.destroy({ transaction: t });

        await t.commit();
        res.json({ message: 'Role deleted successfully' });

    } catch (err) {
        await t.rollback();
        res.status(400).json({ message: err.message });
    }
};
