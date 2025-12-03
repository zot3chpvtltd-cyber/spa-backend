module.exports = (sequelize, DataTypes) => {
    const Service = sequelize.define('Service', {
        ServiceId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        SpaId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        Title: {
            type: DataTypes.STRING(200),
            allowNull: false
        },
        Description: DataTypes.TEXT,
        Duration: {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: 'Duration in minutes'
        },
        Price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        ImageUrl: DataTypes.STRING(500),
        IsActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    }, {
        timestamps: true,
        createdAt: 'CreatedAt',
        updatedAt: false
    });

    return Service;
};
