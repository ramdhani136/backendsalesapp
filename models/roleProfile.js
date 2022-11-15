module.exports = (sequelize, DataTypes) => {
  const RoleProfiles = sequelize.define("roleprofiles", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    id_user: {
      type: DataTypes.INTEGER,
      allowNull: false,
      index: true,
    },
    id_branch: {
      type: DataTypes.INTEGER,
      allowNull: false,
      index: true,
    },
    status: { type: DataTypes.BOOLEAN, defaultValue: 1 },
  });

  return RoleProfiles;
};
