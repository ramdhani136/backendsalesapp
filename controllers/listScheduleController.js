const db = require("../models");
var IO = require("../app");
const { Op } = require("sequelize");
const { UpdateExpired } = require("./ScheduleController");
const moment = require("moment/moment");
const Data = db.listschedule;

const newData = async () => {
  return await Data.findAll({
    order: [["id", "DESC"]],
    include: [
      { model: db.customers, as: "customer", attributes: ["id", "name"] },
      { model: db.schedule, as: "schedule", attributes: ["id", "name"] },
    ],
  });
};

const create = async (req, res) => {
  let data = {
    id_customer: req.body.id_customer,
    id_schedule: req.body.id_schedule,
    type: req.body.type,
    doc: req.body.doc,
  };

  try {
    const response = await Data.create(data);
    IO.setEmit("listSchedule", await newData());
    res.status(200).json({
      status: true,
      message: "successfully save data",
      data: response,
    });
  } catch (error) {
    res.status(400).json({ status: false, message: error.errors[0].message });
  }
};

const getBySchedule = async (req, res) => {
  let result = await Data.findAll({
    where: [{ id_schedule: req.params.id }],
    order: [["id", "DESC"]],
    include: [
      {
        model: db.customers,
        as: "customer",
        attributes: ["id", "name"],
        include: [
          {
            model: db.customergroup,
            as: "customergroup",
            attributes: ["id", "name", "deskripsi", "status"],
          },
        ],
      },
      { model: db.schedule, as: "schedule", attributes: ["id", "name"] },
    ],
  });
  let final = result.map(async (item) => {
    let doc = item.dataValues.doc;
    let type = item.dataValues.type;
    let docref;
    if (doc !== null && doc !== "") {
      if (type === "visit") {
        docref = await db.visits.findOne({
          where: [{ name: `${doc}` }],
          include: [
            {
              model: db.users,
              as: "user",
              attributes: ["id", "name"],
            },
          ],
        });
      } else {
        docref = await db.callsheets.findOne({
          where: [{ name: `${doc}` }],
          include: [
            {
              model: db.users,
              as: "user",
              attributes: ["id", "name"],
            },
          ],
        });
      }
    }

    return {
      id: item.dataValues.id,
      id_customer: item.dataValues.id_customer,
      customer: item.dataValues.customer,
      schedule: item.dataValues.schedule.name,
      id_schedule: item.dataValues.id_schedule,
      doc: item.dataValues.doc ? item.dataValues.doc : "",
      type: item.dataValues.type,
      createdAt: item.dataValues.createdAt,
      updatedAt: item.dataValues.updatedAt,
      closeAt: docref ? docref.dataValues.updatedAt : "",
      user: docref ? docref.dataValues.user.name : "",
      priceNote: docref ? docref.dataValues.priceNote : "",
      remindOrderNote: docref ? docref.dataValues.remindOrderNote : "",
      billingNote: docref ? docref.dataValues.billingNote : "",
      compInformNote: docref ? docref.dataValues.compInformNote : "",
      status: item.dataValues.doc ? "Closed" : "Open",
    };
  });
  let finaldata = [];
  for (let x in final) {
    finaldata.push(await final[x]);
  }
  IO.setEmit("listSchedule", await newData());
  res.status(200).json({
    data: finaldata,
  });
};

