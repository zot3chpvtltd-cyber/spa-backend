module.exports = (sequelize, DataTypes) => {
    const Payment = sequelize.define('Payment', {
        PaymentId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        SpaId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        Amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        Currency: {
            type: DataTypes.STRING(10),
            defaultValue: 'INR'
        },
        PaymentMethod: {
            type: DataTypes.STRING(50),
            defaultValue: 'Razorpay'
        },
        TransactionId: {
            type: DataTypes.STRING(255),
            unique: true
        },
        OrderId: DataTypes.STRING(255),
        PaymentSignature: DataTypes.STRING(500),
        PaymentStatus: {
            type: DataTypes.STRING(50),
            defaultValue: 'Pending'
        },
        PaymentFor: {
            type: DataTypes.STRING(50),
            defaultValue: 'Subscription'
        },
        PaymentDate: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, {
        timestamps: true,
        createdAt: 'CreatedAt',
        updatedAt: false
    });

    return Payment;
};
