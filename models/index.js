const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import Models
db.SpaOrganization = require('./SpaOrganization')(sequelize, Sequelize);
db.SpaSetting = require('./SpaSetting')(sequelize, Sequelize);
db.User = require('./User')(sequelize, Sequelize);
db.Service = require('./Service')(sequelize, Sequelize);
db.Booking = require('./Booking')(sequelize, Sequelize);
db.Review = require('./Review')(sequelize, Sequelize);
db.Membership = require('./Membership')(sequelize, Sequelize);
db.Payment = require('./Payment')(sequelize, Sequelize);
db.Sale = require('./Sale')(sequelize, Sequelize);

// Define Relationships

// 1. SpaOrganization Relationships
db.SpaOrganization.hasOne(db.SpaSetting, { foreignKey: 'SpaId', onDelete: 'CASCADE' });
db.SpaSetting.belongsTo(db.SpaOrganization, { foreignKey: 'SpaId' });

db.SpaOrganization.hasMany(db.User, { foreignKey: 'SpaId' });
db.User.belongsTo(db.SpaOrganization, { foreignKey: 'SpaId' });

db.SpaOrganization.hasMany(db.Service, { foreignKey: 'SpaId', onDelete: 'CASCADE' });
db.Service.belongsTo(db.SpaOrganization, { foreignKey: 'SpaId' });

db.SpaOrganization.hasMany(db.Booking, { foreignKey: 'SpaId', onDelete: 'CASCADE' });
db.Booking.belongsTo(db.SpaOrganization, { foreignKey: 'SpaId' });

db.SpaOrganization.hasMany(db.Review, { foreignKey: 'SpaId', onDelete: 'CASCADE' });
db.Review.belongsTo(db.SpaOrganization, { foreignKey: 'SpaId' });

db.SpaOrganization.hasMany(db.Membership, { foreignKey: 'SpaId', onDelete: 'CASCADE' });
db.Membership.belongsTo(db.SpaOrganization, { foreignKey: 'SpaId' });

db.SpaOrganization.hasMany(db.Payment, { foreignKey: 'SpaId' });
db.Payment.belongsTo(db.SpaOrganization, { foreignKey: 'SpaId' });

db.SpaOrganization.hasMany(db.Sale, { foreignKey: 'SpaId', onDelete: 'CASCADE' });
db.Sale.belongsTo(db.SpaOrganization, { foreignKey: 'SpaId' });

// 2. User Relationships
db.User.hasMany(db.Booking, { foreignKey: 'UserId' });
db.Booking.belongsTo(db.User, { foreignKey: 'UserId' });

db.User.hasMany(db.Review, { foreignKey: 'UserId' });
db.Review.belongsTo(db.User, { foreignKey: 'UserId' });

db.User.hasMany(db.Membership, { foreignKey: 'UserId', onDelete: 'CASCADE' });
db.Membership.belongsTo(db.User, { foreignKey: 'UserId' });

// 3. Service Relationships
db.Service.hasMany(db.Booking, { foreignKey: 'ServiceId' });
db.Booking.belongsTo(db.Service, { foreignKey: 'ServiceId' });

// 4. Booking Relationships
db.Booking.hasOne(db.Sale, { foreignKey: 'BookingId' });
db.Sale.belongsTo(db.Booking, { foreignKey: 'BookingId' });

module.exports = db;
