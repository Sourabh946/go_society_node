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
            underscored: true,
            paranoid: true
        }
    );

    Flat.associate = (models) => {
        Flat.belongsTo(models.Building, {
            foreignKey: 'building_id',
            as: 'building'
        });

        Flat.hasMany(models.Member, {
            foreignKey: 'flat_id',
            as: 'member'
        })
    }

    return Flat;
};
