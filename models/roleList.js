module.exports = (sequelize, DataTypes) => {
  const RoleLists = sequelize.define("rolelists", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    id_role: {
      type: DataTypes.INTEGER,
      allowNull: false,
      index: true,
    },
    doc: {
      type: DataTypes.ENUM(
        "branch",
        "callsheet",
        "visit",
        "customer",
        "customerGroup",
        "device",
        "roleprofile",
        "user",
        "rolelist",
        "roleuser",
        "permission",
        "contact",
        "notif"
      ),
      allowNull: false,
    },
    roleid: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    create: { type: DataTypes.BOOLEAN, defaultValue: 0 },
    read: { type: DataTypes.BOOLEAN, defaultValue: 1 },
    update: { type: DataTypes.BOOLEAN, defaultValue: 0 },
    delete: { type: DataTypes.BOOLEAN, defaultValue: 0 },
    amend: { type: DataTypes.BOOLEAN, defaultValue: 0 },
    submit: { type: DataTypes.BOOLEAN, defaultValue: 0 },
    report: { type: DataTypes.BOOLEAN, defaultValue: 0 },
    export: { type: DataTypes.BOOLEAN, defaultValue: 0 },
    status: { type: DataTypes.BOOLEAN, defaultValue: 1 },
    id_user: {
      type: DataTypes.INTEGER,
      allowNull: false,
      index: true,
    },
  });

  return RoleLists;
};
