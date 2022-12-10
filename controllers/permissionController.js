const db = require("../models");
var IO = require("../app");
const { permissionUser } = require("../middleware/getPermission");
const IsData = db.permission;

const newData = async () => {
  return await IsData.findAll({
    order: [["allow", "ASC"]],
    include: [
      { model: db.users, as: "user", attributes: ["id", "name"] },
      { model: db.users, as: "created", attributes: ["id", "name"] },
    ],
  });
};

const create = async (req, res) => {
  let input = {
    id_user: req.body.id_user,
    uniqid: req.body.doc
      ? req.body.id_user.toString() +
        req.body.allow.toString() +
        req.body.doc.toString() +
        req.body.value.toString()
      : req.body.id_user.toString() +
        req.body.allow.toString() +
        req.body.value.toString(),
    allow: req.body.allow,
    value: req.body.value,
    alldoc: req.body.alldoc,
    id_created: req.body.id_created,
    doc: req.body.doc,
  };

  try {
    const data = await IsData.create(input);
    IO.setEmit("permission", await newData());
    res.status(200).json({
      status: true,
      message: "successfully save data",
      data: data,
    });
  } catch (error) {
    res.status(400).json({ status: false, message: error.errors[0].message });
  }
};

const getAllData = async (req, res) => {
  const isUser = await permissionUser(req.userId, "permission");
  const isWhere = [isUser.length > 0 && { id_user: isUser }];

  let finalWhere = [];
  if (isUser.length > 0) {
    finalWhere = isWhere;
  }
  let data = await IsData.findAll({
    where: finalWhere,
    order: [["allow", "ASC"]],
    include: [
      { model: db.users, as: "user", attributes: ["id", "name"] },
      { model: db.users, as: "created", attributes: ["id", "name"] },
    ],
  });
  IO.setEmit("permission", await newData());
  res.send(data);
};

const getByUser = async (req, res) => {
  let id = req.params.id;
  let data = await IsData.findAll({
    where: { id_user: id },
    include: [
      { model: db.users, as: "user", attributes: ["id", "name"] },
      { model: db.users, as: "created", attributes: ["id", "name"] },
    ],
  });
  res.status(200).send(data);
};

const getOneData = async (req, res) => {
  let id = req.params.id;
  const isUser = await permissionUser(req.userId, "permission");
  const isWhere = [isUser.length > 0 && { id_user: isUser }, { id: id }];

  let finalWhere = [{ id: id }];
  if (isUser.length > 0) {
    finalWhere = isWhere;
  }

  let data = await IsData.findAll({
    where: finalWhere,
    include: [
      { model: db.users, as: "user", attributes: ["id", "name"] },
      { model: db.users, as: "created", attributes: ["id", "name"] },
    ],
  });
  res.status(200).send(data);
};

const updateData = async (req, res) => {
  let id = req.params.id;
  const isUser = await permissionUser(req.userId, "permission");
  const isWhere = [isUser.length > 0 && { id_user: isUser }, { id: id }];

  let finalWhere = [{ id: id }];
  if (isUser.length > 0) {
    finalWhere = isWhere;
  }
  req.body.uniqid = req.body.doc
    ? req.body.id_user.toString() +
      req.body.allow.toString() +
      req.body.doc.toString() +
      req.body.value.toString()
    : req.body.id_user.toString() +
      req.body.allow.toString() +
      req.body.value.toString();
  try {
    const data = await IsData.update(req.body, { where: finalWhere });
    if (data > 0) {
      IO.setEmit("permission", await newData());
      res.status(200).json({
        status: true,
        message: "successfully save data",
        data: await newData(),
      });
    } else {
      res.status(400).json({ status: false, message: "No Data" });
    }
  } catch (error) {
    res.status(400).json({ status: false, message: "failed to update data" });
  }
};

const deleteData = async (req, res) => {
  let id = req.params.id;
  const isUser = await permissionUser(req.userId, "permission");
  const isWhere = [isUser.length > 0 && { id_user: isUser }, { id: id }];

  let finalWhere = [{ id: id }];
  if (isUser.length > 0) {
    finalWhere = isWhere;
  }
  try {
    const data = await IsData.destroy({ where: finalWhere });
    if (data > 0) {
      IO.setEmit("permission", await newData());
      res.status(200).json({
        status: true,
        message: "successfully delete data",
        data: await newData(),
      });
    } else {
      res.status(400).json({ status: false, message: "No data" });
    }
  } catch (error) {
    res.status(400).json({ status: false, message: "failed to delete data" });
  }
};

const isPermission = async (allow, value) => {
  return await db.permission.findOne({where:[
    {allow:allow}, {value:value}
  ]});
};

module.exports = {
  create,
  getAllData,
  getOneData,
  updateData,
  deleteData,
  getByUser,
  isPermission,
};
