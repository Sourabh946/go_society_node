'use strict';

const bcrypt = require('bcryptjs');
const { sendMail } = require('../utils/mailer')

const { userEmailUpdated } = require('../utils/mailTemplates');

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define(
        'User',
        {
            name: {
                type: DataTypes.STRING,
                allowNull: false
            },

            email: {
                type: DataTypes.STRING,
                allowNull: false
            },

            password: {
                type: DataTypes.STRING,
                allowNull: false
            },

            role_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            }
        },
        {
            tableName: 'users',
            timestamps: true,
            paranoid: true,          // ✅ SOFT DELETE
            underscored: true
        }
    );

    // 🔐 hash password automatically
    User.beforeCreate(async (user) => {
        user.password = await bcrypt.hash(user.password, 10)
    })

    User.beforeUpdate(async (user) => {
        if (user.changed('password')) {
            user.password = await bcrypt.hash(user.password, 10)
        }
    });

    User.afterUpdate(async (user) => {
        try {
            const changedFields = user.changed() || []

            if (!Array.isArray(changedFields) || changedFields.length === 0) {
                return
            }

            console.log('🔁 User updated fields:', changedFields)

            /* 📧 EMAIL CHANGED */
            if (changedFields.includes('email')) {
                sendMail({
                    to: user.email,
                    subject: 'Your email was updated',
                    html: userEmailUpdated({ name: user.name })
                }).catch(err =>
                    console.error('Mail error (email change):', err.message)
                )
            }/* 🔐 PASSWORD CHANGED */
            if (changedFields.includes('password')) {
                sendMail({
                    to: user.email,
                    subject: 'Password changed',
                    html: `
            <p>Hello ${user.name},</p>
            <p>Your password was changed successfully.</p>
            <p>If this wasn’t you, please contact support immediately.</p>
          `
                }).catch(err =>
                    console.error('Mail error (password):', err.message)
                )
            }

            /* 👤 ROLE CHANGED */
            if (changedFields.includes('role_id')) {
                console.log(`🔄 User ${user.id} role changed`)
            }

        } catch (err) {
            // ❗ NEVER throw inside hooks
            console.error('❌ User afterUpdate hook error:', err.message)
        }
    });

    User.associate = models => {
        User.belongsTo(models.Role, {
            foreignKey: 'role_id',
            as: 'role'
        });
        User.hasOne(models.Member, {
            foreignKey: 'user_id',
            as: 'member'
        });
    };

    return User;
};
