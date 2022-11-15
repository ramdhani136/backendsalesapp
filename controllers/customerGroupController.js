const db = require("../models");
const jwt = require("jsonwebtoken");
const {
  permissionBranch,
  permissionCG,
  permissionCustomer,
  permissionUser,
} = require("../middleware/getPermission");
var IO = require("../app");
const { Op } = require("sequelize");
const CustomerGroup = db.customergroup;

const newCG = async (userId, type) => {
  const isBranch = await permissionBranch(userId, type);
  return await CustomerGroup.findAll({
    where: isBranch.length > 0 && { id_branch: isBranch },
    order: [["id", "DESC"]],
    include: [
      { model: db.users, as: "user", attributes: ["id", "name"] },
      { model: db.branch, as: "branch", attributes: ["id", "name"] },
    ],
  });
};

const create = async (req, res) => {
  let data = {
    name: req.body.name,
    deskripsi: req.body.deskripsi,
    id_user: req.body.id_user,
    id_branch: req.body.id_branch,
  };
  try {
    const cg = await CustomerGroup.create(data);
    IO.setEmit("customergroup", await newCG(req.userId, "customergroup"));
    res.status(200).json({
      status: true,
      message: "successfully save data",
      data: cg,
    });
  } catch (error) {
    res.status(400).json({ status: false, message: error.errors[0].message });
  }
};

const getAllCG = async (req, res) => {
  let isBranch = await permissionBranch(req.userId, "customergroup");
  let cg = await CustomerGroup.findAll({
    where: isBranch.length > 0 && { id_branch: isBranch },
    order: [["id", "DESC"]],
    include: [
      { model: db.users, as: "user", attributes: ["id", "name"] },
      { model: db.branch, as: "branch", attributes: ["id", "name"] },
    ],
  });
  IO.setEmit("customergroup", await newCG(req.userId, "customergroup"));
  res.send(cg);
};

const getOneCG = async (req, res) => {
  const isBranch = await permissionBranch(req.userId, "customergroup");
  let id = req.params.id;
  let cg = await CustomerGroup.findOne({
    where: [{ id: id }, isBranch.length > 0 && { id_branch: isBranch }],
    include: [
      { model: db.users, as: "user", attributes: ["id", "name"] },
      { model: db.branch, as: "branch", attributes: ["id", "name"] },
    ],
  });
  if (cg) {
    res.status(200).send(cg);
  } else {
    res.status(400).json({
      status: false,
      message: "No data or you don't have access to this document!",
    });
  }
};

const updateCG = async (req, res) => {
  const isBranch = await permissionBranch(req.userId, "customergroup");
  let id = req.params.id;
  const cg = await CustomerGroup.update(req.body, {
    where: [{ id: id }, isBranch.length > 0 && { id_branch: isBranch }],
  });
  if (cg > 0) {
    IO.setEmit("customergroup", await newCG(req.userId, "customergroup"));
    res.status(200).json({
      status: true,
      message: "successfully save data",
      data: await newCG(req.userId, "customergroup"),
    });
  } else {
    res.status(400).json({
      status: false,
      message: "No data or you don't have access to this document!",
    });
  }
};

const getByBranch = async (req, res) => {
  let id = req.params.id;
  const isBranch = await permissionBranch(req.userId, "customergroup");
  const isCG = await permissionCG(req.userId, "customergroup");
  const isUser = await permissionUser(req.userId, "customergroup");
  const isWhere = [
    { id_branch: id },
    isCG.length > 0 && { id: isCG },
    isBranch.length > 0 && { id_branch: isBranch },

    isUser.length > 0 && { id_user: isUser },
  ];
  let finalWhere = [{ id_branch: id }];
  if (isBranch.length > 0 || isCG.length > 0 || isUser.length > 0) {
    finalWhere = isWhere;
  }

  let cg = await CustomerGroup.findAll({
    where: isWhere,
    order: [["id", "DESC"]],
    include: [
      { model: db.users, as: "user", attributes: ["id", "name"] },
      { model: db.branch, as: "branch", attributes: ["id", "name"] },
    ],
  });
  IO.setEmit("customergroup", await newCG(req.userId, "customergroup"));
  res.send(cg);
};

const deleteCG = async (req, res) => {
  const isBranch = await permissionBranch(req.userId, "customergroup");
  let id = req.params.id;
  try {
    const hapus = await CustomerGroup.destroy({
      where: [{ id: id }, isBranch.length > 0 && { id_branch: isBranch }],
    });
    if (hapus > 0) {
      IO.setEmit("customergroup", await newCG(req.userId, "customergroup"));
      res.status(200).json({
        status: true,
        message: "successfully delete data",
        data: await newCG(req.userId, "customergroup"),
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
  getAllCG,
  getOneCG,
  updateCG,
  deleteCG,
  getByBranch,
};