const getAll = async (req, res) => {
  let result = await Data.findAll({
    order: [["id", "DESC"]],
    include: [
      {
        model: db.customers,
        as: "customer",
        attributes: ["id", "name"],
        include: [
          {
            model: db.customergroup,
            as: "customergroup",
            attributes: ["id", "name", "deskripsi", "status"],
          },
        ],
      },
      {
        model: db.schedule,
        as: "schedule",
        attributes: [
          "id",
          "name",
          "activeDate",
          "closingDate",
          "workState",
          "notes",
        ],
         include: [
      { model: db.users, as: "user", attributes: ["id", "name"] },
      { model: db.usergroup, as: "usergroup", attributes: ["id", "name"] },
    ],
      },
    ],
  });
  let final = result.map(async (item) => {
    let doc = item.dataValues.doc;
    let type = item.dataValues.type;
    let docref;
    if (doc !== null && doc !== "") {
      if (type === "visit") {
        docref = await db.visits.findOne({
          where: [{ name: `${doc}` }],
          include: [
            {
              model: db.users,
              as: "user",
              attributes: ["id", "name"],
            },
          ],
        });
      } else {
        docref = await db.callsheets.findOne({
          where: [{ name: `${doc}` }],
          include: [
            {
              model: db.users,
              as: "user",
              attributes: ["id", "name"],
            },
          ],
        });
      }
    }

    return {
      id: item.dataValues.id,
      id_customer: item.dataValues.id_customer,
      customer: item.dataValues.customer,
      schedule: item.dataValues.schedule,
      id_schedule: item.dataValues.id_schedule,
      doc: item.dataValues.doc ? item.dataValues.doc : "",
      type: item.dataValues.type,
      createdAt: item.dataValues.createdAt,
      updatedAt: item.dataValues.updatedAt,
      closeAt: docref ? docref.dataValues.updatedAt : "",
      user: docref ? docref.dataValues.user.name : "",
      priceNote: docref ? docref.dataValues.priceNote : "",
      remindOrderNote: docref ? docref.dataValues.remindOrderNote : "",
      billingNote: docref ? docref.dataValues.billingNote : "",
      compInformNote: docref ? docref.dataValues.compInformNote : "",
      status: item.dataValues.doc ? "Closed" : "Open",
    };
  });
  let finaldata = [];
  for (let x in final) {
    finaldata.push(await final[x]);
  }
  IO.setEmit("listSchedule", await newData());
  res.status(200).json({
    data: finaldata,
  });
};

// const getAll = async (req, res) => {
//   await UpdateExpired();
//   let result = await Data.findAll({
//     where: [{ doc: { [Op.or]: [null, ""] } }],
//     order: [["id", "DESC"]],
//     include: [
//       {
//         model: db.customers,
//         as: "customer",
//         attributes: ["id", "name"],
//         include: [
//           {
//             model: db.customergroup,
//             as: "customergroup",
//             attributes: ["id", "name", "deskripsi", "status"],
//           },
//         ],
//       },
//       {
//         model: db.schedule,
//         as: "schedule",
//         attributes: ["id", "name", "status"],
//       },
//     ],
//   });

//   const filterActive = result.filter(
//     (item) => item.dataValues.schedule.status === "1"
//   );
//   let final = filterActive.map(async (item) => {
//     let doc = item.dataValues.doc;
//     let type = item.dataValues.type;
//     let docref;
//     if (doc !== null && doc !== "") {
//       if (type === "visit") {
//         docref = await db.visits.findOne({
//           where: [{ name: `${doc}` }],
//           include: [
//             {
//               model: db.users,
//               as: "user",
//               attributes: ["id", "name"],
//             },
//           ],
//         });
//       } else {
//         docref = await db.callsheets.findOne({
//           where: [{ name: `${doc}` }],
//           include: [
//             {
//               model: db.users,
//               as: "user",
//               attributes: ["id", "name"],
//             },
//           ],
//         });
//       }
//     }

//     let scheduleClose = await db.schedule.findOne({
//       where: [{ id: item.dataValues.id_schedule }],
//     });

//     return {
//       id: item.dataValues.id,
//       id_customer: item.dataValues.id_customer,
//       customer: item.dataValues.customer,
//       schedule: item.dataValues.schedule.name,
//       id_schedule: item.dataValues.id_schedule,
//       doc: item.dataValues.doc ? item.dataValues.doc : "",
//       type: item.dataValues.type,
//       createdAt: item.dataValues.createdAt,
//       updatedAt: item.dataValues.closingDate,
//       closeAt: docref ? docref.dataValues.updatedAt : "",
//       user: docref ? docref.dataValues.user.name : "",
//       status: item.dataValues.doc ? "Closed" : "Open",
//       scheduleClose: scheduleClose.dataValues.closingDate,
//     };
//   });
//   let finaldata = [];
//   for (let x in final) {
//     finaldata.push(await final[x]);
//   }
//   IO.setEmit("listSchedule", await newData());
//   res.status(200).json({
//     data: finaldata,
//   });
// };

