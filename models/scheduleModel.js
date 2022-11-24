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
    closingDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("0", "1", "2","3"),
      defaultValue: "0",
    },
  });

  return Schedule;
};
