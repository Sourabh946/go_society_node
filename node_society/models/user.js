'use strict';
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define(
        'User',
        {
            name: DataTypes.STRING,
            email: DataTypes.STRING,
            password: DataTypes.STRING,
            role_id: DataTypes.INTEGER
        },
        {
            tableName: 'users',
            paranoid: true
        }
    );

    User.associate = models => {
        User.belongsTo(models.Role, { foreignKey: 'role_id' });
        User.hasOne(models.Member, { foreignKey: 'user_id' });
    };

    return User;
};
