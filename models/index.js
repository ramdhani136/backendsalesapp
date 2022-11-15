const dbConfig = require("../config/db");
const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,
});

sequelize
  .authenticate()
  .then(() => {
    console.log("DB Connected");
  })
  .catch((err) => {
    console.log("DB Error" + err);
  });

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.devices = require("./deviceModel")(sequelize, DataTypes);
db.branch = require("./branchModel")(sequelize, DataTypes);
db.users = require("./userModel")(sequelize, DataTypes);
db.customergroup = require("./cutsomerGroup")(sequelize, DataTypes);
db.customers = require("./customerModel")(sequelize, DataTypes);
db.visits = require("./visitModel")(sequelize, DataTypes);
db.callsheets = require("./callSheetModel")(sequelize, DataTypes);
db.roleprofiles = require("./roleProfile")(sequelize, DataTypes);
db.rolelists = require("./roleList")(sequelize, DataTypes);
db.roleusers = require("./roleUser")(sequelize, DataTypes);
db.taskvisit = require("./taskVisitModel")(sequelize, DataTypes);
db.permission = require("./permissionModel")(sequelize, DataTypes);
db.contact = require("./contactModel")(sequelize, DataTypes);
db.notif = require("./notifModel")(sequelize, DataTypes);

db.sequelize.sync({ force: false }).then(() => {
  console.log("resync!");
});

// relasi table db

// notif
db.notif.belongsTo(db.users, {
  foreignKey: "id_user",
  as: "user",
});

// Branch
db.branch.belongsTo(db.users, {
  foreignKey: "id_user",
  as: "user",
});

// user
db.users.hasMany(db.roleprofiles, {
  foreignKey: "id_user",
  as: "roleprofile",
});

db.users.hasMany(db.roleusers, {
  foreignKey: "id_user",
  as: "role",
});

// visits
db.visits.belongsTo(db.users, {
  foreignKey: "id_user",
  as: "user",
});

db.visits.belongsTo(db.branch, {
  foreignKey: "id_branch",
  as: "branch",
});

db.visits.belongsTo(db.customers, {
  foreignKey: "id_customer",
  as: "customer",
});

// Callsheet
db.callsheets.belongsTo(db.users, {
  foreignKey: "id_user",
  as: "user",
});

db.callsheets.belongsTo(db.branch, {
  foreignKey: "id_branch",
  as: "branch",
});

db.callsheets.belongsTo(db.customers, {
  foreignKey: "id_customer",
  as: "customer",
});

db.contact.belongsTo(db.users, {
  foreignKey: "id_user",
  as: "user",
});



db.contact.belongsTo(db.customers, {
  foreignKey: "id_customer",
  as: "customer",
});

// customer
db.customers.belongsTo(db.customergroup, {
  foreignKey: "id_customerGroup",
  as: "customergroup",
});

db.customers.belongsTo(db.branch, {
  foreignKey: "id_branch",
  as: "branch",
});

db.customers.belongsTo(db.users, {
  foreignKey: "id_user",
  as: "user",
});

//customergroup
db.customergroup.belongsTo(db.users, {
  foreignKey: "id_user",
  as: "user",
});

db.customergroup.belongsTo(db.branch, {
  foreignKey: "id_branch",
  as: "branch",
});

// Role Profile
db.roleprofiles.hasMany(db.rolelists, {
  foreignKey: "id_role",
  as: "rolelist",
});

db.roleprofiles.belongsTo(db.users, {
  foreignKey: "id_user",
  as: "user",
});

db.roleprofiles.belongsTo(db.branch, {
  foreignKey: "id_branch",
  as: "branch",
});

//Role User
db.roleusers.belongsTo(db.roleprofiles, {
  foreignKey: "id_roleprofile",
  as: "roleprofile",
});

//Role Device
db.devices.belongsTo(db.users, {
  foreignKey: "id_user",
  as: "user",
});

db.devices.belongsTo(db.branch, {
  foreignKey: "id_branch",
  as: "branch",
});

//Role list
db.rolelists.belongsTo(db.users, {
  foreignKey: "id_user",
  as: "user",
});

db.rolelists.belongsTo(db.roleprofiles, {
  foreignKey: "id_role",
  as: "role",
});

// permission
db.permission.belongsTo(db.users, {
  foreignKey: "id_user",
  as: "user",
});

db.permission.belongsTo(db.users, {
  foreignKey: "id_created",
  as: "created",
});

module.exports = db;
