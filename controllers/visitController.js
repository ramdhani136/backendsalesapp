const db = require("../models");
const sharp = require("sharp");
const path = require("path");
const {
  permissionBranch,
  permissionCG,
  permissionCustomer,
  permissionUser,
} = require("../middleware/getPermission");
const { Op } = require("sequelize");
const { paddy } = require("../utils/paddy");
var IO = require("../app");
const fs = require("fs");
const cekData = require("../utils/cenData");
const { List } = require("whatsapp-web.js");
const { notif } = require("../models");
const {
  getButtonAction,
  permissionUpdateAction,
} = require("./workflowController");
const { UpdateExpired } = require("./ScheduleController");
const { Result } = require("express-validator");

const GetFilter = require("../utils/getFilter");

const Visits = db.visits;

const newVisitById = async (id, userId, type) => {
  const isBranch = await permissionBranch(userId, type);
  const isCG = await permissionCG(userId, type);
  const isCustomer = await permissionCustomer(userId, type);
  const isUser = await permissionUser(userId, type);
  const isWhere = [
    { id: id },
    isBranch.length > 0 && { id_branch: { [Op.or]: [isBranch, 1000000] } },
    isCustomer.length > 0 && {
      id_customer: { [Op.or]: [isCustomer, 1000000] },
    },
    isUser.length > 0 && { id_user: isUser },
  ];
  let finalWhere = [{ id: id }];
  if (isBranch.length > 0 || isUser.length > 0 || isCustomer.length > 0) {
    finalWhere = isWhere;
  }
  return await Visits.findOne({
    where: finalWhere,
    include: [
      {
        model: db.users,
        as: "user",
        attributes: ["id", "img", "name", "img", "username", "email", "phone"],
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
        where: isCG.length > 0 && {
          id_customergroup: { [Op.or]: [isCG, 1000000] },
        },
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

const newVisit = async (userId, type) => {
  const isBranch = await permissionBranch(userId, type);
  const isCG = await permissionCG(userId, type);
  const isCustomer = await permissionCustomer(userId, type);
  const isUser = await permissionUser(userId, type);
  const isWhere = [
    isBranch.length > 0 && { id_branch: { [Op.or]: [isBranch, 1000000] } },
    isCustomer.length > 0 && {
      id_customer: { [Op.or]: [isCustomer, 1000000] },
    },
    isUser.length > 0 && { id_user: isUser },
  ];
  let finalWhere = [];
  if (isBranch.length > 0 || isUser.length > 0 || isCustomer.length > 0) {
    finalWhere = isWhere;
  }
  return await Visits.findAll({
    where: finalWhere,
    include: [
      {
        model: db.users,
        as: "user",
        attributes: ["id", "img", "name", "username", "email", "phone"],
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
        where: isCG.length > 0 && {
          id_customergroup: { [Op.or]: [isCG, 1000000] },
        },
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
  const lastVisit = await db.visits.findOne({
    where: { name: { [Op.like]: `%${paddy(req.body.id_branch, 3)}${date}%` } },
    order: [["name", "DESC"]],
  });

  let isName = "";
  if (lastVisit) {
    let masterNumber = parseInt(
      lastVisit.name.substr(9, lastVisit.name.length)
    );

    isName =
      "VST" +
      paddy(req.body.id_branch, 3) +
      date +
      paddy(masterNumber + 1, 5).toString();
  } else {
    isName =
      "VST" + paddy(req.body.id_branch, 3) + date + paddy(1, 5).toString();
  }

  let data = await {
    name: isName,
    id_customer: req.body.id_customer,
    address: req.body.address,
    pic: req.body.pic,
    phone: req.body.phone,
    priceNote: req.body.priceNote,
    remindOrderNote: req.body.remindOrderNote,
    billingNote: req.body.billingNote,
    compInformNote: req.body.compInformNote,
    img: isName + ".jpg",
    signature: req.body.signature,
    lat: req.body.lat,
    lng: req.body.lng,
    id_user: req.body.id_user,
    id_branch: req.body.id_branch,
    status: req.body.status,
    newCustomer: req.body.newCustomer,
    manualCustomer: req.body.manualCustomer,
    schedule: req.body.schedule,
    id_listSchedule: req.body.id_listSchedule,
    workState: "Draft",
  };
  if (req.file != undefined) {
    try {
      const visits = await Visits.create(data);
      const compressedImage = await path.join(
        __dirname,
        "../public/images",
        isName + ".jpg"
      );
      await sharp(req.file.path)
        .resize(640, 480, {
          fit: sharp.fit.inside,
          withoutEnlargement: true,
        })
        .jpeg({
          quality: 100,
          progressive: true,
          chromaSubsampling: "4:4:4",
        })
        .withMetadata()
        .toFile(compressedImage, (err, info) => {
          if (err) {
            console.log(err);
          } else {
            console.log(info);
          }
        });

      const isCG = await permissionCG(req.userId, "visit");

      let thisData = await Visits.findOne({
        where: [{ id: visits.id }],
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
            attributes: ["id", "name", "type"],
            where: isCG.length > 0 && {
              id_customergroup: { [Op.or]: [isCG, 1000000] },
            },
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
      IO.setEmit("visits", await newVisitById(visits.id, req.userId, "visit"));

      const setNotif = await notif.create({
        id_user: req.userId,
        action: "post",
        doc: "visit",
        page: "visit",
        id_params: visits.id,
        remark: "",
        status: 0,
      });

      if (setNotif) {
        IO.setEmit("notif", true);
      }

      res.status(200).json({
        status: true,
        message: "successfully save data",
        data: thisData,
      });
    } catch (error) {
      console.log(error);
      res
        .status(400)
        .json({ status: false, message: `${error.table} is required` });
    }
  } else {
    res
      .status(400)
      .json({ status: false, message: "Please snap your images!" });
  }
};

const getAllVisit = async (req, res) => {
  const isBranch = await permissionBranch(req.userId, "visit");
  const isCG = await permissionCG(req.userId, "visit");
  const isCustomer = await permissionCustomer(req.userId, "visit");
  const isUser = await permissionUser(req.userId, "visit");
  const isWhere = [
    isBranch.length > 0 && { id_branch: { [Op.or]: [isBranch, 1000000] } },
    isCustomer.length > 0 && {
      id_customer: { [Op.or]: [isCustomer, 1000000] },
    },
    isUser.length > 0 && { id_user: isUser },
  ];
  let finalWhere = [];
  if (isBranch.length > 0 || isUser.length > 0 || isCustomer.length > 0) {
    finalWhere = isWhere;
  }
  let visits = await Visits.findAll({
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
        where: isCG.length > 0 && {
          id_customergroup: { [Op.or]: [isCG, 1000000] },
        },
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

  res.send(visits);
};

const getByStatus = async (req, res) => {
  let status = req.params.status;
  const isBranch = await permissionBranch(req.userId, "visit");
  const isCG = await permissionCG(req.userId, "visit");
  const isCustomer = await permissionCustomer(req.userId, "visit");
  const isUser = await permissionUser(req.userId, "visit");
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
  let visits = await Visits.findAll({
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
        where: isCG.length > 0 && {
          id_customergroup: { [Op.or]: [isCG, 1000000] },
        },
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
  // IO.setEmit("visits", await newVisit(req.userId, "visit"));
  res.send(visits);
};

const getOneVisit = async (req, res) => {
  const isBranch = await permissionBranch(req.userId, "visit");
  const isCG = await permissionCG(req.userId, "visit");
  const isCustomer = await permissionCustomer(req.userId, "visit");
  const isUser = await permissionUser(req.userId, "visit");
  let id = req.params.id;
  let visits = await Visits.findOne({
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
        attributes: ["id", "name", "type"],
        where: isCG.length > 0 && {
          id_customergroup: { [Op.or]: [isCG, 1000000] },
        },
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
  if (visits) {
    const buttonaction = await getButtonAction("visit", visits, req);
    if (visits.dataValues.schedule) {
      const schedule = await db.schedule.findOne({
        where: { name: visits.dataValues.schedule },
      });
      if (schedule) {
        visits.dataValues.scheduleNotes = schedule.dataValues.notes;
      }
    }
    visits.dataValues.action = buttonaction;
    res.status(200).send(visits);
  } else {
    res.status(400).json({
      status: false,
      message: "No data or you don't have access to this document!",
    });
  }
};

const updateVisit = async (req, res) => {
  await UpdateExpired();
  let id = req.params.id;

  const getVisit = await db.visits.findOne({ where: { id: id } });
  const { id_workflow, id_state } = req.body;
  if (id_workflow && id_state) {
    const permission = await permissionUpdateAction(
      id_workflow,
      id_state,
      req,
      getVisit
    );

    if (!getVisit) {
      res.status(400).json({
        status: false,
        message: "Not found data",
      });
      return;
    }
    if (!permission.status) {
      res.status(400).json({
        status: false,
        message: permission.msg,
      });
      return;
    }
    req.body.status = permission.data.status;
    req.body.workState = permission.data.workState;
  }

  const allData = await newVisit(req.userId, "visit");
  isResult = allData.filter((item) => item.id == id);
  const schedule = isResult[0].id_listSchedule;
  if (isResult.length > 0) {
    if (schedule && req.body.status === "1") {
      const listSchedule = await db.listschedule.findOne({
        where: [{ id: schedule }, { id_customer: isResult[0].id_customer }],
        include: [
          {
            model: db.schedule,
            as: "schedule",
            attributes: ["id", "name", "status"],
          },
        ],
      });
      if (!listSchedule) {
        res.status(400).json({
          status: false,
          message: "Schedule not found",
        });
        return;
      }
      if (listSchedule.dataValues.schedule.status !== "1") {
        res.status(400).json({
          status: false,
          message: `Shedule ${isResult[0].schedule} not active`,
        });
        return;
      }
      if (
        listSchedule.dataValues.schedule.status !== "1" &&
        listSchedule.dataValues.doc !== null &&
        listSchedule.dataValues.doc !== ""
      ) {
        res.status(400).json({
          status: false,
          message: `Shedule ${isResult[0].schedule} has been closed with doc ${listSchedule.dataValues.doc}`,
        });
        return;
      }

      await db.listschedule.update(
        { doc: isResult[0].name },
        {
          where: { id: schedule },
        }
      );
    }

    if (
      schedule &&
      isResult[0].status === "1" &&
      (req.body.status === "2" ||
        req.body.status === "0" ||
        req.body.status === "3")
    ) {
      const listSchedule = await db.listschedule.findOne({
        where: [{ id: schedule }, { id_customer: isResult[0].id_customer }],
        include: [
          {
            model: db.schedule,
            as: "schedule",
            attributes: ["id", "name", "status"],
          },
        ],
      });
      if (listSchedule.dataValues.schedule.status !== "1") {
        res.status(400).json({
          status: false,
          message: `Shedule ${isResult[0].schedule} not active`,
        });
        return;
      }
      await db.listschedule.update(
        { doc: "" },
        {
          where: { id: schedule },
        }
      );
    }

    try {
      await db.visits.update(req.body, {
        where: { id: id },
      });
      if (req.file != undefined) {
        try {
          const compressedImage = await path.join(
            __dirname,
            "../public/images",
            isResult[0].img
          );
          await sharp(req.file.path)
            .resize(640, 480, {
              fit: sharp.fit.inside,
              withoutEnlargement: true,
            })
            .jpeg({
              quality: 100,
              progressive: true,
              chromaSubsampling: "4:4:4",
            })
            .withMetadata()
            .toFile(compressedImage, (err, info) => {
              if (err) {
                console.log(err);
              } else {
                console.log(info);
              }
            });
          IO.setEmit("visits", await newVisitById(id, req.userId, "visit"));

          const setNotif = await notif.create({
            id_user: req.userId,
            action: "put",
            doc: "visit",
            page: "visit",
            id_params: id,
            remark: "",
            status: 0,
          });

          if (setNotif) {
            IO.setEmit("notif", true);
          }
          res.status(200).json({
            status: true,
            message: "successfully save data",
            data: await newVisitById(id, req.userId, "visit"),
          });
        } catch (error) {
          console.log(error);
          res
            .status(400)
            .json({ status: false, message: `${error.table} is required` });
        }
      } else {
        IO.setEmit("visits", await newVisit(req.userId, "visit"));
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
            await db.visits.update(
              { isSurvey: "1" },
              {
                where: { id: id },
              }
            );
          } else {
            await db.visits.update(
              { isSurvey: "2" },
              {
                where: { id: id },
              }
            );
          }
        }
        IO.setEmit("visits", await newVisitById(id, req.userId, "visit"));
        const setNotif = await notif.create({
          id_user: req.userId,
          action: "put",
          doc: "visit",
          page: "visit",
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
          data: await newVisitById(id, req.userId, "visit"),
        });
      }
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

const deleteVisit = async (req, res) => {
  let id = req.params.id;
  const allData = await newVisit(req.userId, "visit");
  isResult = allData.filter((item) => item.id == id);
  if (isResult.length > 0) {
    const listSchedule = await db.listschedule.findOne({
      where: { doc: isResult[0].dataValues.name },
      include: [
        {
          model: db.schedule,
          as: "schedule",
          attributes: ["id", "name", "status"],
        },
      ],
    });

    if (listSchedule) {
      if (listSchedule.dataValues.schedule.dataValues.status !== "1") {
        res.status(400).json({
          status: false,
          message: ` Schedule ${listSchedule.dataValues.schedule.dataValues.name} not active `,
        });
        return;
      }
    }
    try {
      await db.visits.destroy({
        where: { id: id },
      });
      if (
        await cekData(
          fs.existsSync(
            path.join(__dirname, "../public/images/" + isResult[0].img)
          )
        )
      ) {
        await fs.unlink(
          path.join(__dirname, "../public/images/" + isResult[0].img),
          function (err) {
            if (err && err.code == "ENOENT") {
              // file doens't exist
              console.log(err);
            } else if (err) {
              // other errors, e.g. maybe we don't have enough permission
              console.log("Error occurred while trying to remove file");
            } else {
              console.log(`removed`);
            }
          }
        );
      } else {
        console.log("file tidak ditemukan");
      }
      IO.setEmit("deleteVisit", id);
      const setNotif = await notif.create({
        id_user: req.userId,
        action: "delete",
        doc: "visit",
        page: "visit",
        id_params: id,
        remark: "",
        status: 0,
      });

      if (setNotif) {
        IO.setEmit("notif", true);
      }

      if (
        isResult[0].dataValues.status === "1" &&
        isResult[0].dataValues.id_listSchedule !== null &&
        isResult[0].dataValues.id_listSchedule !== ""
      ) {
        await db.listschedule.update(
          { doc: "" },
          {
            where: { doc: isResult[0].dataValues.name },
          }
        );
      }
      res.status(200).json({
        status: true,
        message: "successfully delete data",
        data: await newVisit(req.userId, "visit"),
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

const message = async (req, res) => {
  var myModul = await require("../utils/waBot");
  const send = await myModul.kirimpesan(req.body.number, req.body.message);
  console.log(send);
  res.send(req.body);
};

const getByName = async (req, res) => {
  const isBranch = await permissionBranch(req.userId, "visit");
  const isCG = await permissionCG(req.userId, "visit");
  const isCustomer = await permissionCustomer(req.userId, "visit");
  const isUser = await permissionUser(req.userId, "visit");
  let name = req.params.name;
  let visits = await Visits.findOne({
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
        attributes: ["id", "name", "type"],
        where: isCG.length > 0 && {
          id_customergroup: { [Op.or]: [isCG, 1000000] },
        },
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
  if (visits) {
    const buttonaction = await getButtonAction("visit", visits, req);
    if (visits.dataValues.schedule) {
      const schedule = await db.schedule.findOne({
        where: { name: visits.dataValues.schedule },
      });
      if (schedule) {
        visits.dataValues.scheduleNotes = schedule.dataValues.notes;
      }
    }
    visits.dataValues.action = buttonaction;
    res.status(200).send(visits);
  } else {
    res.status(400).json({
      status: false,
      message: "No data or you don't have access to this document!",
    });
  }
};

const getByUser = async (req, res) => {
  const isBranch = await permissionBranch(req.userId, "visit");
  const isCG = await permissionCG(req.userId, "visit");
  const isCustomer = await permissionCustomer(req.userId, "visit");
  const isUser = await permissionUser(req.userId, "visit");
  let id = req.params.id;
  let visits = await Visits.findAll({
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
        attributes: ["id", "name", "type"],
        where: isCG.length > 0 && {
          id_customergroup: { [Op.or]: [isCG, 1000000] },
        },
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
  if (visits) {
    res.status(200).send(visits);
  } else {
    res.status(400).json({
      status: false,
      message: "No data or you don't have access to this document!",
    });
  }
};

const countAllData = async (req) => {
  const isBranch = await permissionBranch(req.userId, "visit");
  const isCG = await permissionCG(req.userId, "visit");
  const isCustomer = await permissionCustomer(req.userId, "visit");
  const isUser = await permissionUser(req.userId, "visit");
  const isWhere = [
    isBranch.length > 0 && { id_branch: { [Op.or]: [isBranch, 1000000] } },
    isCustomer.length > 0 && {
      id_customer: { [Op.or]: [isCustomer, 1000000] },
    },
    isUser.length > 0 && { id_user: isUser },
  ];
  let finalWhere = [];
  if (isBranch.length > 0 || isUser.length > 0 || isCustomer.length > 0) {
    finalWhere = isWhere;
  }
  let data = await Visits.count({
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
        where: isCG.length > 0 && {
          id_customergroup: { [Op.or]: [isCG, 1000000] },
        },
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
  return data;
};

const getPage = async (req, res) => {
  const last_id = parseInt(req.query.lastId) || 0;
  const limit = parseInt(req.query.limit) || 10;
  const search = parseInt(req.query.search) || "";
  const isBranch = await permissionBranch(req.userId, "visit");
  const isCG = await permissionCG(req.userId, "visit");
  const isCustomer = await permissionCustomer(req.userId, "visit");
  const isUser = await permissionUser(req.userId, "visit");

  const isWhere = [
    isBranch.length > 0 && { id_branch: { [Op.or]: [isBranch, 1000000] } },
    isCustomer.length > 0 && {
      id_customer: { [Op.or]: [isCustomer, 1000000] },
    },
    isUser.length > 0 && { id_user: isUser },
    last_id > 0 && { id: { [Op.lt]: last_id } },
  ];

  try {
    const filters = req.query.filters ? JSON.parse(req.query.filters) : [];
    const filterUsers = req.query.filteruser
      ? JSON.parse(req.query.filteruser)
      : [];
    const filterBranchs = req.query.filterbranch
      ? JSON.parse(req.query.filterbranch)
      : [];
    const filterCustomers = req.query.filtercustomer
      ? JSON.parse(req.query.filtercustomer)
      : [];
    const filterCustomerGroups = req.query.filtercustomergroup
      ? JSON.parse(req.query.filtercustomergroup)
      : [];
    let defaultfilter = GetFilter(filters) ? GetFilter(filters) : [];
    let filterUser = GetFilter(filterUsers) ? GetFilter(filterUsers) : [];
    let filterBranch = GetFilter(filterBranchs) ? GetFilter(filterBranchs) : [];
    let filterCustomer = GetFilter(filterCustomers)
      ? GetFilter(filterCustomers)
      : [];
    let filterCustomerGroup = GetFilter(filterCustomerGroups)
      ? GetFilter(filterCustomerGroups)
      : [];
    
  // let coba = defaultfilter;
  // console.log(coba)
  //     return
    let finalWhere = [{}, last_id > 0 && { id: { [Op.lt]: last_id } }];

    if (isBranch.length > 0 || isUser.length > 0 || isCustomer.length > 0) {
      finalWhere = isWhere;
    }
    finalWhere = [...finalWhere, ...defaultfilter];
    filterCustomer = [
      {},
      isCG.length > 0 && {
        id_customergroup: { [Op.or]: [isCG, 1000000] },
      },
      ...filterCustomer,
    ];

    let visits = await Visits.findAll({
      where: finalWhere,
      include: [
        {
          model: db.users,
          as: "user",
          attributes: ["id", "name", "img", "username", "email", "phone"],
          where: filterUser,
        },
        {
          model: db.branch,
          as: "branch",
          attributes: ["id", "name"],
          where: filterBranch,
        },
        {
          model: db.customers,
          as: "customer",
          attributes: ["id", "name", "type", "id_customerGroup", "status"],
          where: filterCustomer,
          include: [
            {
              model: db.customergroup,
              as: "customergroup",
              attributes: ["id", "name", "deskripsi", "status"],
              where: filterCustomerGroup,
            },
          ],
        },
      ],
      order: [["id", "DESC"]],
      limit: limit,
    });

    res.status(200).json({
      lastId: visits.length ? visits[visits.length - 1].id : 0,
      hasMore: visits.length >= limit ? true : false,
      total: await countAllData(req),
      data: visits,
    });
  } catch (error) {
    res.status(400).json({ msg: "Bad Request" });
  }
};

module.exports = {
  create,
  getAllVisit,
  getOneVisit,
  updateVisit,
  deleteVisit,
  message,
  getByStatus,
  getByName,
  getByUser,
  newVisit,
  getPage,
};
