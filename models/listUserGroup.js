module.exports = (sequelize, DataTypes) => {
    const ListUserGroup = sequelize.define("listusergroup", {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      id_usergroup: {
        type: DataTypes.INTEGER,
        index: true,
        allowNull:false,
      },
      id_user: {
        type: DataTypes.INTEGER,
        index: true,
        allowNull:false,
      },
    });
  
    return ListUserGroup;
  };
  