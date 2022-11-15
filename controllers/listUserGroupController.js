const db = require("../models");
const { permissionUser } = require("../middleware/getPermission");
var IO = require("../app");

const ListGroup = db.listusergroup;

const newData = async (userId, type) => {
  return await ListGroup.findAll({
    order: [["id", "DESC"]],
    include: [
      { model: db.users, as: "user", attributes: ["id", "name"] },
      { model: db.usergroup, as: "usergroup", attributes: ["id", "name"] },
    ],
  });
};

const create = async (req, res) => {
  let data = {
    id_usergroup: req.body.id_usergroup,
    id_user: req.body.id_user,
  };

  try {
    const response = await ListGroup.create(data);
    IO.setEmit("listusergroup", await newData(req.userId, "usergroup"));
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
  let data = await ListGroup.findAll({
    order: [["id", "DESC"]],
    include: [
      { model: db.users, as: "user", attributes: ["id", "name"] },
      { model: db.usergroup, as: "usergroup", attributes: ["id", "name"] },
    ],
  });
  IO.setEmit("listusergroup", await newData(req.userId, "usergroup"));
  res.send(data);
};

const getByGroup = async (req, res) => {
  let id = req.params.id;
  let data = await ListGroup.findAll({
    where: [{ id_usergroup: id }],
    order: [["id", "ASC"]],
    include: [
      { model: db.users, as: "user", attributes: ["id", "name"] },
      { model: db.usergroup, as: "usergroup", attributes: ["id", "name"] },
    ],
  });
  IO.setEmit("listusergroup", await newData(req.userId, "usergroup"));
  res.send(data);
};

const getOne = async (req, res) => {
  let id = req.params.id;
  let response = await ListGroup.findOne({
    where: [{ id: id }],
    include: [
      { model: db.users, as: "user", attributes: ["id", "name"] },
      { model: db.usergroup, as: "usergroup", attributes: ["id", "name"] },
    ],
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
  let id = req.params.id;
  try {
    const data = await ListGroup.update(req.body, {
      where: [{ id: id }],
    });
    if (data > 0) {
      IO.setEmit("listusergroup", await newData(req.userId, "usergroup"));
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
  let id = req.params.id;
  try {
    const hapus = await ListGroup.destroy({
      where: [{ id: id }],
    });
    if (hapus > 0) {
      IO.setEmit("listusergroup", await newData(req.userId, "usergroup"));
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
  getByGroup,
};
