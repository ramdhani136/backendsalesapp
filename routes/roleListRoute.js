const express = require("express");
const router = express.Router();
const rolelist = require("../controllers/roleListController");

router.post("/", rolelist.create);
router.get("/", rolelist.getAllRoleList);
router.get("/:id", rolelist.getOneRoleList);
router.put("/:id", rolelist.updateRoleList);
router.delete("/:id", rolelist.deleteRoleList);

module.exports = router;
