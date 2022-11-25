const express = require("express");
const router = express.Router();
const controller = require("../controllers/actionStateController");

router.post("/", controller.create);
router.get("/", controller.getAll);
router.get("/:id", controller.getOne);
router.get("/workflow/:id", controller.getByWorkflow);
router.put("/:id", controller.update);
router.delete("/:id", controller.deleteData);

module.exports = router;
