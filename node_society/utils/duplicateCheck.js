const { Op } = require('sequelize');

/**
 * Generic duplicate check for Sequelize models
 *
 * @param {Model} Model - Sequelize model
 * @param {Object} where - Fields to check (e.g. { email } or { name })
 * @param {Number|null} excludeId - ID to exclude (for update)
 * @returns {Boolean}
 */
const isDuplicate = async (Model, where, excludeId = null) => {
    const condition = { ...where };

    if (excludeId) {
        condition.id = { [Op.ne]: excludeId };
    }

    const record = await Model.findOne({ where: condition });
    return !!record;
};

module.exports = { isDuplicate };
