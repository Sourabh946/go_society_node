'use strict';
module.exports = (sequelize, DataTypes) => {
    const Building = sequelize.define(
        'Building',
        {
            name: DataTypes.STRING,
            society_id: DataTypes.INTEGER
        },
        {
            tableName: 'buildings',
            paranoid: true
        }
    );

    Building.associate = models => {
        Building.belongsTo(models.Society, { foreignKey: 'society_id' });
        Building.hasMany(models.Flat, { foreignKey: 'building_id' });
    };

    return Building;
};
