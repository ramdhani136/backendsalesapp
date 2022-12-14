const db = require("../models");
const { permissionUser } = require("../middleware/getPermission");
var IO = require("../app");
const { paddy } = require("../utils/paddy");
const { Op } = require("sequelize");
const { schedule, permission } = require("../models");
const moment = require("moment/moment");
const {
  getButtonAction,
  permissionUpdateAction,
} = require("./workflowController");

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
  if (req.body.type.toLowerCase() === "visit") {
    type = "VST";
  } else {
    type = "CST";
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
    let masterNumber = parseInt(lastData.name.substr(9, lastData.name.length));

    isName = "SCH" + type + date + paddy(masterNumber + 1, 5).toString();
  } else {
    isName = "SCH" + type + date + paddy(1, 5).toString();
  }
  let data = {
    name: isName,
    status: "0",
    type: req.body.type,
    id_usergroup: req.body.id_usergroup,
    notes: req.body.notes,
    id_created: req.body.id_created,
    closingDate: req.body.closingDate,
    activeDate: req.body.activeDate,
    workState: "Draft",
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

const UpdateExpired = async () => {
  const now = moment(`${new Date()}`).format("YYYY-MM-DD");
  const exp = await Data.findAll({
    where: [
      {
        closingDate: {
          [Op.lt]: now,
        },
      },
      { status: ["1"] },
    ],
  });

  if (exp.length > 0) {
    for (let item of exp) {
      await Data.update(
        { status: "3", workState: "Closed" },
        {
          where: [{ id: item.dataValues.id }],
        }
      );
    }
  }
};

const getListSchedule = async (id) => {
  const result = await db.listschedule.findAll({
    where: [{ id_schedule: id }],
  });

  if (result.length > 0) {
    let closed = result.filter((item) => {
      return item.dataValues.doc !== null && item.dataValues.doc !== "";
    });
    let open = result.filter((item) => {
      return item.dataValues.doc === null || item.dataValues.doc === "";
    });
    return { open: open.length, closed: closed.length };
  } else {
    return { open: 0, closed: 0 };
  }
};

const getAll = async (req, res) => {
  await UpdateExpired();
  const isUser = await permissionUser(req.userId, "schedule");
  let result = await Data.findAll({
    order: [["id", "DESC"]],
    include: [
      { model: db.users, as: "user", attributes: ["name"] },
      {
        model: db.usergroup,
        as: "usergroup",
        attributes: ["id", "name"],
        include: [
          {
            model: db.listusergroup,
            as: "listusergroup",
            attributes: ["id_user"],
          },
        ],
      },
    ],
  });
  let finalData = [];
  if (result.length > 0) {
    let dataProgses = [];
    for (let ambillist of result) {
      let progress = await getListSchedule(ambillist.dataValues.id);
      dataProgses.push(progress);
      finalData = result.map((item, index) => {
        return { ...item.dataValues, progress: dataProgses[index] };
      });
    }
  }

  let permit = [];
  finalData.map((item) => {
    let inSchedule = item.usergroup.dataValues.listusergroup.find(
      (i) => i.dataValues.id_user == req.userId
    );

    let inPermission = true;

    if (isUser.length > 0) {
      inPermission = isUser.find((data) => data == item.id_created);
    }

    if (inSchedule || item.id_created == req.userId || inPermission) {
      permit.push(item);
    }
  });
  IO.setEmit("schedule", await newData(req.userId, "schedule"));
  res.send(permit);
};

const getOne = async (req, res) => {
  await UpdateExpired();
  const isUser = await permissionUser(req.userId, "schedule");
  let id = req.params.id;
  let response = await Data.findOne({
    where: [{ name: id }],
    include: [
      { model: db.users, as: "user", attributes: ["id", "name"] },
      {
        model: db.usergroup,
        as: "usergroup",
        attributes: ["id", "name"],
        include: [
          {
            model: db.listusergroup,
            as: "listusergroup",
            attributes: ["id_user"],
          },
        ],
      },
    ],
  });

  let inSchedule = response.dataValues.usergroup.dataValues.listusergroup.find(
    (i) => i.dataValues.id_user == req.userId
  );

  let inPermission = true;

  if (isUser.length > 0) {
    inPermission = isUser.find(
      (data) => data == response.dataValues.id_created
    );
  }

  if (response) {
    const buttonaction = await getButtonAction("schedule", response, req);
    response.dataValues.action = buttonaction;
    if (
      inSchedule ||
      inPermission ||
      response.dataValues.id_created == req.userId
    ) {
      res.status(200).send(response);
    } else {
      res.status(300).json({
        status: false,
        message: "Permission Denied!",
      });
    }
  } else {
    res.status(400).json({
      status: false,
      message: "No data!",
    });
  }
};

const update = async (req, res) => {
  let id = req.params.id;
  const isUser = await permissionUser(req.userId, "schedule");
  let response = await Data.findOne({
    where: [{ name: id }],
    include: [
      { model: db.users, as: "user", attributes: ["id", "name"] },
      {
        model: db.usergroup,
        as: "usergroup",
        attributes: ["id", "name"],
        include: [
          {
            model: db.listusergroup,
            as: "listusergroup",
            attributes: ["id_user"],
          },
        ],
      },
    ],
  });

  if (!response) {
    res.status(400).json({ status: false, message: "Data not found" });
    return;
  }

  const { id_workflow, id_state } = req.body;
  if (id_workflow && id_state) {
    const permission = await permissionUpdateAction(
      id_workflow,
      id_state,
      req,
      response
    );
    if (!permission.status) {
      res.status(400).json({
        status: false,
        message: permission.msg,
      });
      return;
    }
    try {
      const data = await Data.update(permission.data, {
        where: [{ name: id }],
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
    return;
  }


  let inPermission = true;

  if (isUser.length > 0) {
    inPermission = isUser.find(
      (data) => data == response.dataValues.id_created
    );
  }
  if (
    inPermission ||
    response.dataValues.id_created == req.userId
  ) {
    await Data.update(req.body, {
      where: [{ name: id }],
    });
    IO.setEmit("schedule", await newData(req.userId, "schedule"));
    res.status(200).json({
      status: true,
      message: "successfully save data",
      data: await newData(req.userId, "schedule"),
    });
    return;
  }

  res.status(300).json({
    status: false,
    message: "You dont have permission!",
  });
};

const deleteData = async (req, res) => {
  const isUser = await permissionUser(req.userId, "schedule");
  let id = req.params.id;
  let response = await Data.findOne({
    where: [{ name: id }],
    include: [
      { model: db.users, as: "user", attributes: ["id", "name"] },
      {
        model: db.usergroup,
        as: "usergroup",
        attributes: ["id", "name"],
        include: [
          {
            model: db.listusergroup,
            as: "listusergroup",
            attributes: ["id_user"],
          },
        ],
      },
    ],
  });

  if (!response) {
    res.status(400).json({ status: false, message: "Data not found" });
    return;
  }
  const type = response.dataValues.type;
  const name = response.dataValues.name;
  let relasiData;
  if (type === "callsheet") {
    relasiData = await db.callsheets.findOne({
      where: [{ schedule: name }, { status: "1" }],
    });
  } else {
    relasiData = await db.visits.findOne({
      where: [{ schedule: name }, { status: "1" }],
    });
  }

  if (relasiData) {
    res.status(400).json({
      status: false,
      message: `Error, ${type} ${relasiData.dataValues.name} must be canceled before deleting this doc `,
    });
    return;
  }


  let inPermission = true;

  if (isUser.length > 0) {
    inPermission = isUser.find(
      (data) => data == response.dataValues.id_created
    );
  }

  if (
    inPermission ||
    response.dataValues.id_created == req.userId
  ) {
    const hapus = await Data.destroy({
      where: [{ name: id }],
    });
    if (hapus > 0) {
      IO.setEmit("schedule", await newData(req.userId, "schedule"));
      res.status(200).json({
        status: true,
        message: "successfully delete data",
        data: await newData(req.userId, "schedule"),
      });
      return;
    }
    res.status(400).json({
      status: false,
      message: "Connection Error!",
    });
    return;
  }
  res.status(300).json({
    status: false,
    message: "You dont have permission!",
  });

};

module.exports = {
  create,
  getAll,
  getOne,
  update,
  deleteData,
  UpdateExpired,
};
