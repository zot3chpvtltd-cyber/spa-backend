module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        UserId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        SpaId: DataTypes.INTEGER,
        Email: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        PasswordHash: {
            type: DataTypes.STRING(500),
            allowNull: false
        },
        FullName: {
            type: DataTypes.STRING(200),
            allowNull: false
        },
        PlainPassword: {
            type: DataTypes.STRING(255),
            allowNull: true,
            comment: 'For admin password recovery - NOT recommended for production'
        },
        PhoneNumber: DataTypes.STRING(20),
        Role: {
            type: DataTypes.STRING(50),
            defaultValue: 'Customer'
        },
        IsActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        EmailVerified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        ResetPasswordToken: {
            type: DataTypes.STRING(10),
            allowNull: true
        },
        ResetPasswordExpires: {
            type: DataTypes.DATE,
            allowNull: true
        }
    }, {
        timestamps: true,
        createdAt: 'CreatedAt',
        updatedAt: false, // No UpdatedAt in schema for this table
        indexes: [
            {
                unique: true,
                fields: ['Email', 'SpaId']
            }
        ]
    });

    return User;
};
