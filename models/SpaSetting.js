module.exports = (sequelize, DataTypes) => {
    const SpaSetting = sequelize.define('SpaSetting', {
        SettingId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        SpaId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true
        },
        PrimaryColor: {
            type: DataTypes.STRING(20),
            defaultValue: '#2E1A47'
        },
        SecondaryColor: {
            type: DataTypes.STRING(20),
            defaultValue: '#D4AF37'
        },
        AccentColor: {
            type: DataTypes.STRING(20),
            defaultValue: '#6B4C93'
        },
        FontFamily: {
            type: DataTypes.STRING(100),
            defaultValue: 'Lato'
        },
        LogoUrl: DataTypes.STRING(500),
        FaviconUrl: DataTypes.STRING(500),
        BannerUrl: DataTypes.STRING(500),
        SpaEmail: DataTypes.STRING(255),
        SpaPhone: DataTypes.STRING(20),
        WhatsAppNumber: DataTypes.STRING(20),
        SocialMediaLinks: DataTypes.JSON,
        BusinessHours: DataTypes.JSON,
        CustomCSS: DataTypes.TEXT
    }, {
        timestamps: true,
        createdAt: false, // No CreatedAt in schema for this table, but UpdatedAt exists
        updatedAt: 'UpdatedAt'
    });

    return SpaSetting;
};
