module.exports = (sequelize, DataTypes) => {
    const workflowaction = sequelize.define("workflowaction", {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        index: true,
        unique: true,
      },
      id_user: {
        type: DataTypes.INTEGER,
        index: true,
        allowNull: false,
      },
    });
  
    return workflowaction;
  };
  