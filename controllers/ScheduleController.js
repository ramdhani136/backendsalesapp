const db = require("../models");
const { permissionUser } = require("../middleware/getPermission");
var IO = require("../app");
const { paddy } = require("../utils/paddy");
const { Op } = require("sequelize");

const Data = db.schedule;

const newData = async (userId, type) => {
  const isUser = await permissionUser(userId, type);
  const isWhere = [isUser.length > 0 && { id_created: isUser }];
  let finalWhere = [];
  if (isUser.length > 0) {
    finalWhere = isWhere;
  }
  return await Data.findAll({
    where: finalWhere,
    order: [["id", "DESC"]],
    include: [
      { model: db.users, as: "user", attributes: ["id", "name"] },
      { model: db.usergroup, as: "usergroup", attributes: ["id", "name"] },
    ],
  });
};

const create = async (req, res) => {

  let type = "VST";
  if(req.body.type==="visit"){
    type="VST";
  }else{
    type="CST"
  }

  const date =
  new Date().getFullYear().toString() +
  paddy(new Date().getMonth() + 1, 2).toString();
const lastData = await db.schedule.findOne({
  where: { name: { [Op.like]: `%${type}${date}%` } },
  order: [["name", "DESC"]],
});

let isName = "";
if (lastData) {
  let masterNumber = parseInt(
    lastData.name.substr(9, lastData.name.length)
  );

  isName =
   "SCH" + type +
    date +
    paddy(masterNumber + 1, 5).toString();
} else {
  isName =
    "SCH" + type + date + paddy(1, 5).toString();
}
  let data = {
    name: isName,
    status: "Draft",
    type:req.body.type,
    id_usergroup:req.body.id_usergroup,
    notes:req.body.notes,
    id_created: req.body.id_created,
    closingDate: req.body.closingDate,
  };

  try {
    const response = await Data.create(data);
    IO.setEmit("schedule", await newData(req.userId, "schedule"));
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
  const isUser = await permissionUser(req.userId, "schedule");
  const isWhere = [isUser.length > 0 && { id_created: isUser }];
  let finalWhere = [];
  if (isUser.length > 0) {
    finalWhere = isWhere;
  }
  let result = await Data.findAll({
    where: finalWhere,
    order: [["id", "DESC"]],
    include: [
      { model: db.users, as: "user", attributes: ["id", "name"] },
      { model: db.usergroup, as: "usergroup", attributes: ["id", "name"] },
    ],
  });
  IO.setEmit("schedule", await newData(req.userId, "schedule"));
  res.send(result);
};

const getOne = async (req, res) => {
  const isUser = await permissionUser(req.userId, "schedule");
  let id = req.params.id;
  let response = await Data.findOne({
    where: [{ id: id }, isUser.length > 0 && { id_created: isUser }],
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
  const isUser = await permissionUser(req.userId, "schedule");
  let id = req.params.id;
  try {
    const data = await Data.update(req.body, {
      where: [{ id: id }, isUser.length > 0 && { id_created: isUser }],
    });
    if (data > 0) {
      IO.setEmit("schedule", await newData(req.userId, "schedule"));
      res.status(200).json({
        status: true,
        message: "successfully save data",
        data: await newData(req.userId, "schedule"),
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
  const isUser = await permissionUser(req.userId, "schedule");
  let id = req.params.id;
  try {
    const hapus = await Data.destroy({
      where: [{ id: id }, isUser.length > 0 && { id_created: isUser }],
    });
    if (hapus > 0) {
      IO.setEmit("schedule", await newData(req.userId, "schedule"));
      res.status(200).json({
        status: true,
        message: "successfully delete data",
        data: await newData(req.userId, "schedule"),
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