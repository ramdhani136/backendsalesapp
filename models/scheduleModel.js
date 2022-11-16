module.exports = (sequelize, DataTypes) => {
  const Schedule = sequelize.define("schedule", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM("visit", "callsheet"),
      defaultValue: "callsheet",
    },
    id_usergroup: {
      type: DataTypes.INTEGER,
      index: true,
      allowNull: false,
    },
    notes: { type: DataTypes.TEXT, allowNull: true },
    id_created: {
      type: DataTypes.INTEGER,
      index: true,
      allowNull: false,
    },
    activeDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("Draft", "Active", "Closed", "Canceled"),
      defaultValue: "Draft",
    },
  });

  return Schedule;
};
