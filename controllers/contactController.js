const db = require("../models");
const {
  permissionCG,
  permissionCustomer,
  permissionUser,
} = require("../middleware/getPermission");
const { Op } = require("sequelize");
var IO = require("../app");
const Contact = db.contact;

const newContactById = async (id, userId, type) => {
  const isCG = await permissionCG(userId, type);
  const isCustomer = await permissionCustomer(userId, type);
  const isUser = await permissionUser(userId, type);
  const isWhere = [
    { id: id },
    isCustomer.length > 0 && {
      id_customer: { [Op.or]: [isCustomer, 1000000] },
    },
    isUser.length > 0 && { id_user: isUser },
  ];
  let finalWhere = [{ id: id }];
  if (isUser.length > 0 || isCustomer.length > 0) {
    finalWhere = isWhere;
  }
  return await Contact.findOne({
    where: finalWhere,
    include: [
      {
        model: db.users,
        as: "user",
        attributes: ["id", "name", "username", "email", "phone"],
      },
      {
        model: db.customers,
        as: "customer",
        attributes: ["id", "name", "type", "id_customerGroup", "status"],
        where: isCG.length > 0 && {
          id_customergroup: { [Op.or]: [isCG, 1000000] },
        },
        include: [
          {
            model: db.customergroup,
            as: "customergroup",
            attributes: ["id", "name"],
          },
          {
            model: db.branch,
            as: "branch",
            attributes: ["id", "name"],
          },
        ],
      },
    ],
    order: [["id", "DESC"]],
  });
};

const newContact = async (userId, type) => {
  const isCG = await permissionCG(userId, type);
  const isCustomer = await permissionCustomer(userId, type);
  const isUser = await permissionUser(userId, type);
  const isWhere = [
    isCustomer.length > 0 && {
      id_customer: { [Op.or]: [isCustomer, 1000000] },
    },
    isUser.length > 0 && { id_user: isUser },
  ];
  let finalWhere = [];
  if (isUser.length > 0 || isCustomer.length > 0) {
    finalWhere = isWhere;
  }
  return await Contact.findAll({
    // where: finalWhere,
    include: [
      {
        model: db.users,
        as: "user",
        attributes: ["id", "name", "username", "email", "phone"],
      },
      {
        model: db.customers,
        as: "customer",
        attributes: ["id", "name", "type", "id_customerGroup", "status"],
        where: isCG.length > 0 && {
          id_customergroup: { [Op.or]: [isCG, 1000000] },
        },
        include: [
          {
            model: db.customergroup,
            as: "customergroup",
            attributes: ["id", "name"],
          },
          {
            model: db.branch,
            as: "branch",
            attributes: ["id", "name"],
          },
        ],
      },
    ],
    order: [["id", "DESC"]],
  });
};

const create = async (req, res) => {
  let data = await {
    name: req.body.name,
    phone: req.body.phone,
    email: req.body.email,
    deskripsi: req.body.deskripsi,
    id_customer: req.body.id_customer,
    id_user: req.body.id_user,
    status: req.body.status,
  };

  try {
    const contact = await Contact.create(data);

    IO.setEmit(
      "contact",
      await newContactById(contact.id, req.userId, "contact")
    );
    res.status(200).json({
      status: true,
      message: "successfully save data",
      data: contact,
    });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ status: false, message: `${error.table} is required` });
  }
};

const getAll = async (req, res) => {
  const isCG = await permissionCG(req.userId, "contact");
  const isCustomer = await permissionCustomer(req.userId, "contact");
  const isUser = await permissionUser(req.userId, "contact");
  const isWhere = [
    isCustomer.length > 0 && {
      id_customer: { [Op.or]: [isCustomer, 1000000] },
    },
    isUser.length > 0 && { id_user: isUser },
  ];
  let finalWhere = [];
  if (isUser.length > 0 || isCustomer.length > 0) {
    finalWhere = isWhere;
  }
  let contact = await Contact.findAll({
    where: finalWhere,
    include: [
      {
        model: db.users,
        as: "user",
        attributes: ["id", "name", "username", "email", "phone"],
      },
      {
        model: db.customers,
        as: "customer",
        attributes: ["id", "name", "type", "id_customerGroup", "status"],
        where: isCG.length > 0 && {
          id_customergroup: { [Op.or]: [isCG, 1000000] },
        },
        include: [
          {
            model: db.customergroup,
            as: "customergroup",
            attributes: ["id", "name"],
          },
          {
            model: db.branch,
            as: "branch",
            attributes: ["id", "name"],
          },
        ],
      },
    ],
    order: [["id", "DESC"]],
  });

  res.send(contact);
};

