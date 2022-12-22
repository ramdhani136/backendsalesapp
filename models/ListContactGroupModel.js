module.exports = (sequelize, DataTypes) => {
  const ListContactGroup = sequelize.define("contactGroupList", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    id_contactGroup: {
      type: DataTypes.INTEGER,
      index: true,
      allowNull: false,
    },
    id_contact: {
      type: DataTypes.INTEGER,
      index: true,
      allowNull: false,
    },
  });

  return ListContactGroup;
};
