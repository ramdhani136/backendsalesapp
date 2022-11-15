module.exports = (sequelize, DataTypes) => {
  const Contact = sequelize.define("contact", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    deskripsi: { type: DataTypes.TEXT, allowNull: true },
    id_customer: {
      type: DataTypes.INTEGER,
      index: true,
    },
    id_user: {
      type: DataTypes.INTEGER,
      index: true,
    },
    status: { type: DataTypes.BOOLEAN, defaultValue: 1 },
  });

  return Contact;
};
