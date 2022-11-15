const db = require("../models");
const { permissionBranch, permissionUser } = require("../middleware/getPermission");
var IO = require("../app");
const Devices = db.devices;

const newDevices = async (userId, type) => {
  const isBranch = await permissionBranch(userId, type);
  const isUser = await permissionUser(userId, type);
  const isWhere = [
    isBranch.length > 0 && { id_branch: isBranch },
    isUser.length > 0 && { id: isUser },
  ];

  let finalWhere = [];
  if (isBranch.length > 0 || isUser.length > 0) {
    finalWhere = isWhere;
  }
  return await Devices.findAll({
    where: finalWhere,
    order: [["id", "DESC"]],
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
    const device = await Devices.create(data);
    IO.setEmit("devices", await newDevices(req.userId, "device"));
    res.status(200).json({
      status: true,
      message: "successfully save data",
      data: device,
    });
  } catch (error) {
    res.status(400).json({ status: false, message: error.errors[0].message });
  }
};

const getAllDevice = async (req, res) => {
  const isBranch = await permissionBranch(req.userId, "device");
  const isUser = await permissionUser(req.userId, "customer");
  const isWhere = [
    isBranch.length > 0 && { id_branch: isBranch },
    isUser.length > 0 && { id_user: isUser },
  ];

  let finalWhere = [];
  if (isBranch.length > 0 || isUser.length > 0) {
    finalWhere = isWhere;
  }
  let devices = await Devices.findAll({
    where: finalWhere,
    order: [["id", "DESC"]],
    include: [
      { model: db.users, as: "user", attributes: ["id", "name"] },
      { model: db.branch, as: "branch", attributes: ["id", "name"] },
    ],
  });
  IO.setEmit("devices", await newDevices(req.userId, "device"));
  res.send(devices);
};

const getOneDevice = async (req, res) => {
  const isBranch = await permissionBranch(req.userId, "device");
  const isUser = await permissionUser(req.userId, "customer");
  let id = req.params.id;
  let device = await Devices.findOne({
    where: [
      { id: id },
      isBranch.length > 0 && { id_branch: isBranch },
      isUser.length > 0 && { id_user: isUser },
    ],
  });
  if (device) {
    res.status(200).send(device);
  } else {
    res.status(400).json({
      status: false,
      message: "No data or you don't have access to this document!",
    });
  }
};

const updateDevice = async (req, res) => {
  const isBranch = await permissionBranch(req.userId, "device");
  const isUser = await permissionUser(req.userId, "customer");
  let id = req.params.id;
  const devices = await Devices.update(req.body, {
    where: [
      { id: id },
      isBranch.length > 0 && { id_branch: isBranch },
      isUser.length > 0 && { id_user: isUser },
    ],
  });
  if (devices > 0) {
    IO.setEmit("devices", await newDevices(req.userId, "device"));
    res.status(200).json({
      status: true,
      message: "successfully save data",
      data: await newDevices(req.userId, "device"),
    });
  } else {
    res.status(400).json({
      status: false,
      message: "No data or you don't have access to this document!",
    });
  }
};

const deleteDevice = async (req, res) => {
  const isBranch = await permissionBranch(req.userId, "device");
  const isUser = await permissionUser(req.userId, "customer");
  let id = req.params.id;
  try {
    const hapus = await Devices.destroy({
      where: [
        { id: id },
        isBranch.length > 0 && { id_branch: isBranch },
        isUser.length > 0 && { id_user: isUser },
      ],
    });
    if (hapus > 0) {
      IO.setEmit("devices", await newDevices(req.userId, "device"));
      res.status(200).json({
        status: true,
        message: "successfully delete data",
        data: await newDevices(req.userId, "device"),
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
  getAllDevice,
  getOneDevice,
  updateDevice,
  deleteDevice,
};
