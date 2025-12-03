module.exports = (sequelize, DataTypes) => {
    const SpaOrganization = sequelize.define('SpaOrganization', {
        SpaId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        SpaName: {
            type: DataTypes.STRING(200),
            allowNull: false
        },
        SpaSlug: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true
        },
        CustomDomain: {
            type: DataTypes.STRING(255),
            unique: true
        },
        ContactEmail: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true
        },
        ContactPhone: DataTypes.STRING(20),
        Address: DataTypes.TEXT,
        City: DataTypes.STRING(100),
        State: DataTypes.STRING(100),
        Country: {
            type: DataTypes.STRING(100),
            defaultValue: 'India'
        },
        SubscriptionStatus: {
            type: DataTypes.STRING(50),
            defaultValue: 'Trial'
        },
        SubscriptionStartDate: DataTypes.DATE,
        SubscriptionEndDate: DataTypes.DATE,
        YearlyPrice: {
            type: DataTypes.DECIMAL(10, 2),
            defaultValue: 15000.00
        },
        SetupFee: {
            type: DataTypes.DECIMAL(10, 2),
            defaultValue: 15000.00
        },
        LastPaymentDate: DataTypes.DATE,
        NextBillingDate: DataTypes.DATE,
        IsActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        IsVerified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
        timestamps: true,
        createdAt: 'CreatedAt',
        updatedAt: 'UpdatedAt'
    });

    return SpaOrganization;
};
