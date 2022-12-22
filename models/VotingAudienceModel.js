module.exports = (sequelize, DataTypes) => {
  const VotingAudience = sequelize.define("votingAudience", {
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
    id_contact: {
      type: DataTypes.INTEGER,
      index: true,
      allowNull: false,
    },
    Phone: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: { type: DataTypes.ENUM("0", "1", "2", "3"), defaultValue: "0" },
  });

  return VotingAudience;
};
