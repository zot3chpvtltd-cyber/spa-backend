module.exports = (sequelize, DataTypes) => {
    const Membership = sequelize.define('Membership', {
        MembershipId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        SpaId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        UserId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        PlanType: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        StartDate: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        EndDate: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        IsActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    }, {
        timestamps: false // No timestamps in schema for this table
    });

    return Membership;
};
