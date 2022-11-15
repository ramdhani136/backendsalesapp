const db = require("../models");
const {
  permissionBranch,
  permissionCG,
  permissionCustomer,
  permissionUser,
} = require("../middleware/getPermission");
var IO = require("../app");
const { paddy } = require("../utils/paddy");
const { Op } = require("sequelize");
const { List } = require("whatsapp-web.js");
const CallSheet = db.callsheets;


const newCallSheetById = async (id, userId, type) => {
  const isBranch = await permissionBranch(userId, type);
  const isCG = await permissionCG(userId, type);
  const isCustomer = await permissionCustomer(userId, type);
  const isUser = await permissionUser(userId, type);
  const isWhere = [
    { id: id },
    isBranch.length > 0 && { id_branch: isBranch },
    isCustomer.length > 0 && { id_customer: isCustomer },
    isUser.length > 0 && { id_user: isUser },
  ];
  let finalWhere = [{ id: id }];
  if (isBranch.length > 0 || isUser.length > 0 || isCustomer.length > 0) {
    finalWhere = isWhere;
  }
  return await CallSheet.findOne({
    where: finalWhere,
    include: [
      {
        model: db.users,
        as: "user",
        attributes: ["id", "name", "img", "username", "email", "phone"],
      },
      {
        model: db.branch,
        as: "branch",
        attributes: ["id", "name"],
      },
      {
        model: db.customers,
        as: "customer",
        attributes: ["id", "name", "type", "id_customerGroup", "status"],
        where: isCG.length > 0 && { id_customerGroup: isCG },
        include: [
          {
            model: db.customergroup,
            as: "customergroup",
            attributes: ["id", "name", "deskripsi", "status"],
          },
        ],
      },
    ],
    order: [["id", "DESC"]],
  });
};

const newCallSheet = async (userId, type) => {
  const isBranch = await permissionBranch(userId, type);
  const isCG = await permissionCG(userId, type);
  const isCustomer = await permissionCustomer(userId, type);
  const isUser = await permissionUser(userId, type);
  const isWhere = [
    isBranch.length > 0 && { id_branch: isBranch },
    isCustomer.length > 0 && { id_customer: isCustomer },
    isUser.length > 0 && { id_user: isUser },
  ];
  let finalWhere = [];
  if (isBranch.length > 0 || isUser.length > 0 || isCustomer.length > 0) {
    finalWhere = isWhere;
  }
  return await CallSheet.findAll({
    where: finalWhere,
    include: [
      {
        model: db.users,
        as: "user",
        attributes: ["id", "name", "img", "username", "email", "phone"],
      },
      {
        model: db.branch,
        as: "branch",
        attributes: ["id", "name"],
      },
      {
        model: db.customers,
        as: "customer",
        attributes: ["id", "name", "type", "id_customerGroup", "status"],
        where: isCG.length > 0 && { id_customerGroup: isCG },
        include: [
          {
            model: db.customergroup,
            as: "customergroup",
            attributes: ["id", "name", "deskripsi", "status"],
          },
        ],
      },
    ],
    order: [["id", "DESC"]],
  });
};

