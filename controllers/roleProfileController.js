const { Op } = require("sequelize");
const db = require("../models");
const { permissionBranch, permissionUser } = require("../middleware/getPermission");
var IO = require("../app");
const RoleProfile = db.roleprofiles;

const newProfile = async (userId, type) => {
  const isBranch = await permissionBranch(userId, type);
  const isUser = await permissionUser(userId, type);
  const isWhere = [
    isBranch.length > 0 && { id_branch: isBranch },
    isUser.length > 0 && { id_user: isUser },
  ];
  let finalWhere = [];
  if (isBranch.length > 0 || isUser.length > 0) {
    finalWhere = isWhere;
  }
  return await RoleProfile.findAll({
    where: finalWhere,
    order: [["name", "ASC"]],
    include: [
      // {
      //   model: db.rolelists,
      //   as: "rolelist",
      //   where: {
      //     status: 1,
      //   },
      //   attributes: [
      //     "id",
      //     "doc",
      //     "create",
      //     "read",
      //     "update",
      //     "delete",
      //     "amend",
      //     "submit",
      //     "report",
      //     "export",
      //   ],
      // },
      { model: db.users, as: "user", attributes: ["id", "name"] },
      { model: db.branch, as: "branch", attributes: ["id", "name"] },
    ],
  });
};

const create = async (req, res) => {
  let data = {
    name: req.body.name,
    status: req.body.status,
    id_user: req.body.id_user,
    id_branch: req.body.id_branch,
  };

  try {
    const roleprofile = await RoleProfile.create(data);
    IO.setEmit("roleprofiles", await newProfile(req.userId, "roleprofile"));
    res.status(200).json({
      status: true,
      message: "successfully save data",
      data: roleprofile,
    });
  } catch (error) {
    res.status(400).json({ status: false, message: error.errors[0].message });
  }
};

const getAllProfile = async (req, res) => {
  const isBranch = await permissionBranch(req.userId, "roleprofile");
  const isUser = await permissionUser(req.userId, "roleprofile");
  const isWhere = [
    isBranch.length > 0 && { id_branch: isBranch },
    isUser.length > 0 && { id_user: isUser },
  ];
  let finalWhere = [];
  if (isBranch.length > 0 || isUser.length > 0) {
    finalWhere = isWhere;
  }
  let roleprofile = await RoleProfile.findAll({
    where: finalWhere,
    order: [["name", "ASC"]],
    // DIUBAH NANTI DI CEK
    include: [
    //   {
    //     model: db.rolelists,
    //     as: "rolelist",
    //     where: {
    //       status: true,
    //     },
    //     attributes: [
    //       "id",
    //       "doc",
    //       "create",
    //       "read",
    //       "update",
    //       "delete",
    //       "amend",
    //       "submit",
    //       "report",
    //       "export",
    //     ],
    //   },
      { model: db.users, as: "user", attributes: ["id", "name"] },
      { model: db.branch, as: "branch", attributes: ["id", "name"] },
    ],
  });
  IO.setEmit("roleprofiles", await newProfile(req.userId, "roleprofile"));
  res.send(roleprofile);
};

const getOneProfile = async (req, res) => {
  const isBranch = await permissionBranch(req.userId, "roleprofile");
  const isUser = await permissionUser(req.userId, "roleprofile");
  let id = req.params.id;
  let profile = await RoleProfile.findOne({
    where: [
      { id: id },
      isBranch.length > 0 && { id_branch: isBranch },
      isUser.length > 0 && { id_user: isUser },
    ],

    include: [
      // {
      //   model: db.rolelists,
      //   as: "rolelist",
      //   where: {
      //     status: 1,
      //   },
      //   attributes: [
      //     "id",
      //     "doc",
      //     "create",
      //     "read",
      //     "update",
      //     "delete",
      //     "amend",
      //     "submit",
      //     "report",
      //     "export",
      //   ],
      // },
      { model: db.users, as: "user", attributes: ["id", "name"] },
      { model: db.branch, as: "branch", attributes: ["id", "name"] },
    ],
  });

  if (profile) {
    res.status(200).send(profile);
  } else {
    res.status(400).json({
      status: false,
      message: "No data or you don't have access to this document!",
    });
  }
};

const updateProfile = async (req, res) => {
  const isBranch = await permissionBranch(req.userId, "roleprofile");
  const isUser = await permissionUser(req.userId, "roleprofile");
  let id = req.params.id;
  try {
    const profile = await RoleProfile.update(req.body, {
      where: [
        { id: id },
        isBranch.length > 0 && { id_branch: isBranch },
        isUser.length > 0 && { id_user: isUser },
      ],
    });
    if (profile > 0) {
      IO.setEmit("roleprofiles", await newProfile(req.userId, "roleprofile"));
      res.status(200).json({
        status: true,
        message: "successfully save data",
        data: await newProfile(req.userId, "roleprofile"),
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

const deleteProfile = async (req, res) => {
  const isBranch = await permissionBranch(req.userId, "roleprofile");
  const isUser = await permissionUser(req.userId, "roleprofile");
  let id = req.params.id;
  try {
    const hapus = await RoleProfile.destroy({
      where: [
        { id: id },
        isBranch.length > 0 && { id_branch: isBranch },
        isUser.length > 0 && { id_user: isUser },
      ],
    });
    if (hapus > 0) {
      IO.setEmit("roleprofiles", await newProfile(req.userId, "roleprofile"));
      res.status(200).json({
        status: true,
        message: "successfully delete data",
        data: await newProfile(req.userId, "roleprofile"),
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
  getAllProfile,
  getOneProfile,
  updateProfile,
  deleteProfile,
};
