module.exports = (sequelize, DataTypes) => {
  const VotingOption = sequelize.define("votingOption", {
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
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  });

  return VotingOption;
};
