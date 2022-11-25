const db = require("../models");
var IO = require("../app");
const { permissionUser } = require("../middleware/getPermission");

const Data = db.workflow;

const newData = async (userId, type) => {
  const isUser = await permissionUser(userId, type);
  const isWhere = [isUser.length > 0 && { id_user: isUser }];
  let finalWhere = [];
  if (isUser.length > 0) {
    finalWhere = isWhere;
  }
  return await Data.findAll({
    where: finalWhere,
    order: [["id", "DESC"]],
    include: [{ model: db.users, as: "user", attributes: ["id", "name"] }],
  });
};

const create = async (req, res) => {
  let data = {
    name: req.body.name,
    doc: req.body.doc,
    id_user: req.userId,
    status: req.status,
  };

  if (!req.body.name) {
    res.status(400).json({
      status: false,
      message: "Name is mandatory",
    });
    return;
  }
  if (!req.body.doc) {
    res.status(400).json({
      status: false,
      message: "Doc is mandatory",
    });
    return;
  }

  try {
    const result = await Data.create(data);
    res.status(200).json({
      status: true,
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      data: error,
    });
  }
};

const getAll = async (req, res) => {
  IO.setEmit("workflow", await newData(req.userId, "workflow"));
  res.status(200).json({
    status: true,
    data: await newData(req.userId, "workflow"),
  });
};

const getOne = async (req, res) => {
  const isUser = await permissionUser(req.userId, "workflow");
  let id = req.params.id;
  let result = await Data.findOne({
    where: [{ id: id }, isUser.length > 0 && { id_user: isUser }],
    include: [{ model: db.users, as: "user", attributes: ["id", "name"] }],
  });
  res.status(200).json({
    status: true,
    data: result,
  });
};

const update = async (req, res) => {
  const isUser = await permissionUser(req.userId, "workflow");
  let id = req.params.id;
  try {
    const result = await Data.update(req.body, {
      where: [{ id: id }, isUser.length > 0 && { id_user: isUser }],
    });
    if (result > 0) {
      res.status(200).json({
        status: true,
        data: await newData(req.userId, "worklfow"),
      });
    } else {
      res.status(400).json({
        status: false,
        message: "No data or you don't have access to this document!",
      });
    }
  } catch (error) {
    res.status(400).json({ status: false, data: error });
  }
};

const deleteData = async (req, res) => {
  const isUser = await permissionUser(req.userId, "workflow");
  let id = req.params.id;
  try {
    const result = await Data.destroy({
      where: [{ id: id }, isUser.length > 0 && { id_user: isUser }],
    });
    if (result > 0) {
      res.status(200).json({
        status: true,
        message: "successfully delete data",
        data: await newData(req.userId, "workflow"),
      });
    } else {
      res.status(400).json({
        status: false,
        message: "No data or you don't have access to this document!",
      });
    }
  } catch (error) {
    res.status(400).json({ status: false, data: error });
  }
};

module.exports = {
  create,
  getAll,
  getOne,
  update,
  deleteData,
};
