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
db.permission = require("./permissionModel")(sequelize, DataTypes);
db.contact = require("./contactModel")(sequelize, DataTypes);
db.notif = require("./notifModel")(sequelize, DataTypes);
db.usergroup = require("./userGroup")(sequelize, DataTypes);
db.listusergroup = require("./listUserGroup")(sequelize, DataTypes);
db.schedule = require("./scheduleModel")(sequelize, DataTypes);
db.listschedule = require("./listScheduleModel")(sequelize, DataTypes);
db.workflowstate = require("./workflowstate")(sequelize, DataTypes);
db.workflowaction = require("./workflowaction")(sequelize, DataTypes);
db.actionstate = require("./actionstate")(sequelize, DataTypes);
db.workflow = require("./workflow")(sequelize, DataTypes);
db.workflowtransition = require("./workflowtransition")(sequelize, DataTypes);

db.voting = require("./VotingModel")(sequelize, DataTypes);
db.votingOption = require("./VotingOptionsModel")(sequelize, DataTypes);
db.votingAudience = require("./VotingAudienceModel")(sequelize, DataTypes);
db.votingResult = require("./VotingResultModel")(sequelize, DataTypes);
db.contactGroup = require("./ContactGroupModel")(sequelize, DataTypes);
db.contactGroupList = require("./ListContactGroupModel")(sequelize, DataTypes);

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

// usergroup
db.usergroup.belongsTo(db.users, {
  foreignKey: "id_created",
  as: "user",
});

db.usergroup.hasMany(db.listusergroup, {
  foreignKey: "id_usergroup",
  as: "listusergroup",
});

// listusergroup
db.listusergroup.belongsTo(db.users, {
  foreignKey: "id_user",
  as: "user",
});

db.listusergroup.belongsTo(db.usergroup, {
  foreignKey: "id_usergroup",
  as: "usergroup",
});

// schedule
db.schedule.belongsTo(db.users, {
  foreignKey: "id_created",
  as: "user",
});

db.schedule.belongsTo(db.usergroup, {
  foreignKey: "id_usergroup",
  as: "usergroup",
});

// list schedule
db.listschedule.belongsTo(db.customers, {
  foreignKey: "id_customer",
  as: "customer",
});

db.listschedule.belongsTo(db.schedule, {
  foreignKey: "id_schedule",
  as: "schedule",
});

// workflow
db.workflow.belongsTo(db.users, {
  foreignKey: "id_user",
  as: "user",
});

// workflowstate
db.workflowstate.belongsTo(db.users, {
  foreignKey: "id_user",
  as: "user",
});

// workflowaction
db.workflowaction.belongsTo(db.users, {
  foreignKey: "id_user",
  as: "user",
});

// actionstate
db.actionstate.belongsTo(db.users, {
  foreignKey: "id_user",
  as: "user",
});

db.actionstate.belongsTo(db.workflow, {
  foreignKey: "id_user",
  as: "workflow",
});
db.actionstate.belongsTo(db.workflowstate, {
  foreignKey: "id_state",
  as: "state",
});
db.actionstate.belongsTo(db.roleprofiles, {
  foreignKey: "id_role",
  as: "role",
});

// workflowtransition
db.workflowtransition.belongsTo(db.users, {
  foreignKey: "id_user",
  as: "user",
});

db.workflowtransition.belongsTo(db.workflow, {
  foreignKey: "id_workflow",
  as: "workflow",
});
db.workflowtransition.belongsTo(db.workflowaction, {
  foreignKey: "id_action",
  as: "action",
});
db.workflowtransition.belongsTo(db.roleprofiles, {
  foreignKey: "id_role",
  as: "role",
});

db.workflowtransition.belongsTo(db.workflowstate, {
  foreignKey: "id_stateActive",
  as: "stateactive",
});
db.workflowtransition.belongsTo(db.workflowstate, {
  foreignKey: "id_nextState",
  as: "nextstate",
});

// Voting
db.voting.belongsTo(db.users, {
  foreignKey: "id_created",
  as: "user",
});

// Voting Option
db.votingOption.belongsTo(db.voting, {
  foreignKey: "id_voting",
  as: "voting",
});

// Voting Result
db.votingResult.belongsTo(db.voting, {
  foreignKey: "id_voting",
  as: "voting",
});

db.votingResult.belongsTo(db.votingOption, {
  foreignKey: "id_votingOption",
  as: "votingOption",
});

// Voting Audience
db.votingAudience.belongsTo(db.voting, {
  foreignKey: "id_voting",
  as: "voting",
});

db.votingAudience.belongsTo(db.contact, {
  foreignKey: "id_contact",
  as: "contact",
});

// ContactGroup
db.contactGroup.belongsTo(db.users, {
  foreignKey: "id_created",
  as: "created",
});

// Contact Group List
db.contactGroupList.belongsTo(db.contactGroup, {
  foreignKey: "id_contactGroup",
  as: "contactGroup",
});

db.contactGroupList.belongsTo(db.contact, {
  foreignKey: "id_contact",
  as: "contact",
});

module.exports = db;
