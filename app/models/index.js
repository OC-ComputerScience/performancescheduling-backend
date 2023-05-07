const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  dialectOptions: {
    supportBigNumbers: true,
  },
  operatorsAliases: 0,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.availability = require("./availability.model.js")(sequelize, Sequelize);
db.composer = require("./composer.model.js")(sequelize, Sequelize);
db.critique = require("./critique.model.js")(sequelize, Sequelize);
db.event = require("./event.model.js")(sequelize, Sequelize);
db.eventSignup = require("./eventSignup.model.js")(sequelize, Sequelize);
db.eventSignupPiece = require("./eventSignupPiece.model.js")(
  sequelize,
  Sequelize
);
db.eventType = require("./eventType.model.js")(sequelize, Sequelize);
db.instrument = require("./instrument.model.js")(sequelize, Sequelize);
db.level = require("./level.model.js")(sequelize, Sequelize);
db.major = require("./major.model.js")(sequelize, Sequelize);
db.notification = require("./notification.model.js")(sequelize, Sequelize);
db.piece = require("./piece.model.js")(sequelize, Sequelize);
db.role = require("./role.model.js")(sequelize, Sequelize);
db.semester = require("./semester.model.js")(sequelize, Sequelize);
db.session = require("./session.model.js")(sequelize, Sequelize);
db.studentInstrument = require("./studentInstrument.model.js")(
  sequelize,
  Sequelize
);
db.studentInstrumentEvaluation =
  require("./studentInstrumentEvaluation.model.js")(sequelize, Sequelize);
db.studentInstrumentSignup = require("./studentInstrumentSignup.model.js")(
  sequelize,
  Sequelize
);
db.studentPiece = require("./studentPiece.model.js")(sequelize, Sequelize);
db.user = require("./user.model.js")(sequelize, Sequelize);
db.userNotification = require("./userNotification.model.js")(
  sequelize,
  Sequelize
);
db.userRole = require("./userRole.model.js")(sequelize, Sequelize);

//Availability FKs
db.userRole.hasMany(db.availability, {
  foreignKey: { allowNull: false },
});
db.event.hasMany(db.availability, {
  foreignKey: { allowNull: false },
});
db.availability.belongsTo(db.userRole, {
  foreignKey: { allowNull: false },
});
db.availability.belongsTo(db.event, {
  foreignKey: { allowNull: false },
});

//Critique FKs
db.userRole.hasMany(db.critique, {
  foreignKey: { allowNull: false },
});
db.eventSignup.hasMany(db.critique, {
  foreignKey: { allowNull: false },
});

db.critique.belongsTo(db.userRole, {
  foreignKey: { allowNull: false },
});
db.critique.belongsTo(db.eventSignup, {
  foreignKey: { allowNull: false },
});

//Event FKs
db.userRole.hasMany(db.event, {
  foreignKey: { name: "privateUserRoleId", allowNull: true },
});
db.eventType.hasMany(db.event, {
  foreignKey: { allowNull: false },
});
db.semester.hasMany(db.event, {
  foreignKey: { allowNull: false },
});

db.event.belongsTo(db.userRole, {
  foreignKey: { name: "privateUserRoleId", allowNull: true },
});
db.event.belongsTo(db.eventType, {
  foreignKey: { allowNull: false },
});
db.event.belongsTo(db.semester, {
  foreignKey: { allowNull: false },
});

//EventSignup FKs
db.event.hasMany(db.eventSignup, {
  foreignKey: { allowNull: false },
});

db.eventSignup.belongsTo(db.event, {
  foreignKey: { allowNull: false },
});

//EventSignupPiece FKs
db.eventSignup.hasMany(db.eventSignupPiece, {
  foreignKey: { allowNull: false },
});
db.piece.hasMany(db.eventSignupPiece, {
  foreignKey: { allowNull: false },
});

db.eventSignupPiece.belongsTo(db.eventSignup, {
  foreignKey: { allowNull: false },
});
db.eventSignupPiece.belongsTo(db.piece, {
  foreignKey: { allowNull: false },
});

//Piece FKs
db.composer.hasMany(db.piece, {
  foreignKey: { allowNull: false },
});

db.piece.belongsTo(db.composer, {
  foreignKey: { allowNull: false },
});

//Session FKs
db.user.hasMany(db.session, {
  foreignKey: { allowNull: false },
});

db.session.belongsTo(db.user, {
  foreignKey: { allowNull: false },
});