const getByStatus = async (req, res) => {
  let status = req.params.status;
  const isCG = await permissionCG(req.userId, "contact");
  const isCustomer = await permissionCustomer(req.userId, "contact");
  const isUser = await permissionUser(req.userId, "contact");
  const isWhere = [
    { status: status },
    isCustomer.length > 0 && {
      id_customer: { [Op.or]: [isCustomer, 1000000] },
    },
    isUser.length > 0 && { id_user: isUser },
  ];
  let finalWhere = [{ status: status }];
  if (isUser.length > 0 || isCustomer.length > 0) {
    finalWhere = isWhere;
  }
  let contact = await Contact.findAll({
    where: finalWhere,
    include: [
      {
        model: db.users,
        as: "user",
        attributes: ["id", "name", "username", "email", "phone"],
      },

      {
        model: db.customers,
        as: "customer",
        attributes: ["id", "name", "type", "id_customerGroup", "status"],
        where: isCG.length > 0 && {
          id_customergroup: { [Op.or]: [isCG, 1000000] },
        },
        include: [
          {
            model: db.customergroup,
            as: "customergroup",
            attributes: ["id", "name"],
          },
          {
            model: db.branch,
            as: "branch",
            attributes: ["id", "name"],
          },
        ],
      },
    ],
    order: [["id", "DESC"]],
  });
  // IO.setEmit("visits", await newVisit(req.userId, "visit"));
  res.send(contact);
};

const getOne = async (req, res) => {
  const isCG = await permissionCG(req.userId, "contact");
  const isCustomer = await permissionCustomer(req.userId, "contact");
  const isUser = await permissionUser(req.userId, "contact");
  let id = req.params.id;
  let contact = await Contact.findOne({
    where: [
      { id: id },
      isCustomer.length > 0 && {
        id_customer: { [Op.or]: [isCustomer, 1000000] },
      },
      isUser.length > 0 && { id_user: isUser },
    ],
    include: [
      {
        model: db.users,
        as: "user",
        attributes: ["id", "name", "username", "email", "phone"],
      },
      {
        model: db.customers,
        as: "customer",
        attributes: ["id", "name", "type"],
        where: isCG.length > 0 && {
          id_customergroup: { [Op.or]: [isCG, 1000000] },
        },
        include: [
          {
            model: db.customergroup,
            as: "customergroup",
            attributes: ["id", "name"],
          },
          {
            model: db.branch,
            as: "branch",
            attributes: ["id", "name"],
          },
        ],
      },
    ],
    order: [["id", "DESC"]],
  });
  if (contact) {
    res.status(200).send(contact);
  } else {
    res.status(400).json({
      status: false,
      message: "No data or you don't have access to this document!",
    });
  }
};

const update = async (req, res) => {
  let id = req.params.id;
  const allData = await newContact(req.userId, "contact");
  isResult = allData.filter((item) => item.id == id);

  if (isResult.length > 0) {
    try {
      await db.contact.update(req.body, {
        where: { id: id },
      });
      IO.setEmit("contact", await newContactById(id, req.userId, "contact"));
      res.status(200).json({
        status: true,
        message: "successfully save data",
        data: await newContactById(id, req.userId, "contact"),
      });
    } catch (error) {
      res.status(400).json({
        status: false,
        message: error,
      });
    }
  } else {
    res.status(400).json({
      status: false,
      message: "No data or you don't have access to this document!",
    });
  }
};

const deleteData = async (req, res) => {
  let id = req.params.id;
  const allData = await newContact(req.userId, "contact");
  isResult = allData.filter((item) => item.id == id);
  if (isResult.length > 0) {
    try {
      await db.contact.destroy({
        where: { id: id },
      });
      IO.setEmit("deleteContact", id);

      res.status(200).json({
        status: true,
        message: "successfully delete data",
        data: await newContact(req.userId, "contact"),
      });
    } catch (error) {
      res.status(400).json({
        status: false,
        message: error,
      });
    }
  } else {
    res.status(400).json({
      status: false,
      message: "No data or you don't have access to this document!",
    });
  }
};

const getByCustomer = async (req, res) => {
  let id = req.params.id;
  const isCG = await permissionCG(req.userId, "contact");
  const isCustomer = await permissionCustomer(req.userId, "contact");
  const isUser = await permissionUser(req.userId, "contact");
  const isWhere = [
    { id_customer: id },
    isCustomer.length > 0 && {
      id_customer: { [Op.or]: [isCustomer, 1000000] },
    },
    isUser.length > 0 && { id_user: isUser },
  ];
  let finalWhere = [{ id_customer: id }];
  if (isUser.length > 0 || isCustomer.length > 0) {
    finalWhere = isWhere;
  }
  let contact = await Contact.findAll({
    where: finalWhere,
    include: [
      {
        model: db.users,
        as: "user",
        attributes: ["id", "name", "username", "email", "phone"],
      },
      {
        model: db.customers,
        as: "customer",
        attributes: ["id", "name", "type", "id_customerGroup", "status"],
        where: isCG.length > 0 && {
          id_customergroup: { [Op.or]: [isCG, 1000000] },
        },
        include: [
          {
            model: db.customergroup,
            as: "customergroup",
            attributes: ["id", "name"],
          },
          {
            model: db.branch,
            as: "branch",
            attributes: ["id", "name"],
          },
        ],
      },
    ],
    order: [["id", "DESC"]],
  });
  // IO.setEmit("visits", await newVisit(req.userId, "visit"));
  res.send(contact);
};

module.exports = {
  create,
  getAll,
  getOne,
  update,
  deleteData,
  getByStatus,
  getByCustomer,
};
