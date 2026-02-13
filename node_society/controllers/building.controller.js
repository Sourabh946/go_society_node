const { Building, Society } = require('../models');

exports.create = async (req, res) => {
    try {
        const society = await Society.findByPk(req.body.society_id);
        if (!society) return res.status(400).json({ message: 'Invalid society' });

        const building = await Building.create(req.body);
        res.status(201).json(building);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAll = async (req, res) => {
    try {
        console.log('getAll');
        const buildings = await Building.findAll(
            {
                include: [
                    {
                        model: Society,
                        as: 'society',   // 🔥 REQUIRED
                        attributes: ['id', 'name']
                    }
                ],
                order: [['name', 'ASC']]
            }
        );
        res.json(buildings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.index = async (req, res) => {
    try {
        const where = {}

        if (req.query.society_id) {
            where.society_id = req.query.society_id
        }

        const buildings = await Building.findAll({
            where,
            include: [
                {
                    model: Society,
                    as: 'society',   // 🔥 REQUIRED
                    attributes: ['id', 'name']
                }
            ],
            order: [['name', 'ASC']]
        })

        res.json(buildings)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: err.message })
    }
}

exports.getById = async (req, res) => {
    try {
        const building = await Building.findByPk(req.params.id, {
            include: Society,
            as: 'society'
        });
        if (!building) return res.status(404).json({ message: 'Not found' });
        res.json(building);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.update = async (req, res) => {
    try {
        const building = await Building.findByPk(req.params.id);
        if (!building) return res.status(404).json({ message: 'Not found' });

        await building.update(req.body);
        res.json(building);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.remove = async (req, res) => {
    try {
        const building = await Building.findByPk(req.params.id);
        if (!building) return res.status(404).json({ message: 'Not found' });

        await building.destroy();
        res.json({ message: 'Building deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