const create = async (req, res) => {
  const date =
    new Date().getFullYear().toString() +
    paddy(new Date().getMonth() + 1, 2).toString();
  const lastVisit = await db.callsheets.findOne({
    where: { name: { [Op.like]: `%${paddy(req.body.id_branch, 3)}${date}%` } },
    order: [["name", "DESC"]],
  });

  let isName = "";
  if (lastVisit) {
    let masterNumber = parseInt(
      lastVisit.name.substr(9, lastVisit.name.length)
    );

    isName =
      "CST" +
      paddy(req.body.id_branch, 3) +
      date +
      paddy(masterNumber + 1, 5).toString();
  } else {
    isName =
      "CST" + paddy(req.body.id_branch, 3) + date + paddy(1, 5).toString();
  }
  let data = {
    name: isName,
    id_customer: req.body.id_customer,
    pic: req.body.pic,
    phone: req.body.phone,
    priceNote: req.body.priceNote,
    remindOrderNote: req.body.remindOrderNote,
    billingNote: req.body.billingNote,
    compInformNote: req.body.compInformNote,
    deliveryNote: req.body.deliveryNote,
    id_user: req.body.id_user,
    id_branch: req.body.id_branch,
    callType: req.body.callType,
    status: req.body.status,
    newCustomer: req.body.newCustomer,
    manualCustomer: req.body.manualCustomer,
  };
  try {
    let callsheet = await CallSheet.create(data);
    const setNotif = await db.notif.create({
      id_user: req.userId,
      action: "post",
      doc: "callsheet",
      page: "callsheet",
      id_params: callsheet.id,
      remark: "",
      status: 0,
    });

    if (setNotif) {
      IO.setEmit("notif", true);
    }
    IO.setEmit(
      "callsheets",
      await newCallSheetById(callsheet.id, req.userId, "callsheet")
    );
    IO.setEmit("allCallsheet", await newCallSheet(req.userId, "callsheet"));

    res.status(200).json({
      status: true,
      message: "successfully save data",
      data: await newCallSheetById(callsheet.id, req.userId, "callsheet"),
    });
  } catch (error) {
    res.status(400).json({ status: false, message: error });
  }
};

const getAllCallSheet = async (req, res) => {
  const isBranch = await permissionBranch(req.userId, "callsheet");
  const isCG = await permissionCG(req.userId, "callsheet");
  const isCustomer = await permissionCustomer(req.userId, "callsheet");
  const isUser = await permissionUser(req.userId, "callsheet");
  const isWhere = [
    isBranch.length > 0 && { id_branch: isBranch },
    isCustomer.length > 0 && { id_customer: isCustomer },
    isUser.length > 0 && { id_user: isUser },
  ];
  let finalWhere = [];
  if (isBranch.length > 0 || isUser.length > 0 || isCustomer.length > 0) {
    finalWhere = isWhere;
  }
  let callsheets = await CallSheet.findAll({
    where: finalWhere,
    include: [
      {
        model: db.users,
        as: "user",
        attributes: ["id", "name", "img", "username", "email", "phone"],
      },
      {
        model: db.branch,
        as: "branch",
        attributes: ["id", "name"],
      },
      {
        model: db.customers,
        as: "customer",
        attributes: ["id", "name", "type", "id_customerGroup", "status"],
        where: isCG.length > 0 && { id_customerGroup: isCG },
        include: [
          {
            model: db.customergroup,
            as: "customergroup",
            attributes: ["id", "name", "deskripsi", "status"],
          },
        ],
      },
    ],
    order: [["id", "DESC"]],
  });
  // IO.setEmit("callsheets", await newCallSheet(req.userId, "callsheet"));
  res.send(callsheets);
};

const getByStatus = async (req, res) => {
  let status = req.params.status;
  const isBranch = await permissionBranch(req.userId, "callsheet");
  const isCG = await permissionCG(req.userId, "callsheet");
  const isCustomer = await permissionCustomer(req.userId, "callsheet");
  const isUser = await permissionUser(req.userId, "callsheet");
  const isWhere = [
    { status: status },
    isBranch.length > 0 && { id_branch: { [Op.or]: [isBranch, 1000000] } },
    isCustomer.length > 0 && {
      id_customer: { [Op.or]: [isCustomer, 1000000] },
    },
    isUser.length > 0 && { id_user: isUser },
  ];
  let finalWhere = [{ status: status }];
  if (isBranch.length > 0 || isUser.length > 0 || isCustomer.length > 0) {
    finalWhere = isWhere;
  }
  let callsheets = await CallSheet.findAll({
    where: finalWhere,
    include: [
      {
        model: db.users,
        as: "user",
        attributes: ["id", "name", "img", "username", "email", "phone"],
      },
      {
        model: db.branch,
        as: "branch",
        attributes: ["id", "name"],
      },
      {
        model: db.customers,
        as: "customer",
        attributes: ["id", "name", "type", "id_customerGroup", "status"],
        where: isCG.length > 0 && { id_customerGroup: isCG },
        include: [
          {
            model: db.customergroup,
            as: "customergroup",
            attributes: ["id", "name", "deskripsi", "status"],
          },
        ],
      },
    ],
    order: [["id", "DESC"]],
  });
  // IO.setEmit("callsheets", await newCallSheet(req.userId, "callsheet"));
  res.send(callsheets);
};

