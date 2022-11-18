module.exports = (sequelize, DataTypes) => {
  const UserGroup = sequelize.define("usergroup", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    id_created: {
      type: DataTypes.INTEGER,
      index: true,
      allowNull: false,
    },
    status: { type: DataTypes.BOOLEAN, defaultValue: 1 },
  });

  return UserGroup;
};
