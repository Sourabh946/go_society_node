'use strict';
module.exports = (sequelize, DataTypes) => {
    const Flat = sequelize.define(
        'Flat',
        {
            flat_number: DataTypes.STRING,
            building_id: DataTypes.INTEGER
        },
        {
            tableName: 'flats',
            paranoid: true
        }
    );

    Flat.associate = models => {
        Flat.belongsTo(models.Building, { foreignKey: 'building_id' });
        Flat.hasMany(models.Member, { foreignKey: 'flat_id' });
    };

    return Flat;
};
