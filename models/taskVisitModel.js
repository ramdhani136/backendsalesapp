module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define("taskvisit", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    deskripsi: { type: DataTypes.TEXT, allowNull: false },
    id_user: {
      type: DataTypes.INTEGER,
      index: true,
    },
    id_sales: { type: DataTypes.INTEGER, index: true },
    id_customerGroup: { type: DataTypes.INTEGER, index: true },
    id_branch: { type: DataTypes.INTEGER, index: true },
    status: { type: DataTypes.BOOLEAN, defaultValue: 1 },
    closeAt: {
      type: DataTypes.DATE,
    },
  });

  return Task;
};
