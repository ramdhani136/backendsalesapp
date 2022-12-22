module.exports = (sequelize, DataTypes) => {
  const Voting = sequelize.define("voting", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    buttonName: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue:"Vote"
    },
    Header: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue:"PT. Ekatunggal Tunas Mandiri"
    },
    question: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    id_created: {
      type: DataTypes.INTEGER,
      index: true,
      allowNull: false,
    },
    closingDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("0", "1", "2","3"),
      defaultValue: "0",
      allowNull:false,
    },
    workState: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue:"Draft"
    },
  });

  return Voting;
};
