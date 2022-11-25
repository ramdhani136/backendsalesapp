module.exports = (sequelize, DataTypes) => {
  const worflowstate = sequelize.define("workflowstate", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      index: false,
      unique: true,
    },
    id_user: {
      type: DataTypes.INTEGER,
      index: true,
      allowNull: false,
    },
  });

  return worflowstate;
};
