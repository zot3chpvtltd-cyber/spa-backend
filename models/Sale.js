module.exports = (sequelize, DataTypes) => {
    const Sale = sequelize.define('Sale', {
        SaleId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        SpaId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'SpaOrganizations',
                key: 'SpaId'
            }
        },
        BookingId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'Bookings',
                key: 'BookingId'
            }
        },
        CustomerName: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        ServiceName: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        Amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        PaymentMethod: {
            type: DataTypes.STRING(50),
            defaultValue: 'Cash'
        },
        SaleDate: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    }, {
        tableName: 'Sales',
        timestamps: true
    });

    return Sale;
};
