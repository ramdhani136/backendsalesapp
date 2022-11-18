module.exports = (sequelize, DataTypes) => {
    const ListSchedule = sequelize.define("listschedule", {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      id_customer: {
        type: DataTypes.INTEGER,
        index: true,
        allowNull: false,
      },
      id_schedule: {
        type: DataTypes.INTEGER,
        index: true,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM("visit", "callsheet"),
        defaultValue: "callsheet",
      },
      doc: {
        type: DataTypes.STRING,
        allowNull: true,
      }, 
    });
  
    return ListSchedule;
  };
  