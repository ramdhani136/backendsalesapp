const db = require("../models");

const permissionBranch = async (userId, type) => {
  let allDoc = await db.permission.findAll({
    where: [{ id_user: userId }, { allow: "branch" }, { alldoc: true }],
  });

  let isData = [];
  allDoc.forEach((element) => {
    isData = [...isData, element.dataValues.value];
  });

  let typeDoc = await db.permission.findAll({
    where: [
      { id_user: userId },
      { allow: "branch" },
      { alldoc: false },
      { doc: type },
    ],
  });
  typeDoc.forEach((element) => {
    isData = [...isData, element.dataValues.value];
  });

  const isPermission = [...new Set(isData.map((item) => item))];

  return isPermission;
};

const permissionCG = async (userId, type) => {
  let allDoc = await db.permission.findAll({
    where: [{ id_user: userId }, { allow: "customergroup" }, { alldoc: true }],
  });

  let isData = [];
  allDoc.forEach((element) => {
    isData = [...isData, element.dataValues.value];
  });

  let typeDoc = await db.permission.findAll({
    where: [
      { id_user: userId },
      { allow: "customergroup" },
      { alldoc: false },
      { doc: type },
    ],
  });
  typeDoc.forEach((element) => {
    isData = [...isData, element.dataValues.value];
  });

  const isPermission = [...new Set(isData.map((item) => item))];

  return isPermission;
};

const permissionCustomer = async (userId, type) => {
  let allDoc = await db.permission.findAll({
    where: [{ id_user: userId }, { allow: "customer" }, { alldoc: true }],
  });

  let isData = [];
  allDoc.forEach((element) => {
    isData = [...isData, element.dataValues.value];
  });

  let typeDoc = await db.permission.findAll({
    where: [
      { id_user: userId },
      { allow: "customer" },
      { alldoc: false },
      { doc: type },
    ],
  });
  typeDoc.forEach((element) => {
    isData = [...isData, element.dataValues.value];
  });

  const isPermission = [...new Set(isData.map((item) => item))];

  return isPermission;
};

const permissionUser = async (userId, type) => {
  let isData = [];
  let allDocUserGroup = await db.permission.findAll({
    where: [{ id_user: userId }, { allow: "usergroup" }, { alldoc: true }],
  });

  let typeDocUserGroup = await db.permission.findAll({
    where: [
      { id_user: userId },
      { allow: "usergroup" },
      { alldoc: false },
      { doc: type },
    ],
  });

  let allGroup = [];
  if (allDocUserGroup.length > 0) {
    allDocUserGroup.forEach((element) => {
      allGroup = [...allGroup, element.dataValues.value];
    });
  }
  if (typeDocUserGroup.length > 0) {
    typeDocUserGroup.forEach((element) => {
      allGroup = [...allGroup, element.dataValues.value];
    });
  }

  let uniqGroup = Array.from(new Set(allGroup));

  if (uniqGroup.length > 0) {
    uniqGroup.forEach(async (i) => {
      let isUser = await db.listusergroup.findAll({
        where: [{ id_usergroup: i }],
      });
      let ambiluser = await isUser.map((j) => {
        return j.dataValues.id_user;
      });

      ambiluser.forEach((g) => {
        isData = [...isData, g];
      });
    });
  }

  let allDoc = await db.permission.findAll({
    where: [{ id_user: userId }, { allow: "user" }, { alldoc: true }],
  });

  allDoc.forEach((element) => {
    isData = [...isData, element.dataValues.value];
  });

  let typeDoc = await db.permission.findAll({
    where: [
      { id_user: userId },
      { allow: "user" },
      { alldoc: false },
      { doc: type },
    ],
  });
  typeDoc.forEach((element) => {
    isData = [...isData, element.dataValues.value];
  });
  console.log(isData);
  const isPermission = [...new Set(isData.map((item) => item))];

  return isPermission;
};

module.exports = {
  permissionBranch,
  permissionCG,
  permissionCustomer,
  permissionUser,
};
