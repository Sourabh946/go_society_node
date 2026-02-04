const { Flat, Building } = require('../models');

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

exports.getAll = async (req, res) => {
    try {
        const flats = await Flat.findAll({ include: Building });
        res.json(flats);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getById = async (req, res) => {
    try {
        const flat = await Flat.findByPk(req.params.id, { include: Building });
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
