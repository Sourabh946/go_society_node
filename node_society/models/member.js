'use strict';
module.exports = (sequelize, DataTypes) => {
    const Member = sequelize.define(
        'Member',
        {
            user_id: DataTypes.INTEGER,
            flat_id: DataTypes.INTEGER,
            is_owner: {
                type: DataTypes.BOOLEAN,
                defaultValue: false
            }
        },
        {
            tableName: 'members',
            paranoid: true
        }
    );

    Member.associate = models => {
        Member.belongsTo(models.User, { foreignKey: 'user_id' });
        Member.belongsTo(models.Flat, { foreignKey: 'flat_id' });
    };

    return Member;
};
