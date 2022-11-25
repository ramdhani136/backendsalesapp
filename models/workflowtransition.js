module.exports = (sequelize, DataTypes) => {
    const workflowTransition = sequelize.define("workflowtransition", {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      id_workflow: {
        type: DataTypes.INTEGER,
        index: true,
        allowNull: false,
      },
      id_stateActive: {
        type: DataTypes.INTEGER,
        index: true,
        allowNull: false,
      },
      id_action: {
        type: DataTypes.INTEGER,
        index: true,
        allowNull: false,
      },
      id_nextState: {
        type: DataTypes.INTEGER,
        index: true,
        allowNull: false,
      },
      id_role: {
        type: DataTypes.INTEGER,
        index: true,
        allowNull: false,
      },
      selfApproval: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      id_user: {
        type: DataTypes.INTEGER,
        index: true,
        allowNull: false,
      },
    });
  
    return workflowTransition;
  };
  