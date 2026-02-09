const { Society, Building, sequelize } = require('../models');
const { isDuplicate } = require('../utils/duplicateCheck');
const { preventDeleteIfExists } = require('../utils/relationCheck');

exports.create = async (req, res) => {
    const t = await sequelize.transaction();

    try {
        const { name, registration_no, address } = req.body;

        // Duplicate check FIRST (cheapest operation)
        if (await isDuplicate(Society, { registration_no })) {
            await t.rollback();
            return res.status(409).json({
                message: 'Society with this registration number already exists'
            });
        }

        const society = await Society.create(
            { name, registration_no, address },
            { transaction: t }
        );

        await t.commit();
        res.status(201).json(society);

    } catch (err) {
        await t.rollback();
        res.status(500).json({ error: err.message });
    }
};

exports.getAll = async (_, res) => {
    try {
        res.json(await Society.findAll());
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getById = async (req, res) => {
    try {
        const society = await Society.findByPk(req.params.id);
        if (!society) {
            return res.status(404).json({ message: 'Society not found' });
        }
        res.json(society);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.update = async (req, res) => {
    const t = await sequelize.transaction();

    try {
        const societyId = req.params.id;
        const { name, registration_no, address } = req.body;

        // Duplicate check BEFORE fetching full record
        if (
            registration_no &&
            await isDuplicate(Society, { registration_no }, societyId)
        ) {
            await t.rollback();
            return res.status(409).json({
                message: 'Society with this registration number already exists'
            });
        }

        const society = await Society.findByPk(societyId, { transaction: t });
        if (!society) {
            await t.rollback();
            return res.status(404).json({ message: 'Society not found' });
        }

        await society.update(
            { name, registration_no, address },
            { transaction: t }
        );

        await t.commit();
        res.json({ message: 'Society updated successfully' });

    } catch (err) {
        await t.rollback();
        res.status(500).json({ error: err.message });
    }
};

exports.remove = async (req, res) => {
    const t = await sequelize.transaction();

    try {
        const society = await Society.findByPk(req.params.id, { transaction: t });
        if (!society) {
            await t.rollback();
            return res.status(404).json({ message: 'Society not found' });
        }

        await preventDeleteIfExists(
            Building,
            { society_id: society.id },
            'Society has buildings. Delete buildings first.'
        );

        await society.destroy({ transaction: t });

        await t.commit();
        res.json({ message: 'Society deleted successfully' });

    } catch (err) {
        await t.rollback();
        res.status(400).json({ message: err.message });
    }
};