const getByType = async (req, res) => {
  const now = moment(`${new Date()}`).format("YYYY-MM-DD");
  await UpdateExpired();
  const type = req.params.type;
  let result = await Data.findAll({
    where: [{ doc: { [Op.or]: [null, ""] } }, { type: type }],
    order: [["id", "DESC"]],
    include: [
      {
        model: db.customers,
        as: "customer",
        attributes: ["id", "name"],
        include: [
          {
            model: db.customergroup,
            as: "customergroup",
            attributes: ["id", "name", "deskripsi", "status"],
          },
        ],
      },
      {
        model: db.schedule,
        as: "schedule",
        attributes: ["id", "name", "status"],
        where: [
          {
            activeDate: {
              [Op.lte]: now,
            },
          },
        ],
        include: [
          {
            model: db.usergroup,
            as: "usergroup",
            attributes: ["name"],
            include: [
              {
                model: db.listusergroup,
                as: "listusergroup",
                attributes: ["id_user"],

                include: [
                  {
                    model: db.users,
                    as: "user",
                    attributes: ["name"],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  });

  const filterActive = result.filter((item) => {
    let ada =
      item.dataValues.schedule.dataValues.usergroup.dataValues.listusergroup.find(
        (a) => a.dataValues.id_user.toString() === req.userId.toString()
      );
    return item.dataValues.schedule.status === "1" && ada;
  });
  let final = filterActive.map(async (item) => {
    let doc = item.dataValues.doc;
    let type = item.dataValues.type;
    let docref;
    if (doc !== null && doc !== "") {
      if (type === "visit") {
        docref = await db.visits.findOne({
          where: [{ name: `${doc}` }],
          include: [
            {
              model: db.users,
              as: "user",
              attributes: ["id", "name"],
            },
          ],
        });
      } else {
        docref = await db.callsheets.findOne({
          where: [{ name: `${doc}` }],
          include: [
            {
              model: db.users,
              as: "user",
              attributes: ["id", "name"],
            },
          ],
        });
      }
    }

    let scheduleClose = await db.schedule.findOne({
      where: [{ id: item.dataValues.id_schedule }],
    });

    return {
      id: item.dataValues.id,
      id_customer: item.dataValues.id_customer,
      customer: item.dataValues.customer,
      schedule: item.dataValues.schedule.name,
      id_schedule: item.dataValues.id_schedule,
      doc: item.dataValues.doc ? item.dataValues.doc : "",
      type: item.dataValues.type,
      createdAt: item.dataValues.createdAt,
      updatedAt: item.dataValues.closingDate,
      closeAt: docref ? docref.dataValues.updatedAt : "",
      user: docref ? docref.dataValues.user.name : "",
      status: item.dataValues.doc ? "Closed" : "Open",
      scheduleClose: scheduleClose.dataValues.closingDate,
    };
  });
  let finaldata = [];
  for (let x in final) {
    finaldata.push(await final[x]);
  }
  IO.setEmit("listSchedule", await newData());
  res.status(200).json({
    data: finaldata,
  });
};

const getOne = async (req, res) => {
  let id = req.params.id;
  let response = await Data.findOne({
    where: [{ id: id }],
    include: [
      { model: db.customers, as: "customer", attributes: ["id", "name"] },
      { model: db.schedule, as: "schedule", attributes: ["id", "name"] },
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
    const data = await Data.update(req.body, {
      where: [{ id: id }],
    });
    if (data > 0) {
      IO.setEmit("listSchedule", await newData());
      res.status(200).json({
        status: true,
        message: "successfully save data",
        data: await newData(),
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
  const getList = await Data.findOne({ where: [{ id: id }] });
  if (!getList) {
    res.status(400).json({
      status: false,
      message: `Data not found`,
    });
    return;
  }
  const type = getList.dataValues.type;
  const doc = getList.dataValues.doc;

  let relasiData;
  if (type === "callsheet") {
    relasiData = await db.callsheets.findOne({
      where: [{ name: doc }, { status: "1" }],
    });
  } else {
    relasiData = await db.visits.findOne({
      where: [{ name: doc }, { status: "1" }],
    });
  }

  if (relasiData) {
    res.status(400).json({
      status: false,
      message: `Failed, ${type} ${doc} must be canceled before deleting this doc`,
    });
    return;
  }

  try {
    const hapus = await Data.destroy({
      where: [{ id: id }],
    });
    if (hapus > 0) {
      IO.setEmit("listSchedule", await newData());
      res.status(200).json({
        status: true,
        message: "successfully delete data",
        data: await newData(),
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
  getBySchedule,
  getByType,
};