const getOneCallSheet = async (req, res) => {
  const isBranch = await permissionBranch(req.userId, "callsheet");
  const isCG = await permissionCG(req.userId, "callsheet");
  const isCustomer = await permissionCustomer(req.userId, "callsheet");
  const isUser = await permissionUser(req.userId, "callsheet");
  let id = req.params.id;
  let callsheets = await CallSheet.findOne({
    where: [
      { id: id },
      isBranch.length > 0 && { id_branch: { [Op.or]: [isBranch, 1000000] } },
      isCustomer.length > 0 && {
        id_customer: { [Op.or]: [isCustomer, 1000000] },
      },
      isUser.length > 0 && { id_user: isUser },
    ],
    include: [
      {
        model: db.users,
        as: "user",
        attributes: ["id", "name", "img", "username", "email", "phone"],
      },
      {
        model: db.branch,
        as: "branch",
        attributes: ["id", "name"],
      },
      {
        model: db.customers,
        as: "customer",
        attributes: ["id", "name", "type", "id_customerGroup", "status"],
        where: isCG.length > 0 && { id_customerGroup: isCG },
        include: [
          {
            model: db.customergroup,
            as: "customergroup",
            attributes: ["id", "name", "deskripsi", "status"],
          },
        ],
      },
    ],
    order: [["id", "DESC"]],
  });
  if (callsheets) {
    res.status(200).send(callsheets);
  } else {
    res.status(400).json({
      status: false,
      message: "No data or you don't have access to this document!",
    });
  }
};

