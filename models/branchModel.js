module.exports = (sequelize, DataTypes) => {
  const Branch = sequelize.define("branch", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    deskripsi: { type: DataTypes.TEXT, allowNull: true },
    id_user: {
      type: DataTypes.INTEGER,
      index: true,
    },
    lat: { type: DataTypes.STRING, allowNull: true },
    lng: { type: DataTypes.STRING, allowNull: true },
    status: { type: DataTypes.BOOLEAN, defaultValue: 1 },
  });

  return Branch;
};
