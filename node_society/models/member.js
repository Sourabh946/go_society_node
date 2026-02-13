module.exports = (sequelize, DataTypes) => {
    const Member = sequelize.define(
        'Member',
        {
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },

            flat_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },

            role: {
                type: DataTypes.ENUM('owner', 'tenant'),
                allowNull: false
            },

            is_active: {
                type: DataTypes.BOOLEAN,
                defaultValue: true
            },

            from_date: {
                type: DataTypes.DATEONLY,
                allowNull: false
            },

            to_date: {
                type: DataTypes.DATEONLY,
                allowNull: true
            }
        },
        {
            tableName: 'members',
            underscored: true,
            paranoid: true
        }
    )

    Member.associate = (models) => {
        Member.belongsTo(models.User, {
            foreignKey: 'user_id',
            as: 'user'
        })

        Member.belongsTo(models.Flat, {
            foreignKey: 'flat_id',
            as: 'flat'
        })
    }

    return Member
}