const updateCallSheet = async (req, res) => {
  let id = req.params.id;
  const allData = await newCallSheet(req.userId, "callsheet");
  isResult = allData.filter((item) => item.id == id);
  if (isResult.length > 0) {
    try {
      await CallSheet.update(req.body, {
        where: { id: id },
      });
      IO.setEmit(
        "callsheets",
        await newCallSheetById(id, req.userId, "callsheet")
      );
      IO.setEmit("allCallsheet", await newCallSheet(req.userId, "callsheet"));
      if (
        isResult[0].isSurvey === "0" &&
        isResult[0].status === "0" &&
        req.body.status === "1"
      ) {
        var myModul = await require("../utils/waBot");

        const message = `Halo perkenalkan saya Vika (bot system) dari Pt. Ekatunggal 🙏
      Mohon berikan rating dari Bapak/Ibu tentang komunikasi
      yang sudah dilakukan oleh tim sales kami.
      dari skala (tidak baik) 1-5 (sangat baik)
      `;

        let sections = [
          {
            title: "Silahkan berikan penilaian :)",
            rows: [
              {
                title: `#${isResult[0].name}_1`,
                description: "⭐",
              },
              {
                title: `#${isResult[0].name}_2`,
                description: "⭐⭐",
              },
              {
                title: `#${isResult[0].name}_3`,
                description: "⭐⭐⭐",
              },
              {
                title: `#${isResult[0].name}_4`,
                description: "⭐⭐⭐⭐",
              },
              {
                title: `#${isResult[0].name}_5`,
                description: "⭐⭐⭐⭐⭐",
              },
            ],
          },
        ];
        let list = new List(
          message,
          "Rate",
          sections,
          `${isResult[0].name}`,
          "footer"
        );
        const send = await myModul.kirimpesan(
          isResult[0].phone,
          // isResult[0].name
          list
        );

        if (send) {
          await db.callsheets.update(
            { isSurvey: "1" },
            {
              where: { id: id },
            }
          );
        } else {
          await db.callsheets.update(
            { isSurvey: "2" },
            {
              where: { id: id },
            }
          );
        }
      }
      const setNotif = await db.notif.create({
        id_user: req.userId,
        action: "put",
        doc: "callsheet",
        page: "callsheet",
        id_params: id,
        remark: "",
        status: 0,
      });

      if (setNotif) {
        IO.setEmit("notif", true);
      }
      res.status(200).json({
        status: true,
        message: "successfully update data",
        data: await newCallSheetById(id, req.userId, "callsheet"),
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

const deleteCallSheet = async (req, res) => {
  let id = req.params.id;
  const allData = await newCallSheet(req.userId, "callsheet");
  isResult = allData.filter((item) => item.id == id);
  if (isResult.length > 0) {
    try {
      await CallSheet.destroy({
        where: { id: id },
      });
      const setNotif = await db.notif.create({
        id_user: req.userId,
        action: "put",
        doc: "callsheet",
        page: "callsheet",
        id_params: id,
        remark: "",
        status: 0,
      });

      if (setNotif) {
        IO.setEmit("notif", true);
      }
      IO.setEmit("deleteCallsheet", id);
      IO.setEmit("allCallsheet", await newCallSheet(req.userId, "callsheet"));

      res.status(200).json({
        status: true,
        message: "successfully delete data",
        data: await newCallSheet(req.userId, "callsheet"),
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

const getByName = async (req, res) => {
  const isBranch = await permissionBranch(req.userId, "callsheet");
  const isCG = await permissionCG(req.userId, "callsheet");
  const isCustomer = await permissionCustomer(req.userId, "callsheet");
  const isUser = await permissionUser(req.userId, "callsheet");
  let name = req.params.name;
  let callsheets = await CallSheet.findOne({
    where: [
      { name: name },
      isBranch.length > 0 && { id_branch: { [Op.or]: [isBranch, 1000000] } },
      isCustomer.length > 0 && {
        id_customer: { [Op.or]: [isCustomer, 1000000] },
      },
      isUser.length > 0 && { id_user: isUser },
    ],
    include: [
      {
        model: db.users,
        as: "user",
        attributes: ["id", "name", "img", "username", "email", "phone"],
      },
      {
        model: db.branch,
        as: "branch",
        attributes: ["id", "name"],
      },
      {
        model: db.customers,
        as: "customer",
        attributes: ["id", "name", "type", "id_customerGroup", "status"],
        where: isCG.length > 0 && { id_customerGroup: isCG },
        include: [
          {
            model: db.customergroup,
            as: "customergroup",
            attributes: ["id", "name", "deskripsi", "status"],
          },
        ],
      },
    ],
    order: [["id", "DESC"]],
  });
  if (callsheets) {
    res.status(200).send(callsheets);
  } else {
    res.status(400).json({
      status: false,
      message: "No data or you don't have access to this document!",
    });
  }
};

const getByUser = async (req, res) => {
  const isBranch = await permissionBranch(req.userId, "callsheet");
  const isCG = await permissionCG(req.userId, "callsheet");
  const isCustomer = await permissionCustomer(req.userId, "callsheet");
  const isUser = await permissionUser(req.userId, "callsheet");
  let id = req.params.id;
  let callsheets = await CallSheet.findAll({
    where: [
      { id_user: id },
      isBranch.length > 0 && { id_branch: { [Op.or]: [isBranch, 1000000] } },
      isCustomer.length > 0 && {
        id_customer: { [Op.or]: [isCustomer, 1000000] },
      },
      isUser.length > 0 && { id_user: isUser },
    ],
    include: [
      {
        model: db.users,
        as: "user",
        attributes: ["id", "name", "img", "username", "email", "phone"],
      },
      {
        model: db.branch,
        as: "branch",
        attributes: ["id", "name"],
      },
      {
        model: db.customers,
        as: "customer",
        attributes: ["id", "name", "type", "id_customerGroup", "status"],
        where: isCG.length > 0 && { id_customerGroup: isCG },
        include: [
          {
            model: db.customergroup,
            as: "customergroup",
            attributes: ["id", "name", "deskripsi", "status"],
          },
        ],
      },
    ],
    order: [["id", "DESC"]],
  });
  if (callsheets) {
    res.status(200).send(callsheets);
  } else {
    res.status(400).json({
      status: false,
      message: "No data or you don't have access to this document!",
    });
  }
};

module.exports = {
  create,
  getAllCallSheet,
  getOneCallSheet,
  updateCallSheet,
  deleteCallSheet,
  getByStatus,
  getByName,
  getByUser,
  newCallSheet,
};