//StudentInstrument FKs
db.level.hasMany(db.studentInstrument, {
  foreignKey: { allowNull: false },
});
db.userRole.hasMany(db.studentInstrument, {
  as: "studentRole",
  foreignKey: { name: "studentRoleId", allowNull: false },
});
db.userRole.hasMany(db.studentInstrument, {
  as: "instructorRole",
  foreignKey: { name: "instructorRoleId", allowNull: false },
});
db.userRole.hasMany(db.studentInstrument, {
  as: "accompanistRole",
  foreignKey: { name: "accompanistRoleId", allowNull: true },
});
db.instrument.hasMany(db.studentInstrument, {
  foreignKey: { allowNull: false },
});

db.studentInstrument.belongsTo(db.level, {
  foreignKey: { allowNull: false },
});
db.studentInstrument.belongsTo(db.userRole, {
  as: "studentRole",
  foreignKey: { name: "studentRoleId", allowNull: true },
});
db.studentInstrument.belongsTo(db.userRole, {
  as: "instructorRole",
  foreignKey: { name: "instructorRoleId", allowNull: true },
});
db.studentInstrument.belongsTo(db.userRole, {
  as: "accompanistRole",
  foreignKey: { name: "accompanistRoleId" },
});
db.studentInstrument.belongsTo(db.instrument, {
  foreignKey: { allowNull: false },
});

//StudentInstrumentEvaluation FKs
db.semester.hasMany(db.studentInstrumentEvaluation, {
  foreignKey: { allowNull: false },
});
db.studentInstrument.hasMany(db.studentInstrumentEvaluation, {
  foreignKey: { allowNull: false },
});
db.userRole.hasMany(db.studentInstrumentEvaluation, {
  foreignKey: { name: "instructorRoleId", allowNull: false },
});

db.studentInstrumentEvaluation.belongsTo(db.semester, {
  foreignKey: { allowNull: false },
});
db.studentInstrumentEvaluation.belongsTo(db.studentInstrument, {
  foreignKey: { allowNull: false },
});
db.studentInstrumentEvaluation.belongsTo(db.userRole, {
  foreignKey: { name: "instructorRoleId", allowNull: false },
});

//StudentInstrumentSignup FKs
db.eventSignup.hasMany(db.studentInstrumentSignup, {
  foreignKey: { allowNull: false },
});
db.studentInstrument.hasMany(db.studentInstrumentSignup, {
  foreignKey: { allowNull: false },
});
db.userRole.hasMany(db.studentInstrumentSignup, {
  foreignKey: { name: "instructorRoleId", allowNull: false },
});
db.userRole.hasMany(db.studentInstrumentSignup, {
  foreignKey: { name: "accompanistRoleId", allowNull: false },
});

db.studentInstrumentSignup.belongsTo(db.eventSignup, {
  foreignKey: { allowNull: false },
});
db.studentInstrumentSignup.belongsTo(db.studentInstrument, {
  foreignKey: { allowNull: false },
});
db.studentInstrumentSignup.belongsTo(db.userRole, {
  foreignKey: { name: "instructorRoleId", allowNull: false },
});
db.studentInstrumentSignup.belongsTo(db.userRole, {
  foreignKey: { name: "accompanistRoleId", allowNull: false },
});

//StudentPiece FKs
db.studentInstrument.hasMany(db.studentPiece, {
  foreignKey: { allowNull: false },
});
db.piece.hasMany(db.studentPiece, {
  foreignKey: { allowNull: false },
});
db.semester.hasMany(db.studentPiece);

db.studentPiece.belongsTo(db.studentInstrument, {
  foreignKey: { allowNull: false },
});
db.studentPiece.belongsTo(db.piece, {
  foreignKey: { allowNull: false },
});
db.studentPiece.belongsTo(db.semester);

//UserNotification FKs
db.userRole.hasMany(db.userNotification, {
  foreignKey: { allowNull: false },
});
db.notification.hasMany(db.userNotification, {
  foreignKey: { allowNull: false },
});

db.userNotification.belongsTo(db.userRole, {
  foreignKey: { allowNull: false },
});
db.userNotification.belongsTo(db.notification, {
  foreignKey: { allowNull: false },
});

//UserRole FKs
db.major.hasMany(db.userRole, {
  foreignKey: { allowNull: false },
});
db.role.hasMany(db.userRole, {
  foreignKey: { allowNull: false },
});
db.user.hasMany(db.userRole, {
  foreignKey: { allowNull: false },
});

db.userRole.belongsTo(db.major, {
  foreignKey: { allowNull: false },
});
db.userRole.belongsTo(db.role, {
  foreignKey: { allowNull: false },
});
db.userRole.belongsTo(db.user, {
  foreignKey: { allowNull: false },
});

module.exports = db;
