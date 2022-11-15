module.exports = (sequelize, DataTypes) => {
  const Visits = sequelize.define("visits", {
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
    id_customer: {
      type: DataTypes.INTEGER,
      index: true,
      allowNull: false,
      validate: {
        notNull: true,
        notEmpty: true,
      },
    },
    newCustomer: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    manualCustomer: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    address: {
      type: DataTypes.TEXT,

      allowNull: false,
      validate: {
        notNull: true,
        notEmpty: true,
      },
    },
    pic: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: true,
        notEmpty: true,
      },
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: true,
        notEmpty: true,
      },
    },
    priceNote: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    remindOrderNote: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    billingNote: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    compInformNote: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    img: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: true,
        notEmpty: true,
      },
    },
    signature: {
      type: DataTypes.TEXT,
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
    id_user: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: true,
        notEmpty: true,
      },
      index: true,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 1,
    },
    surveyNote: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    id_branch: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: true,
        notEmpty: true,
      },
      index: true,
    },
    surveyAt: {
      type: DataTypes.DATE,
    },
    isSurvey: { type: DataTypes.ENUM("0", "1", "2", "3"), defaultValue: "0" },

    status: {
      type: DataTypes.ENUM("0", "1", "2"),
      defaultValue: "0",
    },
  });

  return Visits;
};
