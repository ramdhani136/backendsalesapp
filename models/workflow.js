module.exports = (sequelize, DataTypes) => {
  const workflow = sequelize.define("workflow", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      index: true,
      unique: true,
    },
    doc: {
      type: DataTypes.ENUM("visit", "callsheet", "schedule"),
      allowNull: false,
    },
    id_user: {
      type: DataTypes.INTEGER,
      index: true,
      allowNull: false,
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });

  return workflow;
};
