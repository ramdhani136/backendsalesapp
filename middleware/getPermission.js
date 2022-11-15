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
  let allDoc = await db.permission.findAll({
    where: [{ id_user: userId }, { allow: "user" }, { alldoc: true }],
  });

  let isData = [];
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

  const isPermission = [...new Set(isData.map((item) => item))];

  return isPermission;
};

module.exports = {
  permissionBranch,
  permissionCG,
  permissionCustomer,
  permissionUser,
};
