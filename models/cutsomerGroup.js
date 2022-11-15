module.exports = (sequelize, DataTypes) => {
  const CustomerGroup = sequelize.define("customergroup", {
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
    deskripsi: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    id_user: {
      type: DataTypes.INTEGER,
      index: true,
      allowNull: false,
    },
    id_branch: {
      type: DataTypes.INTEGER,
      index: true,
      allowNull: false,
    },
    status: { type: DataTypes.BOOLEAN, defaultValue: 1 },
  });

  return CustomerGroup;
};
