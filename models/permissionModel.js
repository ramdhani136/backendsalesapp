module.exports = (sequelize, DataTypes) => {
  const Permission = sequelize.define("permission", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    id_user: {
      type: DataTypes.INTEGER,
      allowNull: false,
      index: true,
    },
    allow: {
      type: DataTypes.ENUM("branch", "user", "customer", "customergroup"),
    },
    uniqid: { type: DataTypes.STRING, allowNull: false, unique: true },
    value: { type: DataTypes.STRING, allowNull: false },
    id_created: {
      type: DataTypes.INTEGER,
      allowNull: false,
      index: true,
    },
    alldoc: { type: DataTypes.BOOLEAN, defaultValue: 0 },
    doc: {
      type: DataTypes.ENUM(
        "customer",
        "customergroup",
        "callsheet",
        "visit",
        "device",
        "rolelist",
        "roleuser",
        "roleprofile",
        "user",
        "branch",
        "contact",
        "permission"
      ),
      allowNull: true,
    },
    status: { type: DataTypes.BOOLEAN, defaultValue: 1 },
  });

  return Permission;
};
