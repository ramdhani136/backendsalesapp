const db = require("../models");
const {
  permissionBranch,
  permissionCG,
  permissionCustomer,
  permissionUser,
} = require("../middleware/getPermission");
var IO = require("../app");
const { Op } = require("sequelize");
const Customers = db.customers;

const newCustomer = async (userId, type) => {
  const isBranch = await permissionBranch(userId, type);
  const isCG = await permissionCG(userId, type);
  const isCustomer = await permissionCustomer(userId, type);
  const isUser = await permissionUser(userId, type);
  const isWhere = [
    isCG.length > 0 && { id_customergroup: isCG },
    isBranch.length > 0 && { id_branch: isBranch },
    isCustomer.length > 0 && { id: isCustomer },
    isUser.length > 0 && { id_user: isUser },
  ];
  let finalWhere = [];
  if (
    isBranch.length > 0 ||
    isCG.length > 0 ||
    isUser.length > 0 ||
    isCustomer.length > 0
  ) {
    finalWhere = isWhere;
  }
  return await Customers.findAll({
    where: finalWhere,
    order: [["id", "DESC"]],
    include: [
      {
        model: db.customergroup,
        as: "customergroup",
        attributes: ["id", "name", "deskripsi"],
      },
      {
        model: db.branch,
        as: "branch",
        attributes: ["id", "name", "deskripsi", "status"],
      },
      {
        model: db.users,
        as: "user",
        attributes: ["id", "name"],
      },
    ],
  });
};

const create = async (req, res) => {
  let data = {
    name: req.body.name,
    deskripsi: req.body.deskripsi,
    type: req.body.type,
    id_customerGroup: req.body.id_customerGroup,
    email: req.body.email,
    phone: req.body.phone,
    pic: req.body.pic,
    lat: req.body.lat,
    lng: req.body.lng,
    id_branch: req.body.id_branch,
    id_user: req.body.id_user,
    status: req.body.status,
  };
  try {
    const customer = await Customers.create(data);
    IO.setEmit("customers", await newCustomer(req.userId, "customer"));
    res.status(200).json({
      status: true,
      message: "successfully save data",
      data: customer,
    });
  } catch (error) {
    res.status(400).json({ status: false, message: error.errors[0].message });
  }
};

const getAllCustomer = async (req, res) => {
  const isBranch = await permissionBranch(req.userId, "customer");
  const isCG = await permissionCG(req.userId, "customer");
  const isCustomer = await permissionCustomer(req.userId, "customer");
  const isUser = await permissionUser(req.userId, "customer");
  const isWhere = [
    isCG.length > 0 && { id_customergroup: isCG },
    isBranch.length > 0 && { id_branch: isBranch },
    isCustomer.length > 0 && { id: isCustomer },
    isUser.length > 0 && { id_user: isUser },
    { name: { [Op.not]: "New Customer" } },
  ];
  let finalWhere = [{ name: { [Op.not]: "New Customer" } }];
  if (
    isBranch.length > 0 ||
    isCG.length > 0 ||
    isUser.length > 0 ||
    isCustomer.length > 0
  ) {
    finalWhere = isWhere;
  }
  let customer = await Customers.findAll({
    where: finalWhere,
    order: [["id", "DESC"]],
    include: [
      {
        model: db.customergroup,
        as: "customergroup",
        attributes: ["id", "name", "deskripsi"],
      },
      {
        model: db.branch,
        as: "branch",
        attributes: ["id", "name", "deskripsi", "status"],
      },
      {
        model: db.users,
        as: "user",
        attributes: ["id", "name"],
      },
    ],
  });
  IO.setEmit("customers", await newCustomer(req.userId, "customer"));
  res.send(customer);
};

const getByBranch = async (req, res) => {
  let id_branch = req.params.id;
  const isBranch = await permissionBranch(req.userId, "customer");
  const isCG = await permissionCG(req.userId, "customer");
  const isCustomer = await permissionCustomer(req.userId, "customer");
  const isUser = await permissionUser(req.userId, "customer");
  const isWhere = [
    { id_branch: id_branch },
    isCG.length > 0 && { id_customergroup: isCG },
    isBranch.length > 0 && { id_branch: isBranch },
    isCustomer.length > 0 && { id: isCustomer },
    isUser.length > 0 && { id_user: isUser },
    { name: { [Op.not]: "New Customer" } },
  ];
  let finalWhere = [
    { id_branch: id_branch, name: { [Op.not]: "New Customer" } },
  ];
  if (
    isBranch.length > 0 ||
    isCG.length > 0 ||
    isUser.length > 0 ||
    isCustomer.length > 0
  ) {
    finalWhere = isWhere;
  }
  let customer = await Customers.findAll({
    where: finalWhere,
    order: [["id", "DESC"]],
    include: [
      {
        model: db.customergroup,
        as: "customergroup",
        attributes: ["id", "name", "deskripsi"],
      },
      {
        model: db.branch,
        as: "branch",
        attributes: ["id", "name", "deskripsi", "status"],
      },
      {
        model: db.users,
        as: "user",
        attributes: ["id", "name"],
      },
    ],
  });
  IO.setEmit("customers", await newCustomer(req.userId, "customer"));
  res.send(customer);
};

