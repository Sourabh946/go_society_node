const { Flat, Building, Society } = require('../models');

exports.create = async (req, res) => {
    try {
        const building = await Building.findByPk(req.body.building_id);
        if (!building) return res.status(400).json({ message: 'Invalid building' });

        const flat = await Flat.create(req.body);
        res.status(201).json(flat);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/* exports.getAll = async (req, res) => {
    try {
        const flats = await Flat.findAll({
            include: [
                {
                    model: Building,
                    as: "building",
                    include: [
                        {
                            model: Society,
                            as: "society",
                            attributes: ["id", "name"]
                        }
                    ]
                }
            ]
        });
        res.json(flats);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}; */

exports.getAll = async (req, res, next) => {
    try {
        const { building_id, page = 1, limit = 10 } = req.query;

        const where = {};
        if (building_id) {
            if (isNaN(building_id)) {
                return res.status(400).json({ error: 'Invalid building_id' });
            }
            where.building_id = building_id;
        }

        const offset = (page - 1) * limit;

        const { rows, count } = await Flat.findAndCountAll({
            where,
            include: [{
                model: Building,
                as: 'building',
                attributes: ['id', 'name'],
                include: [
                    {
                        model: Society,
                        as: 'society',   // 🔥 REQUIRED
                        attributes: ['id', 'name']
                    }
                ]
            }],
            attributes: ['id', 'flat_number'],
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['id', 'DESC']]
        });

        return res.json({
            data: rows,
            meta: {
                total: count,
                page: Number(page),
                limit: Number(limit)
            }
        });
    } catch (err) {
        next(err);
    }
};

exports.getById = async (req, res) => {
    try {
        const flat = await Flat.findByPk(req.params.id,
            {
                include: [{
                    model: Building,
                    as: "building",
                    include: [{
                        model: Society,
                        as: "society",
                        attributes: ["id", "name"]
                    }]
                }]
            }
        );
        if (!flat) return res.status(404).json({ message: 'Not found' });
        res.json(flat);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.update = async (req, res) => {
    try {
        const flat = await Flat.findByPk(req.params.id);
        if (!flat) return res.status(404).json({ message: 'Not found' });

        await flat.update(req.body);
        res.json(flat);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.remove = async (req, res) => {
    try {
        const flat = await Flat.findByPk(req.params.id);
        if (!flat) return res.status(404).json({ message: 'Not found' });

        await flat.destroy();
        res.json({ message: 'Flat deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getFlatsByBuilding = async (req, res) => {
    try {
        const { building_id } = req.params;

        if (!building_id) {
            return res.status(400).json({ error: 'building_id is required' });
        }

        const flats = await Flat.findAll({
            where: { building_id },
            include: [
                {
                    model: Building,
                    as: 'building',
                    attributes: ['id', 'name']
                }
            ]
        });

        return res.json(flats);
    } catch (error) {
        console.error('Error fetching flats by building:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
