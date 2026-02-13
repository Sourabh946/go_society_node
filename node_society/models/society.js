'use strict';
module.exports = (sequelize, DataTypes) => {
    const Society = sequelize.define(
        'Society',
        {
            name: DataTypes.STRING,
            reg_no: DataTypes.STRING,
            address: DataTypes.TEXT
        },
        {
            tableName: 'societies',
            underscored: true,
            paranoid: true
        }
    );

    Society.associate = (models) => {
        Society.hasMany(models.Building, {
            foreignKey: 'society_id',
            as: 'buildings',
            onDelete: 'RESTRICT'
        })
    }

    return Society;
};
