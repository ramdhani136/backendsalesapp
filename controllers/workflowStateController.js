const db = require("../models");

const Data = db.workflowstate;

const newData = async () => {
  return await Data.findAll({
    order: [["id", "DESC"]],
    include: [{ model: db.users, as: "user", attributes: ["id", "name"] }],
  });
};

const create = async (req, res) => {
  let data = {
    name: req.body.name,
    id_user: req.userId,
  };

  if (!req.body.name) {
    res.status(400).json({
      status: false,
      message: "Name is mandatory",
    });
    return;
  }

  try {
    const result = await Data.create(data);
    res.status(200).json({
      status: true,
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      data: error,
    });
  }
};

const getAll = async (req, res) => {
  res.status(200).json({
    status: true,
    data: await newData(),
  });
};

const getOne = async (req, res) => {
  let id = req.params.id;
  let result = await Data.findOne({
    where: [{ id: id }],
    include: [{ model: db.users, as: "user", attributes: ["id", "name"] }],
  });
  res.status(200).json({
    status: true,
    data: result,
  });
};

const update = async (req, res) => {
  let id = req.params.id;
  try {
    const result = await Data.update(req.body, {
      where: [{ id: id }],
    });
    if (result > 0) {
      res.status(200).json({
        status: true,
        data: await newData(),
      });
    }
  } catch (error) {
    res.status(400).json({ status: false, data: error });
  }
};

const deleteData = async (req, res) => {
  let id = req.params.id;
  try {
    await Data.destroy({
      where: [{ id: id }],
    });

    res.status(200).json({
      status: true,
      message: "successfully delete data",
      data: await newData(req.userId, "workflow"),
    });
  } catch (error) {
    res.status(400).json({ status: false, data: error });
  }
};

module.exports = {
  create,
  getAll,
  getOne,
  update,
  deleteData,
};
