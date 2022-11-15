const { Op } = require("sequelize");
const db = require("../models");
var IO = require("../app");
const IsData = db.roleusers;

const newData = async () => {
  return await IsData.findAll({
    attributes: ["id", "id_roleprofile", "status"],
    include: [
      {
        model: db.roleprofiles,
        as: "roleprofile",
        attributes: ["id", "name", "status"],
        include: [
          {
            model: db.rolelists,
            as: "rolelist",
            attributes: [
              "id",
              "doc",
              "create",
              "read",
              "update",
              "delete",
              "amend",
              "submit",
              "report",
              "export",
              "status",
            ],
          },
        ],
      },
    ],
    order: [["id", "DESC"]],
  });
};

const create = async (req, res) => {
  let input = {
    id_roleprofile: req.body.id_roleprofile,
    uniqid: req.body.id_roleprofile.toString() + req.body.id_user.toString(),
    id_user: req.body.id_user,
  };

  try {
    const data = await IsData.create(input);
    IO.setEmit("roleusers", await newData());
    res.status(200).json({
      status: true,
      message: "successfully save data",
      data: data,
    });
  } catch (error) {
    res.status(400).json({ status: false, message: error.errors[0].message });
  }
};

const getAllData = async (req, res) => {
  let data = await IsData.findAll({
    attributes: ["id", "id_roleprofile", "status"],
    include: [
      {
        model: db.roleprofiles,
        as: "roleprofile",
        attributes: ["id", "name", "status"],
        include: [
          {
            model: db.rolelists,
            as: "rolelist",
            attributes: [
              "id",
              "doc",
              "create",
              "read",
              "update",
              "delete",
              "amend",
              "submit",
              "report",
              "export",
              "status",
            ],
          },
        ],
      },
    ],
    order: [["id", "DESC"]],
  });
  IO.setEmit("roleusers", await newData());
  res.send(data);
};

const getOneData = async (req, res) => {
  let id = req.params.id;
  let data = await IsData.findOne({ where: { id: id } });
  res.status(200).send(data);
};

const updateData = async (req, res) => {
  let id = req.params.id;
  try {
    const data = await IsData.update(req.body, { where: { id: id } });
    if (data > 0) {
      IO.setEmit("roleusers", await newData());
      res.status(200).json({
        status: true,
        message: "successfully save data",
        data: await newData(),
      });
    } else {
      res.status(400).json({ status: false, message: "No Data" });
    }
  } catch (error) {
    res.status(400).json({ status: false, message: "failed to update data" });
  }
};

const deleteData = async (req, res) => {
  let id = req.params.id;
  try {
    const data = await IsData.destroy({ where: { uniqid: id } });
    console.log(data)
    if (data > 0) {
      IO.setEmit("roleusers", await newData());
      res.status(200).json({
        status: true,
        message: "successfully delete data",
        data: await newData(),
      });
    } else {
      res.status(400).json({ status: false, message: "No data" });
    }
  } catch (error) {
    res.send(error)
    res.status(400).json({ status: false, message: "failed to delete data" });
  }
};


const getByUser = async (req, res) => {
  let data = await IsData.findAll({
     where: { id_user: req.params.id } ,
    attributes: ["id", "id_roleprofile", "status"],
    include: [
      {
        model: db.roleprofiles,
        as: "roleprofile",
        attributes: ["id", "name", "status"],
        include: [
          {
            model: db.rolelists,
            as: "rolelist",
            attributes: [
              "id",
              "doc",
              "create",
              "read",
              "update",
              "delete",
              "amend",
              "submit",
              "report",
              "export",
              "status",
            ],
          },
        ],
      },
    ],
    order: [["id", "DESC"]],
  });
  IO.setEmit("roleusers", await newData());
  res.send(data);
};

module.exports = {
  create,
  getAllData,
  getOneData,
  updateData,
  deleteData,
  getByUser
};
