module.exports = (sequelize, DataTypes) => {
  const RoleUser = sequelize.define("roleusers", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    id_roleprofile: {
      type: DataTypes.INTEGER,
      index: true,
      allowNull: false,
    },
    uniqid: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    id_user: {
      type: DataTypes.INTEGER,
      allowNull: false,
      index: true,
    },
    status: { type: DataTypes.BOOLEAN, defaultValue: 1 },
  });

  return RoleUser;
};
