module.exports = (sequelize, DataTypes) => {
  const ActionState = sequelize.define("actionstate", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    id_workflow: {
      type: DataTypes.INTEGER,
      index: true,
      allowNull: false,
    },
    id_state: {
      type: DataTypes.INTEGER,
      index: true,
      allowNull: false,
    },
    docStatus: {
      type: DataTypes.ENUM("0", "1", "2", "3"),
      defaultValue: "0",
      allowNull: false,
    },
    updateField: { type: DataTypes.STRING, allowNull: true },
    updateValue: { type: DataTypes.STRING, allowNull: true },
    id_role: {
      type: DataTypes.INTEGER,
      index: true,
      allowNull: false,
    },
    selfApproval: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    id_user: {
      type: DataTypes.INTEGER,
      index: true,
      allowNull: false,
    },
  });

  return ActionState;
};
