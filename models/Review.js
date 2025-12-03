module.exports = (sequelize, DataTypes) => {
    const Review = sequelize.define('Review', {
        ReviewId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        SpaId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        UserId: DataTypes.INTEGER,
        CustomerName: {
            type: DataTypes.STRING(200),
            allowNull: false
        },
        Rating: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1,
                max: 5
            }
        },
        Comment: DataTypes.TEXT,
        IsApproved: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
        timestamps: true,
        createdAt: 'CreatedAt',
        updatedAt: false
    });

    return Review;
};
