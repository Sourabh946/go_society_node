const { Member, User, Flat, Building, Society } = require('../models')

/**
 * GET /api/members
 * List all members with full hierarchy
 */
exports.list = async (req, res) => {
    try {
        const members = await Member.findAll({
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'name', 'email']
                },
                {
                    model: Flat,
                    as: 'flat',
                    include: [
                        {
                            model: Building,
                            as: 'building',
                            include: [
                                {
                                    model: Society,
                                    as: 'society'
                                }
                            ]
                        }
                    ]
                }
            ],
            order: [['created_at', 'DESC']]
        })

        res.json(members)
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Failed to load members' })
    }
}

/**
 * POST /api/members
 * Assign user to flat
 */
exports.assign = async (req, res) => {
    const { user_id, flat_id, role, from_date } = req.body

    if (!user_id || !flat_id || !role || !from_date) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    try {
        // 1️⃣ user already assigned
        const existing = await Member.findOne({
            where: { user_id, is_active: true }
        })

        if (existing) {
            return res.status(409).json({
                message: 'User already assigned to a flat'
            })
        }

        // 2️⃣ only one active owner per flat
        if (role === 'owner') {
            const ownerExists = await Member.findOne({
                where: {
                    flat_id,
                    role: 'owner',
                    is_active: true
                }
            })

            if (ownerExists) {
                return res.status(409).json({
                    message: 'This flat already has an active owner'
                })
            }
        }

        // 3️⃣ create member
        const member = await Member.create({
            user_id,
            flat_id,
            role,
            from_date,
            is_active: true
        })

        res.status(201).json(member)
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Failed to assign member' })
    }
}

/**
 * PATCH /api/members/:id
 * Update role / active status
 */
exports.update = async (req, res) => {
    const { id } = req.params
    const { role, is_active, to_date } = req.body

    try {
        const member = await Member.findByPk(id)
        if (!member) {
            return res.status(404).json({ message: 'Member not found' })
        }

        // changing role to owner
        if (role === 'owner' && member.role !== 'owner') {
            const ownerExists = await Member.findOne({
                where: {
                    flat_id: member.flat_id,
                    role: 'owner',
                    is_active: true
                }
            })

            if (ownerExists) {
                return res.status(409).json({
                    message: 'Flat already has an active owner'
                })
            }
        }

        await member.update({
            role: role ?? member.role,
            is_active: is_active ?? member.is_active,
            to_date: is_active === false ? to_date || new Date() : null
        })

        res.json(member)
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Failed to update member' })
    }
}

/**
 * DELETE /api/members/:id
 * Soft delete member
 */
exports.remove = async (req, res) => {
    try {
        const member = await Member.findByPk(req.params.id)

        if (!member) {
            return res.status(404).json({ message: 'Member not found' })
        }

        await member.destroy() // soft delete

        res.json({ message: 'Member removed successfully' })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Failed to remove member' })
    }
}
