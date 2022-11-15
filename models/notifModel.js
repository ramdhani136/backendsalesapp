module.exports = (sequelize, DataTypes) => {
  const Notif = sequelize.define("notif", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    id_user: {
      type: DataTypes.INTEGER,
      index: true,
    },
    action: {
      type: DataTypes.STRING,
      allowNull: false,
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
    page: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    id_params: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    remark: { type: DataTypes.TEXT, allowNull: true },
    status: { type: DataTypes.BOOLEAN, defaultValue: 0 },
  });

  return Notif;
};
