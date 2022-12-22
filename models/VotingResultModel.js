module.exports = (sequelize, DataTypes) => {
  const votingResult = sequelize.define("votingResult", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    id_voting: {
      type: DataTypes.INTEGER,
      index: true,
      allowNull: false,
    },
    id_votingOption: {
      type: DataTypes.INTEGER,
      index: true,
      allowNull: false,
    },
    Phone: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  });

  return votingResult;
};
