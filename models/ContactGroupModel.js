module.exports = (sequelize, DataTypes) => {
  const ContactGroup = sequelize.define("contactGroup", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    id_contact: {
      type: DataTypes.INTEGER,
      index: true,
      allowNull: false,
    },
    id_created: {
      type: DataTypes.INTEGER,
      index: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: { type: DataTypes.ENUM("0", "1", "2", "3"), defaultValue: "0" },
    workState: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue:"Draft"
    },
  });

  return ContactGroup;
};
