const db = require("../models");
var IO = require("../app");
const { permissionUser } = require("../middleware/getPermission");
const { actionstate } = require("../models");

const Data = db.workflow;

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

const newData = async (userId, type) => {
  const isUser = await permissionUser(userId, type);
  const isWhere = [isUser.length > 0 && { id_user: isUser }];
  let finalWhere = [];
  if (isUser.length > 0) {
    finalWhere = isWhere;
  }
  return await Data.findAll({
    where: finalWhere,
    order: [["id", "DESC"]],
    include: [{ model: db.users, as: "user", attributes: ["id", "name"] }],
  });
};

const create = async (req, res) => {
  let data = {
    name: req.body.name,
    doc: req.body.doc,
    id_user: req.userId,
    status: req.status,
  };

  if (!req.body.name) {
    res.status(400).json({
      status: false,
      message: "Name is mandatory",
    });
    return;
  }
  if (!req.body.doc) {
    res.status(400).json({
      status: false,
      message: "Doc is mandatory",
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
  IO.setEmit("workflow", await newData(req.userId, "workflow"));
  res.status(200).json({
    status: true,
    data: await newData(req.userId, "workflow"),
  });
};

const getOne = async (req, res) => {
  const isUser = await permissionUser(req.userId, "workflow");
  let id = req.params.id;
  let result = await Data.findOne({
    where: [{ id: id }, isUser.length > 0 && { id_user: isUser }],
    include: [{ model: db.users, as: "user", attributes: ["id", "name"] }],
  });
  res.status(200).json({
    status: true,
    data: result,
  });
};

const update = async (req, res) => {
  const isUser = await permissionUser(req.userId, "workflow");
  let id = req.params.id;
  try {
    const result = await Data.update(req.body, {
      where: [{ id: id }, isUser.length > 0 && { id_user: isUser }],
    });
    if (result > 0) {
      res.status(200).json({
        status: true,
        data: await newData(req.userId, "worklfow"),
      });
    } else {
      res.status(400).json({
        status: false,
        message: "No data or you don't have access to this document!",
      });
    }
  } catch (error) {
    res.status(400).json({ status: false, data: error });
  }
};

const deleteData = async (req, res) => {
  const isUser = await permissionUser(req.userId, "workflow");
  let id = req.params.id;
  try {
    const result = await Data.destroy({
      where: [{ id: id }, isUser.length > 0 && { id_user: isUser }],
    });
    if (result > 0) {
      res.status(200).json({
        status: true,
        message: "successfully delete data",
        data: await newData(req.userId, "workflow"),
      });
    } else {
      res.status(400).json({
        status: false,
        message: "No data or you don't have access to this document!",
      });
    }
  } catch (error) {
    res.status(400).json({ status: false, data: error });
  }
};

const disableWorkflow = async (req, res) => {
  if (checkValid(res, "Doc Type", req.body.doc)) {
    return;
  }
  const result = await Data.findAll({
    where: [{ status: "1" }, { doc: req.body.doc }],
  });
  if (result.length > 0) {
    try {
      for (let item of result) {
        await Data.update(
          { status: "0" },
          {
            where: [{ id: item.dataValues.id }],
          }
        );
      }
      res.sendStatus(200);
    } catch (error) {
      res.status(400).json({ status: false, data: error });
    }
    return;
  }
  res.sendStatus(200);
};

const deleteChildById = async (req, res) => {
  const id = req.params.id;
  try {
    await db.actionstate.destroy({ where: { id_workflow: id } });
    await db.workflowtransition.destroy({ where: { id_workflow: id } });
    res.sendStatus(200);
  } catch (error) {
    res.status(400).json({ status: false, data: error });
  }
};

const getRole = async (req) => {
  const roleuser = await db.roleusers.findAll({
    where: { id_user: req.userId },
  });

  const finalroleuser = roleuser.map((item) => {
    return item.id_roleprofile;
  });
  return finalroleuser;
};

const getButtonAction = async (doc, docrelasi, req) => {
  const finalroleuser = getRole(req);
  const workflow = await Data.findOne({
    where: [{ status: 1 }, { doc: doc }],
  });

  if (workflow) {
    const id_workflow = workflow.id;
    const transition = await db.workflowtransition.findAll({
      where: [{ id_workflow: id_workflow }],
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
          where: { name: docrelasi.dataValues.workState },
        },
        {
          model: db.workflowstate,
          as: "nextstate",
          attributes: ["name"],
        },
      ],
    });

    let allfilter = [];
    for (let listtrans of transition) {
      if (listtrans.dataValues.selfApproval) {
        if (docrelasi.dataValues.id_created === req.userId) {
          allfilter.push(listtrans);
        }
      } else {
        let generateAccess = finalroleuser.find((item) => {
          return (
            item === listtrans.dataValues.id_role ||
            listtrans.dataValues.role.dataValues.name === "All"
          );
        });
        if (generateAccess) {
          allfilter.push(listtrans);
        }
      }
    }

    const restruct = allfilter.map((item) => {
      return {
        id_workflow: id_workflow,
        name: item.action.name,
        nextstate: {
          id: item.id_nextState,
          name: item.nextstate.name,
        },
      };
    });

    return restruct;
  } else {
    return [];
  }
};

const permissionUpdateAction = async (workflow, state, req, doc) => {
  const role =await getRole(req);

  const getState = await db.actionstate.findOne({
    where: [{ id_workflow: workflow, id_state: state }],
    include: [
      {
        model: db.workflowstate,
        as: "state",
        attributes: ["name"],
      },
      { model: db.roleprofiles, as: "role", attributes: ["name"] },
    ],
  });

  if (getState) {
    if (getState.selfApproval) {
      if (`${req.userId}` === `${doc.id_created}`) {
        return {
          status: true,
          data: { status: getState.docStatus, workState: getState.state.name },
        };
      }
    }
    if( getState.role.name==="All"){
      return {
        status: true,
        data: { status: getState.docStatus, workState: getState.state.name },
      };
    }
    if (role.length) {
      if (`${role}` === `${getState.id_role}`) {
        return {
          status: true,
          data: { status: getState.docStatus, workState: getState.state.name },
        };
      }
    }
    return { status: false, msg: "Not Permission to change this state!" };
  } else {
    return { status: false, msg: "Not found next state!" };
  }
};

module.exports = {
  create,
  getAll,
  getOne,
  update,
  deleteData,
  disableWorkflow,
  deleteChildById,
  getButtonAction,
  permissionUpdateAction,
};