const getByGroup = async (req, res) => {
  let id_group = req.params.id;
  const isBranch = await permissionBranch(req.userId, "customer");
  const isCG = await permissionCG(req.userId, "customer");
  const isCustomer = await permissionCustomer(req.userId, "customer");
  const isUser = await permissionUser(req.userId, "customer");
  const isWhere = [
    { id_customerGroup: id_group },
    isCG.length > 0 && { id_customergroup: isCG },
    isBranch.length > 0 && { id_branch: isBranch },
    isCustomer.length > 0 && { id: isCustomer },
    isUser.length > 0 && { id_user: isUser },
    { name: { [Op.not]: "New Customer" } },
  ];
  let finalWhere = [
    { id_customerGroup: id_group, name: { [Op.not]: "New Customer" } },
  ];
  if (
    isBranch.length > 0 ||
    isCG.length > 0 ||
    isUser.length > 0 ||
    isCustomer.length > 0
  ) {
    finalWhere = isWhere;
  }
  let customer = await Customers.findAll({
    where: finalWhere,
    order: [["id", "DESC"]],
    include: [
      {
        model: db.customergroup,
        as: "customergroup",
        attributes: ["id", "name", "deskripsi"],
      },
      {
        model: db.branch,
        as: "branch",
        attributes: ["id", "name", "deskripsi", "status"],
      },
      {
        model: db.users,
        as: "user",
        attributes: ["id", "name"],
      },
    ],
  });
  IO.setEmit("customers", await newCustomer(req.userId, "customer"));
  res.send(customer);
};

const getOneCustomer = async (req, res) => {
  const isBranch = await permissionBranch(req.userId, "customer");
  const isCG = await permissionCG(req.userId, "customer");
  const isCustomer = await permissionCustomer(req.userId, "customer");
  const isUser = await permissionUser(req.userId, "customer");

  let id = req.params.id;
  let customer = await Customers.findOne({
    where: [
      { id: id },
      isCG.length > 0 && { id_customergroup: isCG },
      isBranch.length > 0 && { id_branch: isBranch },
      isCustomer.length > 0 && { id: isCustomer },
      isUser.length > 0 && { id_user: isUser },
      { name: { [Op.not]: "New Customer" } },
    ],
    include: [
      {
        model: db.customergroup,
        as: "customergroup",
        attributes: ["id", "name", "deskripsi"],
      },
      {
        model: db.branch,
        as: "branch",
        attributes: ["id", "name", "deskripsi", "status"],
      },
      {
        model: db.users,
        as: "user",
        attributes: ["id", "name"],
      },
    ],
  });
  if (customer) {
    res.status(200).send(customer);
  } else {
    res.status(400).json({
      status: false,
      message: "No data or you don't have access to this document!",
    });
  }
};

const updateCustomer = async (req, res) => {
  const isBranch = await permissionBranch(req.userId, "customer");
  const isCG = await permissionCG(req.userId, "customer");
  const isCustomer = await permissionCustomer(req.userId, "customer");
  const isUser = await permissionUser(req.userId, "customer");
  let id = req.params.id;
  const customer = await Customers.update(req.body, {
    where: [
      { id: id },
      isCG.length > 0 && { id_customergroup: isCG },
      isBranch.length > 0 && { id_branch: isBranch },
      isCustomer.length > 0 && { id: isCustomer },
      isUser.length > 0 && { id_user: isUser },
      { name: { [Op.not]: "New Customer" } },
    ],
  });
  if (customer > 0) {
    IO.setEmit("customers", await newCustomer(req.userId, "customer"));
    res.status(200).json({
      status: true,
      message: "successfully save data",
      data: await newCustomer(req.userId, "customer"),
    });
  } else {
    res.status(400).json({
      status: false,
      message: "No data or you don't have access to this document!",
    });
  }
};

const deleteCustomer = async (req, res) => {
  const isBranch = await permissionBranch(req.userId, "customer");
  const isCG = await permissionCG(req.userId, "customer");
  const isCustomer = await permissionCustomer(req.userId, "customer");
  const isUser = await permissionUser(req.userId, "customer");
  let id = req.params.id;
  try {
    const hapus = await Customers.destroy({
      where: [
        { id: id },
        isCG.length > 0 && { id_customergroup: isCG },
        isBranch.length > 0 && { id_branch: isBranch },
        isCustomer.length > 0 && { id: isCustomer },
        isUser.length > 0 && { id_user: isUser },
        { name: { [Op.not]: "New Customer" } },
      ],
    });
    if (hapus > 0) {
      IO.setEmit("customers", await newCustomer(req.userId, "customer"));
      res.status(200).json({
        status: true,
        message: "successfully delete data",
        data: await newCustomer(req.userId, "customer"),
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
  getAllCustomer,
  getOneCustomer,
  updateCustomer,
  deleteCustomer,
  getByBranch,
  getByGroup
};
