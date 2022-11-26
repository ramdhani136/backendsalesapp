const db = require("../models");

const Data = db.workflowtransition;

const newData = async () => {
  return await Data.findAll({
    order: [["id", "DESC"]],
    include: [
      { model: db.workflow, as: "workflow", attributes: ["name"] },
      { model: db.users, as: "user", attributes: ["name"] },
      {
        model: db.workflowaction,
        as: "action",
        attributes: ["name"],
      },
      { model: db.roleprofiles, as: "role", attributes: ["name"] },
      {
        model: db.workflowstate,
        as: "stateactive",
        attributes: ["name"],
      },
      {
        model: db.workflowstate,
        as: "nextstate",
        attributes: ["name"],
      },
    ],
  });
};

const checkValid = (res, name, data) => {
  if (!data) {
    res.status(400).json({
      status: false,
      message: `${name} is mandatory`,
    });
    return true;
  } else {
    return false;
  }
};

const create = async (req, res) => {
  let data = {
    id_workflow: req.body.id_workflow,
    id_stateActive: req.body.id_stateActive,
    id_action: req.body.id_action,
    id_nextState: req.body.id_nextState,
    id_role: req.body.id_role,
    selfApproval: req.body.selfApproval,
    id_user: req.userId,
  };

  if (checkValid(res, "Worflow", req.body.id_workflow)) {
    return;
  }

  if (checkValid(res, "State Active", req.body.id_stateActive)) {
    return;
  }

  if (checkValid(res, "Action", req.body.id_action)) {
    return;
  }

  if (checkValid(res, "Next State", req.body.id_nextState)) {
    return;
  }

  if (checkValid(res, "Role", req.body.id_role)) {
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
    include: [
      { model: db.workflow, as: "workflow", attributes: ["name"] },
      { model: db.users, as: "user", attributes: ["name"] },
      {
        model: db.workflowaction,
        as: "action",
        attributes: ["name"],
      },
      { model: db.roleprofiles, as: "role", attributes: ["name"] },
      {
        model: db.workflowstate,
        as: "stateactive",
        attributes: ["name"],
      },
      {
        model: db.workflowstate,
        as: "nextstate",
        attributes: ["name"],
      },
    ],
  });
  res.status(200).json({
    status: true,
    data: result,
  });
};

const getByWorkflow = async (req, res) => {
  let id = req.params.id;
  let result = await Data.findAll({
    where: [{ id_workflow: id }],
    include: [
      { model: db.workflow, as: "workflow", attributes: ["name"] },
      { model: db.users, as: "user", attributes: ["name"] },
      {
        model: db.workflowaction,
        as: "action",
        attributes: ["name"],
      },
      { model: db.roleprofiles, as: "role", attributes: ["name"] },
      {
        model: db.workflowstate,
        as: "stateactive",
        attributes: ["name"],
      },
      {
        model: db.workflowstate,
        as: "nextstate",
        attributes: ["name"],
      },
    ],
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
  getByWorkflow,
};
