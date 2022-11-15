module.exports = (sequelize, DataTypes) => {
  const Customers = sequelize.define("customers", {
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
    type: {
      type: DataTypes.ENUM("Company", "Individual"),
      defaultValue: "Company",
    },
    id_customerGroup: {
      type: DataTypes.INTEGER,
      index: true,
      allowNull: false,
    },
    id_branch: {
      type: DataTypes.INTEGER,
      index: true,
      allowNull: false,
    },
    id_user: {
      type: DataTypes.INTEGER,
      index: true,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    pic: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lat: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lng: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: { type: DataTypes.BOOLEAN, defaultValue: 1 },
  });

  return Customers;
};
