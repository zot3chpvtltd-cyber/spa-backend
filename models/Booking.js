module.exports = (sequelize, DataTypes) => {
    const Booking = sequelize.define('Booking', {
        BookingId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        SpaId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        UserId: DataTypes.INTEGER,
        ServiceId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        CustomerName: {
            type: DataTypes.STRING(200),
            allowNull: false
        },
        CustomerEmail: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        CustomerPhone: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        BookingDate: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        BookingTime: {
            type: DataTypes.TIME,
            allowNull: false
        },
        Status: {
            type: DataTypes.STRING(50),
            defaultValue: 'Pending'
        },
        SpecialRequests: DataTypes.TEXT
    }, {
        timestamps: true,
        createdAt: 'CreatedAt',
        updatedAt: false
    });

    return Booking;
};
