const db = require("../models");
const { permissionBranch } = require("../middleware/getPermission");
var IO = require("../app");
const { Op } = require("sequelize");

const Branch = db.branch;

const newBranch = async (userId, type) => {
  const isBranch = await permissionBranch(userId, type);
  const isWhere = [
    isBranch.length > 0 && { id: isBranch },
    { id: { [Op.ne]: 1000000 } },
  ];
  let finalWhere = [{ id: { [Op.ne]: 1000000 } }];
  if (isBranch.length > 0) {
    finalWhere = isWhere;
  }
  return await Branch.findAll({
    where: finalWhere,
    order: [["id", "DESC"]],
    include: [{ model: db.users, as: "user", attributes: ["id", "name"] }],
  });
};

const create = async (req, res) => {
  let data = {
    name: req.body.name,
    deskripsi: req.body.deskripsi,
    lat: req.body.lat,
    lng: req.body.lng,
    id_user: req.body.id_user,
  };

  try {
    const branch = await Branch.create(data);
    IO.setEmit("branches", await newBranch(req.userId, "branch"));
    res
      .status(200)
      .json({ status: true, message: "successfully save data", data: branch });
  } catch (error) {
    res.status(400).json({ status: false, message: error.errors[0].message });
  }
};

const getAllBranch = async (req, res) => {
  const isBranch = await permissionBranch(req.userId, "branch");
  const isWhere = [
    isBranch.length > 0 && { id: isBranch },
    { id: { [Op.ne]: 1000000 } },
  ];
  let finalWhere = [{ id: { [Op.ne]: 1000000 } }];
  if (isBranch.length > 0) {
    finalWhere = isWhere;
  }
  let branch = await Branch.findAll({
    where: finalWhere,
    order: [["id", "DESC"]],
    include: [{ model: db.users, as: "user", attributes: ["id", "name"] }],
  });
  IO.setEmit("branches", await newBranch(req.userId, "branch"));
  res.send(branch);
};

const getOneBranch = async (req, res) => {
  const isBranch = await permissionBranch(req.userId, "branch");
  let id = req.params.id;
  let branch = await Branch.findOne({
    where: [{ id: id }, isBranch.length > 0 && { id: isBranch }],
    include: [{ model: db.users, as: "user", attributes: ["id", "name"] }],
  });
  if (branch) {
    res.status(200).send(branch);
  } else {
    res.status(400).json({
      status: false,
      message: "No data or you don't have access to this document!",
    });
  }
};

const updateBranch = async (req, res) => {
  const isBranch = await permissionBranch(req.userId, "branch");
  let id = req.params.id;
  try {
    const branch = await Branch.update(req.body, {
      where: [{ id: id }, isBranch.length > 0 && { id: isBranch }],
    });
    if (branch > 0) {
      IO.setEmit("branches", await newBranch(req.userId, "branch"));
      res.status(200).json({
        status: true,
        message: "successfully save data",
        data: await newBranch(req.userId, "branch"),
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

const deleteBranch = async (req, res) => {
  const isBranch = await permissionBranch(req.userId, "branch");
  let id = req.params.id;
  try {
    const hapus = await Branch.destroy({
      where: [{ id: id }, isBranch.length > 0 && { id: isBranch }],
    });
    if (hapus > 0) {
      IO.setEmit("branches", await newBranch(req.userId, "branch"));
      res.status(200).json({
        status: true,
        message: "successfully delete data",
        data: await newBranch(req.userId, "branch"),
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
  getAllBranch,
  getOneBranch,
  updateBranch,
  deleteBranch,
};
