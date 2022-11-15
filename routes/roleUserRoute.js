const express = require("express");
const router = express.Router();
const controller = require("../controllers/roleUserController");

router.post("/", controller.create);
router.get("/", controller.getAllData);
router.get("/:id", controller.getOneData);
router.get("/user/:id", controller.getByUser);
router.put("/:id", controller.updateData);
router.delete("/:id", controller.deleteData);

module.exports = router;
