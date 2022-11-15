const db = require("../models");
const visit = require("../controllers/visitController");
const callsheet = require("../controllers/callSheetController");

const Notif = db.notif;

const getAll = async (req, res) => {
  const visits = await visit.newVisit(req.userId, "visit");
  const callsheets = await callsheet.newCallSheet(req.userId, "callsheet");
  const nol = [];
  const data = await Notif.findAll({
    include: [
      {
        model: db.users,
        as: "user",
        attributes: ["id", "name", "username", "email", "phone", "img"],
      },
    ],
    order: [["id", "DESC"]],
  });
  let finalData = [];
  if (data.length) {
    cekPermission = data.map((item) => {
      let db;
      switch (item.doc) {
        case "visit":
          db = visits;
          break;
        case "callsheet":
          db = callsheets;
          break;
        default:
          db = nol;
          break;
      }

      let isAccess = [];
      if (db.length > 0) {
        isAccess = db.filter((i) => `${i.id}` === `${item.id_params}`);
      }
      if (isAccess.length > 0) {
        return {
          id: item.id,
          id_user: item.id_user,
          action: item.action,
          doc: item.doc,
          page: item.page,
          id_params: item.id_params,
          remark: item.remark,
          status: item.status,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
          user: item.user,
          doc_params: isAccess[0].name,
        };
      }
    });
    finalData = cekPermission.filter((i) => i !== undefined);
  }
  res.send(finalData);
};

const update = async (req, res) => {
  const update = await Notif.update(req.body, {
    where: { id: req.params.id },
  });
  res.send(update);
};

const deleteByParams = async (req, res) => {
  try {
    const update = await Notif.destroy({
      where: [{ id_params: req.params.id }, { doc: req.params.doc }],
    });

    if (update === 1) {
      IO.setEmit("notif", true);
      res.status(200).json({
        status: true,
        message: "successfully delete data",
        data: update,
      });
    } else {
      res.status(400).json({
        status: false,
        message: error,
      });
    }
  } catch (error) {
    res.status(400).json({
      status: false,
      message: error,
    });
  }
};

module.exports = { getAll, update, deleteByParams };
