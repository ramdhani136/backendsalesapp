const db = require("../models");
const { permissionUser } = require("../middleware/getPermission");
var IO = require("../app");
const { isPermission } = require("./permissionController");

const Group = db.usergroup;

const newData = async (userId, type) => {
  const isUser = await permissionUser(userId, type);
  const isWhere = [isUser.length > 0 && { id_created: isUser }];
  let finalWhere = [];
  if (isUser.length > 0) {
    isUser.push(userId);
    finalWhere = isWhere;
  }
  return await Group.findAll({
    where: finalWhere,
    order: [["id", "DESC"]],
    include: [{ model: db.users, as: "user", attributes: ["id", "name"] }],
  });
};

const create = async (req, res) => {
  let data = {
    name: req.body.name,
    status: req.body.status,
    id_created: req.body.id_created,
  };

  try {
    const response = await Group.create(data);
    IO.setEmit("usergroup", await newData(req.userId, "usergroup"));
    res.status(200).json({
      status: true,
      message: "successfully save data",
      data: response,
    });
  } catch (error) {
    res.status(400).json({ status: false, message: error.errors[0].message });
  }
};

const getAll = async (req, res) => {
  const isUser = await permissionUser(req.userId, "usergroup");

  const isWhere = [isUser.length > 0 && { id_created: isUser }];
  let finalWhere = [];
  if (isUser.length > 0) {
    isUser.push(req.userId);
    finalWhere = isWhere;
  }
  let data = await Group.findAll({
    where: finalWhere,
    order: [["id", "DESC"]],
    include: [{ model: db.users, as: "user", attributes: ["id", "name"] }],
  });
  IO.setEmit("usergroup", await newData(req.userId, "usergroup"));
  res.send(data);
};

const getOne = async (req, res) => {
  const isUser = await permissionUser(req.userId, "usergroup");
  if (isUser.length > 0) {
    isUser.push(req.userId);
  }
  let id = req.params.id;
  let response = await Group.findOne({
    where: [{ id: id }, isUser.length > 0 && { id_created: isUser }],
    include: [{ model: db.users, as: "user", attributes: ["id", "name"] }],
  });
  if (response) {
    res.status(200).send(response);
  } else {
    res.status(400).json({
      status: false,
      message: "No data or you don't have access to this document!",
    });
  }
};

const update = async (req, res) => {
  const isUser = await permissionUser(req.userId, "usergroup");
  if (isUser.length > 0) {
    isUser.push(req.userId);
  }
  let id = req.params.id;
  try {
    const data = await Group.update(req.body, {
      where: [{ id: id }, isUser.length > 0 && { id_created: isUser }],
    });
    if (data > 0) {
      IO.setEmit("usergroup", await newData(req.userId, "usergroup"));
      res.status(200).json({
        status: true,
        message: "successfully save data",
        data: await newData(req.userId, "usergroup"),
      });
    } else {
      res.status(400).json({
        status: false,
        message: "No data or you don't have access to this document!",
      });
    }
  } catch (error) {
    res.status(400).json({ status: false, message: "failed to update data" });
  }
};

const deleteData = async (req, res) => {
  const isUser = await permissionUser(req.userId, "usergroup");
  if (isUser.length > 0) {
    isUser.push(req.userId);
  }
  let id = req.params.id;
  const getPermissionUser = await isPermission("usergroup", id);
  if (getPermissionUser) {
    res.status(400).json({
      status: false,
      message: "Failed , data is related to permission user",
    });
    return
  }
  try {
    const hapus = await Group.destroy({
      where: [{ id: id }, isUser.length > 0 && { id_created: isUser }],
    });
    if (hapus > 0) {
      IO.setEmit("usergroup", await newData(req.userId, "usergroup"));
      res.status(200).json({
        status: true,
        message: "successfully delete data",
        data: await newData(req.userId, "usergroup"),
      });
    } else {
      res.status(400).json({
        status: false,
        message: "No data or you don't have access to this document!",
      });
    }
  } catch (error) {
    res.status(400).json({ status: false, message: "failed to delete data" });
  }
};

module.exports = {
  create,
  getAll,
  getOne,
  update,
  deleteData,
};
