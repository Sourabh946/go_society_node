const { UniqueConstraintError, ValidationError } = require('sequelize');

module.exports = (err, req, res, next) => {
    console.error(err);

    // Sequelize UNIQUE constraint
    if (err instanceof UniqueConstraintError) {
        const field = err.errors[0]?.path;

        let message = 'Duplicate value';

        if (field) {
            message = `${field.replace('_', ' ')} already exists`;
        }

        return res.status(409).json({ message });
    }

    // Sequelize validation errors
    if (err instanceof ValidationError) {
        return res.status(422).json({
            message: err.errors.map(e => e.message)
        });
    }

    // Custom thrown errors
    if (err.status) {
        return res.status(err.status).json({
            message: err.message
        });
    }

    // Default
    return res.status(500).json({
        message: 'Internal server error'
    });
};
